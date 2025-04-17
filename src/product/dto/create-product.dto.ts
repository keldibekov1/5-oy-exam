import { IsString, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VariantDto {
  @ApiProperty({
    description: 'Mahsulot rangining IDsi',
    example: '1a2b3c',
  })
  @IsString()
  colorId: string;

  @ApiProperty({
    description: 'Mahsulot xotira hajmi (masalan: 6/128GB)',
    example: '6/128GB',
  })
  @IsString()
  storage: string;

  @ApiProperty({
    description: 'Mahsulot variantining zaxira miqdori',
    example: 10,
  })
  @IsNumber()
  stock: number;

  @ApiProperty({
    description: 'Mahsulot variantining sotib olish narxi',
    example: 4200000,
  })
  @IsNumber()
  purchasePrice: number;
}


export class CreateProductDto {
    @ApiProperty({ description: 'Mahsulot nomi', example: 'Samsung S24' })
    @IsString()
    name: string;
  
    @ApiProperty({ description: 'Mahsulot modeli', example: 'Samsung Galaxy S24 Ultra' })
    @IsString()
    model: string;
  
    @ApiProperty({ description: 'Mahsulot kategoriyasi IDsi', example: 'f8f9a0' })
    @IsString()
    categoryId: string;
  
    @ApiProperty({ description: 'Mahsulotni kim qo\'shganligini ko\'rsatadigan foydalanuvchi IDsi', example: 'user123' })
    @IsString()
    userId: string;

    @ApiProperty({description: 'suplier name', example: 'Samsung Company'})
    @IsString()
    supplier: string;
  
    @ApiProperty({ description: 'Mahsulot variantlari ro\'yxati', type: [VariantDto] })
    @IsArray()
    variants: VariantDto[];
  }
  
