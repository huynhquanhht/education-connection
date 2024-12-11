import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty, IsNotEmptyObject,
  IsString, ValidateIf,
} from 'class-validator';

export class RegisterStudentsRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  teacher: string;
  
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  students: string[];
}
