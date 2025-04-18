import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth-dto';
import { UpdateProfileDto } from './dto/update-auth.dto';
import { UAParser } from 'ua-parser-js';
// import * as UAParser from 'ua-parser-js';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
  
    if (user) {
      if (user.verified) {
        throw new BadRequestException('Siz allaqachon royxatdan otgansiz');
      }
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await this.prisma.user.upsert({
      where: { email },
      update: { otp, verified: false }, 
      create: { email, otp, verified: false, role: 'OMBOR_ADMIN' }, 
    });
  
    await this.mailerService.sendMail({
      to: email,
      subject: 'Tasdiqlash kodi',
      text: `Sizning tasdiqlash kodingiz: ${otp}`,
    });
  
    return { message: 'OTP yuborildi', otp };
  }
  

  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.otp !== otp) {
      throw new BadRequestException('Notogri OTP');
    }

    await this.prisma.user.update({
      where: { email },
      data: { verified: true, otp: null }, 
    });

    return { message: 'OTP tasdiqlandi' };
  }

  async register(data: RegisterDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
  
    if (!user || !user.verified) {
      throw new BadRequestException('Foydalanuvchi OTP tasdiqlanmagan');
    }
  
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    await this.prisma.user.update({
      where: { email: data.email },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        password: hashedPassword,
        img: data.img,
      },
    });
  
    return { message: 'Royxatdan otish muvaffaqiyatli!' };
  }
  

  async login(data: LoginDto, req: Request) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
  
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Email yoki parol notogri');
    }
  
    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
  
    const userAgentString = req.headers['user-agent'] || 'Unknown';
    const ua = new UAParser(userAgentString);
    const uaResult = ua.getResult();
  
    let ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'Unknown';
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:192.') || ip.startsWith('192.168.') || ip === '::ffff:127.0.0.1') {
      ip = req.socket.remoteAddress || 'Unknown'; 
    } else if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', ''); 
    }
  
    let location: string | null = null;
    try {
      const res = await axios.get(`http://ip-api.com/json/${ip}`);
      if (res.data && res.data.status === 'success') {
        location = `${res.data.city}, ${res.data.regionName}, ${res.data.country}`;
      }
    } catch (err) {
      location = null; 
    }
  
    const sessionData = {
      userId: user.id,
      ip,
      userAgent: userAgentString,
      device: uaResult.device.model || uaResult.device.vendor || (uaResult.device.type === 'mobile' ? 'Mobile' : 'Desktop'),
      os: `${uaResult.os.name || 'Unknown'} ${uaResult.os.version || ''}`,
      browser: `${uaResult.browser.name || 'Unknown'} ${uaResult.browser.version || ''}`,
      location,
    };
  
    await this.prisma.session.create({ data: sessionData });
  
    return { token };
  }


async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstname: true, lastname: true, email: true, role: true, img: true },
    });
  
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
  
    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
  
    await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  
    return { message: 'Profil muvaffaqiyatli yangilandi' };
  }
  

  async getSessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      select: { id: true, userId: true, ip: true, userAgent: true, device: true,  os: true, location:true, browser: true, createdAt: true },
    });
  
    if (!sessions) {
      throw new NotFoundException('Sessiyalar topilmadi');
    }
  
    return sessions;
  }


  async getMySessions(userId: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      select: { id: true, userId: true, ip: true, userAgent: true, device: true, os: true, location:true, browser: true, createdAt: true },
    });
  
    if (!sessions) {
      throw new NotFoundException('Sessiyalar topilmadi');
    }
  
    return sessions;
  }
  
  async deleteMySession(sessionId: string) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
  
    if (!session) {
      throw new NotFoundException('Sessiya topilmadi');
    }
  
    await this.prisma.session.delete({ where: { id: sessionId } });
  
    return { message: 'Sessiya muvaffaqiyatli ochirildi' };
  }

  async resetPassword(userId: string, dto: ResetPasswordDto) {
    const { newPassword, confirmPassword } = dto;
  
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Parollar mos emas');
    }
  
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) throw new NotFoundException('User topilmadi');
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  
    return { message: 'Parol o‘zgartirildi, endi esdan chiqarmang!' };
  }
  
}