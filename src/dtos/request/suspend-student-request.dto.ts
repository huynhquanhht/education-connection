import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SuspendStudentRequestDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  student: string;
}
