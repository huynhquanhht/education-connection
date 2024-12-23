import { Module } from '@nestjs/common';
import { TeacherService } from '@/services/teacher.service';
import { TeacherController } from '@/controllers/teacher.controller';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';

@Module({
  controllers: [TeacherController],
  providers: [
    TeacherService,
    TeacherRepository,
    StudentRepository,
    TeacherStudentRepository,
  ],
})
export class TeacherModule {}
