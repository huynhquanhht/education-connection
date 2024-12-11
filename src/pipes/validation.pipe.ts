import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { instanceToPlain, plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;

    const object = plainToInstance(metatype, value);
    console.log('object - ', object);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    });
    console.log('errors - ', errors);

    // if (errors.length > 0) {
    //   throw new HttpException(
    //     {
    //       statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    //       message: 'Unprocessable Entity',
    //       errors: errors,
    //     },
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
    return instanceToPlain(object);
  }

  // eslint-disable-next-line
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
