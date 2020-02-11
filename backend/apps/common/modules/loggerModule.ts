import { Module ,forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from 'nest-logger';
import { CommonModule } from './commonModule';
import {ConfigurationService} from '../services/configuration.service';
@Module({
  imports: [forwardRef(() =>CommonModule)],
  providers: [
    {
      provide: LoggerService,
      useFactory: (config: ConfigurationService) => {
        // getLoggers() is a helper function to get configured console and/or rotate logger transports.
        // It takes takes two parameters:
        // 1: Appenders where to log to: console or rotate or both in array
        //    (eg. [LoggerTransport.CONSOLE, LoggerTransport.ROTATE])
        // 2: Logger options object that contains the following properties:
        //    timeFormat?: winston's time format syntax. Defaults to "HH:mm:ss".
        //    colorize?: whether to colorize the log output. Defaults to true.
        //    consoleOptions?: see Winston's ConsoleTransportOptions interface
        //    fileOptions?: see Winston Daily Rotate File's DailyRotateFile.DailyRotateFileTransportOptions
        const serverName = process.env.SERVER_NAME;
        const filePath = config.getConfigValue('log.general.fullFileName');
        const loggers = [];
        if (config.getConfigValue('log.supportConsole')) {
          loggers.push(
            LoggerService.console({
              timeFormat: config.getConfigValue('log.general.datePattenConsole'),
            }),
          );
        }
        if (config.getConfigValue('log.supportFiles')) {
          loggers.push(
            LoggerService.rotate({
              colorize: !!config.getConfigValue('log.general.colorize'),
              fileOptions: {
                filename: filePath.replace('$SERVERNAME$', serverName),
                datePattern: config.getConfigValue('log.general.datePatten'),
                zippedArchive: !!config.getConfigValue('log.general.zip'),
                maxSize: config.getConfigValue('log.general.maxSize'),
                maxFiles: config.getConfigValue('log.general.maxFiles'),
              },
            }),
          );
        }
        // LoggerService constructor will take two parameters:
        // 1. Log level: debug, info, warn or error
        // 2. List of logger transport objects.
        return new LoggerService(config.getConfigValue('log.logLevel'), loggers);
      },
      inject: [ConfigurationService],
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
