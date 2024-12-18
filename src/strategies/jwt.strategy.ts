import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { TeacherService } from '@/services/teacher.service';
import { TokenPayload } from '@/dtos/request/TokenPayload';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly teacherService: TeacherService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.Authentication || request?.headers.authorization.split(' ')[1];
        },
      ]),
      secretOrKey: 'jwt_secret',
    });
  }

  validate({ email }: TokenPayload) {
    return this.teacherService.getTeacherByEmail(email);
  }
}
