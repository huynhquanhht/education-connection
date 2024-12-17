import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetClassRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  size: number = 10;

  name: string;

  sort: string;
}