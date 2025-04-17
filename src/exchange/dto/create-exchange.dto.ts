import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductDto } from 'src/product/dto/create-product.dto';

export class ExchangeDto {
  @ApiProperty({
    example: 'b82877d3-a4b9-4269-9cc1-9de61eeb4c1e',
    description: 'Yangi mahsulotning IDsi (Product)',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'b25ff1ef-df82-4c65-b154-6f14b43a0ef3',
    description: 'Yangi mahsulotga tegishli variant IDsi (agar mavjud bo‘lsa)',
    required: false,
  })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({
    example: 2500000,
    description: 'Yangi mahsulot mijozga necha pulga berildi',
  })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    example: 1500000,
    description: 'Eski telefon qancha baholandi (mijozdan olingan telefon)',
  })
  @IsNumber()
  oldPrice: number;

  @ApiProperty({
    example: 'c8bb1ef5-14f3-4db5-9bd7-2d2b1dcfb3b4',
    description: 'Mijoz IDsi',
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    description: 'Mijozdan olingan eski mahsulot haqida to‘liq maʼlumot',
    type: CreateProductDto,
  })
  @ValidateNested()
  @Type(() => CreateProductDto)
  oldProduct: CreateProductDto;
}
