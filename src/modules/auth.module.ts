import { Module } from '@nestjs/common';
import { AuthService } from '@/services/auth.service';
import { AuthController } from '@/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '@/strategies/local.strategy';
import { JwtStrategy } from '@/strategies/jwt.strategy';
import { TeacherModule } from '@/modules/teacher.module';
import { TeacherService } from '@/services/teacher.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],

  imports: [
    TeacherModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'jwt_secret',
        signOptions: {
          expiresIn: '3600s',
        },
      }),
    }),
  ],
})
export class AuthModule {}
