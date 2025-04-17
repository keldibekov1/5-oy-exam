import { Controller, Post, Body, UseGuards, Get, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyOtpDto } from './dto/auth-dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { JwtAuthGuard } from 'src/jwt-auth-guard/jwt-auth-guard.guard';
import { UpdateProfileDto } from './dto/update-auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Emailga OTP jonatish' })
  @ApiResponse({ status: 200, description: 'OTP yuborildi' })
  @ApiResponse({ status: 400, description: 'Email notogri' })
  @ApiBody({ type: SendOtpDto })
  async sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Foydalanuvchi yuborgan OTP kodni tekshirish' })
  @ApiResponse({ status: 200, description: 'OTP tasdiqlandi' })
  @ApiResponse({ status: 400, description: 'Notogri OTP' })
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return this.authService.verifyOtp(data.email, data.otp);
  }

  @Post('register')
  @ApiOperation({ summary: 'Foydalanuvchini royxatdan otkazish' })
  @ApiResponse({ status: 201, description: 'Royxatdan otish muvaffaqiyatli' })
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchini tizimga kirishi' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli login' })
  @ApiResponse({ status: 401, description: 'Email yoki parol notogri' })
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @ApiOperation({ summary: 'Foydalanuvchi profilini yangilash' })
  @ApiResponse({ status: 200, description: 'Profil yangilandi' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  async updateProfile(@Request() req, @Body() data: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, data);
  }
}