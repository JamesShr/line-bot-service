import {
  PipeTransform, Injectable, ArgumentMetadata, Logger,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ParseDtoPipe implements PipeTransform {
  public transform(value: any, { metatype, type, data }: ArgumentMetadata): any {
    switch (type) {
      case 'query': {
        Logger.log(JSON.stringify({ '[parse]': type, metatype, data }));
        return plainToClass(metatype, value);
      }
      case 'param':
      {
        const v = plainToClass(metatype, JSON.parse(`{"${data}":"${value}"}`));
        Logger.log(JSON.stringify({
          '[parse]': type, metatype, data, v,
        }));
        return v;
      }
      default: {
        Logger.log(JSON.stringify({ '[parse]': type, metatype, data }));
        return value;
      }
    }
  }
}
