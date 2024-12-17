import { DataSource, Repository } from 'typeorm';
import { Class } from '@/entities/class.entity';
import { Injectable } from '@nestjs/common';
import { GetClassRequestDto } from '@/dtos/request/get-class-request.dto';

@Injectable()
export class ClassRepository extends Repository<Class> {
  constructor(private datasource: DataSource) {
    super(Class, datasource.createEntityManager());
  }
}
