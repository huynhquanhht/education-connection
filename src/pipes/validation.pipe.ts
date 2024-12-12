import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    const validationErrors = await super.transform(value, metadata);

    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      throw new HttpException(
        validationErrors[0].message,
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
