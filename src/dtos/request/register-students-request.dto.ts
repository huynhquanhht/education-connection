import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { IsUnique } from '@/pipes/unique-email.validator';

export class RegisterStudentsRequestDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  teacher: string;

  @Validate(IsUnique)
  @IsEmail({}, { each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  students: string[];
}
