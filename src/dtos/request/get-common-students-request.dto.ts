import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { IsUnique } from '@/decorators/validator/unique-email.validator';
import { Transform } from 'class-transformer';

export class GetCommonStudentsRequestDto {
  @Validate(IsUnique)
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  teacher: string[];
}
