import { Controller, Post, Body, UseGuards, Get, Request, Patch, Req, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from './dto/auth-dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendOtpDto } from './dto/send-otp.dto';
import { JwtAuthGuard } from 'src/jwt-auth-guard/jwt-auth-guard.guard';
import { UpdateProfileDto } from './dto/update-auth.dto';
import { Request as ExpressRequest } from 'express';


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
  login(@Body() data: LoginDto, @Req() req: ExpressRequest) {
    return this.authService.login(data, req);
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

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @ApiOperation({ summary: 'User sessiyalarini korish' })
  async getSessions(@Request() req) {
    return this.authService.getSessions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mysessions')
  @ApiOperation({ summary: 'User sessiyalarini korish' })
  async getMySessions(@Request() req) {
    return this.authService.getMySessions(req.user.id);
  }
 

  @UseGuards(JwtAuthGuard)
  @Delete('mysessions/:id')
  @ApiOperation({ summary: 'User sessiyalarini o\'chirish' })
  @ApiResponse({ status: 200, description: 'Sessiya o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Sessiya topilmadi' })
  async deleteMySessions(@Request() req, @Param('id') sessionId: string) {
    const userId = req.user.id;

    return this.authService.deleteMySession( sessionId);
  }


  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  @ApiOperation({ summary: 'JWT orqali parolni yangilash' })
  async resetPassword(
    @Req() req,
    @Body() dto: ResetPasswordDto,
  ) {
    const userId = req.user.id;
    return this.authService.resetPassword(userId, dto);
  }
  
}