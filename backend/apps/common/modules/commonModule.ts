import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import {LoggerModule} from './loggerModule';
import * as path from 'path';
import {ConfigurationService} from '../services/configuration.service';
import { I18nModule, QueryResolver, HeaderResolver } from 'nestjs-i18n';
@Module({
  imports: [ 
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule,
    I18nModule.forRootAsync({     
      useFactory: async () => ({
        path: path.join(__dirname, "/i18n"),
        fallbackLanguage: "en", // e.g., 'en'
        filePattern: "*.i18n.json", // e.g., '*.i18n.json'
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        HeaderResolver,
      ]
    })
  ],
  providers: [ConfigurationService],
  exports: [I18nModule],
})
export class CommonModule {}
