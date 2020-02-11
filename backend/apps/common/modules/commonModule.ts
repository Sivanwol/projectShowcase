import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {LoggerModule} from './loggerModule';
import * as path from 'path';
import { I18nModule, QueryResolver, HeaderResolver } from 'nestjs-i18n';
@Module({
  imports: [ 
    ConfigModule,
    LoggerModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        path: path.join(__dirname, configService.get('i18n.path')),
        fallbackLanguage: configService.get('i18n.fallbackLanguage'), // e.g., 'en'
        filePattern: configService.get('i18n.patten'), // e.g., '*.i18n.json'
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        HeaderResolver,
      ],
      imports: [ConfigModule],
      inject: [ConfigService]
    })
  ],
  providers: [],
  exports: [I18nModule],
})
export class CommonModule {}
