import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RetrieveNotificationsRequestDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  teacher: string;

  @IsString()
  @IsNotEmpty()
  notification: string;
}
