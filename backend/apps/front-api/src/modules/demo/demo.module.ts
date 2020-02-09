import { Module } from '@nestjs/common';
import { CommonModule } from '@common/modules/commonModule';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  imports: [
    CommonModule
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}