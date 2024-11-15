import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RetrieveNotificationsRequestDto {
  @IsNotEmpty()
  @IsEmail()
  teacher: string;

  @IsNotEmpty()
  @IsString()
  notification: string;
}
