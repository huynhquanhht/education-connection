import { TeacherService } from '@/services/teacher.service';
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly teacherService: TeacherService) {
    super();
  }
}