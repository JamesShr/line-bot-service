import {
  PipeTransform, Injectable, ArgumentMetadata, Logger,
} from '@nestjs/common';
import { ObjectSchema, Shape } from 'yup';

import { ValidationError } from '@/errors/all.exception';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(
    private readonly schema: ObjectSchema<Shape<object, any>>,
  ) { }

  public async transform(value: any, { metatype, type, data }: ArgumentMetadata): Promise<any> {
    Logger.log(JSON.stringify({
      '[ yup ]': type, metatype, data, value,
    }));
    try {
      await this.schema.validate(value);
      return value;
    } catch (err) {
      throw new ValidationError(err.message);
    }
  }
}
