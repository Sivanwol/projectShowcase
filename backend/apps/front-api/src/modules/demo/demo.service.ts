import { Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class DemoService {
    constructor(private readonly i18nService: I18nRequestScopeService) {}
  getKeepAlive(lang='en', sometext = 'test'): string {
    return this.i18nService.translate("", {
        lang,
        args: {
            sometext
        }
    });
  }
}
