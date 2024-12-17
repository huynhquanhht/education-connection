import { PartialType } from '@nestjs/mapped-types';
import { CreateClassRequestDto } from './create-class-request.dto';

export class UpdateClassRequestDto extends PartialType(CreateClassRequestDto) {}
