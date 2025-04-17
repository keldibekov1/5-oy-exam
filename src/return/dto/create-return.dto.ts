import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber, IsString, Min } from 'class-validator';

export class CreateReturnDto {
  @ApiProperty({
    example: 'e4e8232e-881b-45a0-b0c2-0cbf5f938b7e',
    description: 'Qaytarilayotgan tranzaksiyaning IDsi',
  })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    example: 1,
    description: 'Qaytarilayotgan mahsulot soni',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 250000,
    description: 'Qaytarilayotgan mahsulot summasi (so‘mda)',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'Mijoz noto‘g‘ri modelni sotib olgan',
    description: 'Qaytarish sababi',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

