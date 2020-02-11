import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { FlubErrorHandler } from 'nestjs-flub';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import AppMisconfigurationException from '../exceptions/AppMisconfigurationException';
import ServerFailedStartException from '../exceptions/ServerFailedStartException';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const Servers = {};
declare const module: any;
export class APIServer {
  private serverName;
  private hybridMode = false;
  private microServiceMode;
  private microServiceOps;
  private configService = null;
  private AppModule;
  constructor(
    serverName,
    AppModule,
    hybridMode = false,
    mode: Transport = Transport.TCP,
    options = {},
  ) {
    this.serverName = serverName;
    this.AppModule = AppModule;
    console.log(`Start init Server ${this.ServerName}`);
    if (hybridMode) {
      this.setMicroServiceMode(mode, options);
    }
  }
  get ServerName() {
    return this.serverName;
  }
  async shotDownServer() {
    if (Servers[this.ServerName].app) {
      Servers[this.ServerName].app.close();
      delete Servers[this.ServerName];
      console.log(`Stop Server ${this.ServerName}`);
    }
  }

  async startServer() {
    console.log(`Start Server ${this.ServerName}`);
    if (!this.ServerName || this.ServerName === '') {
      console.error(`Failed Start Server ${this.ServerName}`);
      throw new ServerFailedStartException(this.ServerName);
    }
    const server = express();
    const app = await NestFactory.create(
      this.AppModule,
      new ExpressAdapter(server),
    );
    this.configService = app.get(ConfigService);
    const isDevelopMode = this.configService.get('app.isDevelopMode');
    const isDevelopAllowHttps = this.configService.get(
      'app.isDevelopAllowHttps',
    );
    const isProduction = this.isEnvirementOnProductionMode();
    const allowHttps = this.configService.get('app.https.enable');
    const allowHttp = this.configService.get('app.http.enable');
    if (!allowHttp && !allowHttps) {
      console.error(`Failed Start Server ${this.ServerName}`);
      throw new AppMisconfigurationException([
        'app.https.enable',
        'app.http.enable',
      ]);
    }
    Servers[this.ServerName] = {
      app: app,
      start: this.startServer.bind(this),
      stop: this.shotDownServer.bind(this),
      restart: this.reloadServer.bind(this),
      env: {
        isDevelopMode,
        isDevelopAllowHttps,
        isProduction,
        allowHttps,
        allowHttp,
      },
    };
    if (this.hybridMode) {
      Servers[this.ServerName]['microservice'] = {
        mode: this.microServiceMode,
        options: this.microServiceOps,
      };
    }
    this.loadMiddleware();
    this.loadHybridMode();
    await Servers[this.ServerName].app.init();
    this.connectWebProtocol(server);
  }

  reloadServer() {
    console.log(`restart Server ${this.ServerName}`);
    this.shotDownServer();
    this.startServer();
  }

  private setMicroServiceMode(mode: Transport = Transport.TCP, options = {}) {
    this.hybridMode = true;
    this.microServiceMode = mode;
    this.microServiceOps = options;
    console.log(`Set Server ${this.ServerName} to hybrit mode`);
  }

  private async loadHybridMode() {
    if (this.hybridMode) {
      const microservice = Servers[this.ServerName].app.connectMicroservice({
        transport: this.microServiceMode,
        options: this.microServiceOps,
      });
      Servers[this.ServerName]['microservice'] = microservice;
      await Servers[this.ServerName].app.startAllMicroservicesAsync();
      console.log(`bind Server  ${this.ServerName} to microservice`);
    }
  }
  private async loadMiddleware() {
    if (!Servers[this.ServerName].env.isDevelopMode) {
      Servers[this.ServerName].app.use(compression());
    }
    if (
      !Servers[this.ServerName].env.isDevelopMode &&
      Servers[this.ServerName].env.isProduction
    ) {
      Servers[this.ServerName].app.use(
        rateLimit({
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // limit each IP to 100 requests per windowMs
        }),
      );
    }
    if (Servers[this.ServerName].env.isDevelopMode) {
      Servers[this.ServerName].app.useGlobalFilters(new FlubErrorHandler());
      this.applyDocumentSwaggerToApiServer();
    }
    Servers[this.ServerName].app.use(helmet());
    Servers[this.ServerName].app.enableCors();
    console.log(`load middlewares on Server ${this.ServerName}`);
  }
  private connectWebProtocol(server) {
    if (
      (Servers[this.ServerName].env.isDevelopAllowHttps ||
        Servers[this.ServerName].env.isProduction) &&
      Servers[this.ServerName].env.allowHttps
    ) {
      console.log(`bind Server On HTTPS MODE ${this.ServerName}`);
      const httpsOptions = {
        key: fs.readFileSync(this.configService.get('app.https.key')),
        cert: fs.readFileSync(this.configService.get('app.https.crt')),
      };
      https
        .createServer(httpsOptions, server)
        .listen(this.configService.get('app.https.port'));
    }
    if (Servers[this.ServerName].env.allowHttp) {
      console.log(`bind Server On HTTP MODE ${this.ServerName}`);
      http.createServer(server).listen(this.configService.get('app.http.port'));
    }

    if (module.hot && !Servers[this.ServerName].env.isProduction) {
      module.hot.accept();
      module.hot.dispose(() => Servers[this.ServerName].app.close());
    }
  }
  private applyDocumentSwaggerToApiServer() {
    const options = new DocumentBuilder()
      .setTitle(`${this.ServerName} Api Document`)
      .setDescription(`Api Serivce of ${this.ServerName}`)
      .setVersion('1.0')
      .addTag(this.ServerName)
      .addTag('api')
      .build();
    const document = SwaggerModule.createDocument(
      Servers[this.ServerName].app,
      options,
    );
    SwaggerModule.setup(
      this.configService.get('app.apiDocumentPath'),
      Servers[this.ServerName].app,
      document,
    );
  }
  private isEnvirementOnProductionMode() {
    const modes: Array<string> =
      this.configService.get('app.modesAutoTriggerProduction') || [];
    let resultMode = false;
    modes.map(mode => {
      resultMode = mode.toLowerCase() === process.env.NODE_ENV;
    });
    return resultMode;
  }
}
export default Servers;
