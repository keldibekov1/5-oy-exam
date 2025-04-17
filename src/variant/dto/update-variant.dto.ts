import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class UpdateVariantDto {
  @ApiProperty({ description: 'Mahsulot variantining IDsi', example: '1a2b3c' })
  @IsString()
  id: string;  

  @ApiProperty({ description: 'Mahsulot rangining IDsi', example: '1a2b3c' })
  @IsString()
  colorId: string;

  @ApiProperty({ description: 'Mahsulot xotira hajmi', example: '6/128GB' })
  @IsString()
  storage: string;

  @ApiProperty({ description: 'Mahsulot variantining zaxira miqdori', example: 10 })
  @IsNumber()
  stock: number;

  @ApiProperty({ description: 'Mahsulot variantining sotib olish narxi', example: 4200000 })
  @IsNumber()
  purchasePrice: number;
}
