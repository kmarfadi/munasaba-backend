import { Controller, Post, Body, UseGuards, Request, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard, SkipJwt } from '@/common';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipJwt()
  @HttpCode(201)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return { //TODO: add mailer service
      message: 'User registered successfully',
      data: await this.authService.register(registerDto), 
    }
  }

  @SkipJwt()
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return {
      message: 'User logged in successfully',
      data: await this.authService.login(loginDto),
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'Profile fetched successfully',
      data: req.user,
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Request() req) {
    return {
      message: 'Token refreshed successfully',
      data: await this.authService.refreshToken(req.user),
    }
  }
}

