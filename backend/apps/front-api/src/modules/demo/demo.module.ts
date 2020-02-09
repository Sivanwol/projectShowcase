import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'common/config/configuration';
import { CommonModule } from 'common/modules/commonModule';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CommonModule
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}