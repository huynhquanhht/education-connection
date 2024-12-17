import { Module } from '@nestjs/common';
import { ClassService } from '@/services/class.service';
import { ClassController } from '@/controllers/class.controller';
import { ClassRepository } from '@/repositories/class.repository';

@Module({
  controllers: [ClassController],
  providers: [ClassService, ClassRepository],
})
export class ClassModule {}
