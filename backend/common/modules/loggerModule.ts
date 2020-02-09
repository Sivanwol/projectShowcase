import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService } from 'nest-logger';
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LoggerService,
      useFactory: (config: ConfigService) => {
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
        const filePath = config.get('log.general.fullFileName');
        const loggers = [];
        if (config.get('log.supportConsole')) {
          loggers.push(
            LoggerService.console({
              timeFormat: config.get('log.general.datePattenConsole'),
            }),
          );
        }
        if (config.get('log.supportFiles')) {
          loggers.push(
            LoggerService.rotate({
              colorize: config.get('log.general.colorize'),
              fileOptions: {
                filename: filePath.replace('$SERVERNAME$', serverName),
                datePattern: config.get('log.general.datePatten'),
                zippedArchive: config.get('log.general.zip'),
                maxSize: config.get('log.general.maxSize'),
                maxFiles: config.get('log.general.maxFiles'),
              },
            }),
          );
        }
        // LoggerService constructor will take two parameters:
        // 1. Log level: debug, info, warn or error
        // 2. List of logger transport objects.
        return new LoggerService(config.get('log.logLevel'), loggers);
      },
      inject: [ConfigService],
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
