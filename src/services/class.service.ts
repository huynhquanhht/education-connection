import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassRequestDto } from '../dtos/request/create-class-request.dto';
import { UpdateClassRequestDto } from '../dtos/request/update-class-request.dto';
import { ClassRepository } from '@/repositories/class.repository';
import { Class } from '@/entities/class.entity';
import { GetClassRequestDto } from '@/dtos/request/get-class-request.dto';
import {
  PaginationMetaDto,
  PaginationResponseDto,
} from '@/dtos/response/pagination-response.dto';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}

  async create(createClassDto: CreateClassRequestDto): Promise<void> {
    const { name } = createClassDto;
    const existClass = this.classRepository.findOneBy({ name });
    if (!existClass) {
      throw new HttpException('The class was existed!', HttpStatus.BAD_REQUEST);
    }
    const newClass = Object.assign({}, createClassDto);
    await this.classRepository.save(newClass);
  }

  async findAll(getClassRequestDto: GetClassRequestDto) {
    const { page, size } = getClassRequestDto;
    const queryBuilder = this.classRepository.createQueryBuilder('class');
    queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .orderBy('class.name', 'ASC');

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const paginationMetaDto: PaginationMetaDto = new PaginationMetaDto(
      page,
      size,
      itemCount,
    );
    return new PaginationResponseDto<Class>(entities, paginationMetaDto);
  }

  async findOne(id: number) {
    const existClass: Class = await this.classRepository.findOneBy({ id });
    if (!existClass) {
      throw new HttpException(
        'The class is not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return existClass;
  }

  async update(id: number, updateClassDto: UpdateClassRequestDto) {
    const existClass: Class = await this.classRepository.findOneBy({ id });
    if (!existClass) {
      throw new HttpException(
        'The class is not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newClass: Class = Object.assign(existClass, updateClassDto);
    await this.classRepository.save(newClass);
  }

  async remove(id: number) {
    const existClass: Class = await this.classRepository.findOneBy({ id });
    if (!existClass) {
      throw new HttpException(
        'The class is not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.classRepository.remove(existClass);
  }
}
