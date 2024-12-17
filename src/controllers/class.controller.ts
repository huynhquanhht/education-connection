import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClassService } from '@/services/class.service';
import { CreateClassRequestDto } from '@/dtos/request/create-class-request.dto';
import { UpdateClassRequestDto } from '@/dtos/request/update-class-request.dto';
import { GetClassRequestDto } from '@/dtos/request/get-class-request.dto';

@Controller('api/class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  create(@Body() createClassDto: CreateClassRequestDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  findAll(@Query() getClassRequestDto: GetClassRequestDto) {
    return this.classService.findAll(getClassRequestDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassRequestDto,
  ) {
    return this.classService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}
