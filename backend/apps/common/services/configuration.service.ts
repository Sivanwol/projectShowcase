
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}
  getConfigValue(key: string , defualtIfNotExist?:string): string {
    return this.configService.get<string>(key,defualtIfNotExist);
  }
}
