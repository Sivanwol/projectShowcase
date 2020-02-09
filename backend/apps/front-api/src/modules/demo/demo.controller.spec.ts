import { Test, TestingModule } from '@nestjs/testing';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

describe('AppController', () => {
  let demoController: DemoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DemoController],
      providers: [DemoService],
    }).compile();

    demoController = app.get<DemoController>(DemoController);
  });

  describe('root', () => {
    it('should return "Hello test"', () => {
      expect(demoController.keepAlive('en','test')).toBe('Hello test');
    });
  });
});
