import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@common/modules/commonModule';
import { DemoModule } from './modules/demo/demo.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    DemoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
