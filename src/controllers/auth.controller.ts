import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@/services/auth.service';
import { LoginDto } from '@/dtos/request/login.dto';
import { LocalAuthGuard } from '@/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const token: string = this.authService.login(email, password);
    return { token };
  }
}
