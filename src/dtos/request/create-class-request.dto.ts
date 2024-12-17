import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
