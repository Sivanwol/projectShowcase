import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import microServerConfig from '../../microservices.config'
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: microServerConfig.redisServer,
    },
  });
  await app.listen(() => "Config Server Up And running");
}
// rebbitmq
bootstrap();
