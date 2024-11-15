import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SuspendStudentRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  student: string;
}
