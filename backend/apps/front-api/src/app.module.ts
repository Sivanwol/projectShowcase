import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '@common/config/configuration';
import { CommonModule } from '@common/modules/commonModule';
import { DemoModule } from './modules/demo/demo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CommonModule,
    DemoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
