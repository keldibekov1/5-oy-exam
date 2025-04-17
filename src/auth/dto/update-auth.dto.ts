import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateAuthDto extends PartialType(CreateAuthDto) {}


export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
      example: 'Ali',
      description: 'Foydalanuvchining ismi',
    })
    firstname?: string;
  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
      example: 'Qodirov',
      description: 'Foydalanuvchining familiyasi',
    })
    lastname?: string;
  
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
      example: 'https://cdn.example.com/images/user.jpg',
      description: 'Foydalanuvchining profil rasmi URL manzili',
    })
    img?: string;
  }