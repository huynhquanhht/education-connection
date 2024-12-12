import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { CustomValidationPipe } from '@/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  await app.listen(process.env.SERVER_PORT ?? 8080);
}

bootstrap();
