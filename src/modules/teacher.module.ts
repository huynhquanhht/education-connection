import { Module } from '@nestjs/common';
import { TeacherService } from '@/services/teacher.service';
import { TeacherController } from '@/controllers/teacher.controller';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from '@/entities/teacher.entity';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository, StudentRepository, TeacherStudentRepository],
  exports: [TeacherService]
})
export class TeacherModule {}
