import { Injectable, UseGuards } from '@nestjs/common';
import { TokenPayload } from '@/dtos/request/TokenPayload';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(email: string, password: string): string {
    const tokenPayload: TokenPayload = {
      email,
    };
    const expires: Date = new Date();
    expires.setSeconds(expires.getSeconds() + 3600);
    return this.jwtService.sign(tokenPayload);
  }
}
