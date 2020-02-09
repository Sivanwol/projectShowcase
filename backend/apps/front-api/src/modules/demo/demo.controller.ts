import { Controller, Get, Param } from '@nestjs/common';
import { DemoService } from './demo.service';
import { I18nLang } from 'nestjs-i18n';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get(':text')
  keepAlive(@I18nLang() lang: string, @Param('text') text): string {
    return this.demoService.getKeepAlive(lang, text);
  }
}
