import { DataSource, Repository } from 'typeorm';
import { Class } from '@/entities/class.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassRepository extends Repository<Class> {
  constructor(private datasource: DataSource) {
    super(Class, datasource.createEntityManager());
  }

  getByName(name: string): Promise<Class> {
    return this.findOne({
      where: { name },
    });
  }
}
