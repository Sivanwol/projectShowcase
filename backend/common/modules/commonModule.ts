import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {LoggerModule} from './loggerModule';
@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
