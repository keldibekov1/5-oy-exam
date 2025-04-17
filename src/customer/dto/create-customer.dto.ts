import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsUUID, IsPhoneNumber, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Mijozning ismi',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Mijozning familiyasi',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Mijozning telefon raqami',
    type: String,
  })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Mijozning hudud IDsi',
    type: String,
    
  })
  regionId: string;

  @ApiProperty({
    description: 'Mijoz faol yoki yoqligi',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  
  @IsOptional()
  @IsNumber()
  totalSpent?: number;

  
  
}
