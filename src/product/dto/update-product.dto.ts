import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { UpdateVariantDto } from 'src/variant/dto/update-variant.dto';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Mahsulot nomi',
    example: 'Samsung S24',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Mahsulot modeli',
    example: 'Samsung Galaxy S24 Ultra',
    required: false,
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    description: 'Mahsulot kategoriyasi IDsi',
    example: 'f8f9a0',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Suplier nomi',
    example: 'Samsung Company',
    required: false,
  })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiProperty({ description: 'Mahsulot variantlari ro‘yxati', type: [UpdateVariantDto] })
  @IsArray()
  variants?: UpdateVariantDto[];
}

export class VariantUpdateDto {
  @ApiProperty({
    description: 'Mahsulot variantining rang IDsi',
    example: '1a2b3c',
    required: false,
  })
  @IsString()
  @IsOptional()
  colorId?: string;

  @ApiProperty({
    description: 'Mahsulot variantining xotira hajmi (masalan: 6/128GB)',
    example: '6/128GB',
    required: false,
  })
  @IsString()
  @IsOptional()
  storage?: string;

  @ApiProperty({
    description: 'Mahsulot variantining zaxira miqdori',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Mahsulot variantining sotib olish narxi',
    example: 4200000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  purchasePrice?: number;
}
