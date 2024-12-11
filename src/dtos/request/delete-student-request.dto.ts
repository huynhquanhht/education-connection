import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteStudentRequestDto {
  @IsNotEmpty()
  @IsEmail()
  studentEmail: string;
}
