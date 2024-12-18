import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TeacherService } from '@/services/teacher.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly teacherService: TeacherService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    try {
      return this.teacherService.verifyTeacher(email, password);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
