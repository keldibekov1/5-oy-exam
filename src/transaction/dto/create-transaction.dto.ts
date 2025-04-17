import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType, example: TransactionType.SALE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'b82877d3-a4b9-4269-9cc1-9de61eeb4c1e' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'b25ff1ef-df82-4c65-b154-6f14b43a0ef3' })
  @IsString()
  variantId: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 2500000, description: '1 dona mahsulot nech pulga sotilgan' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 'c8bb1ef5-14f3-4db5-9bd7-2d2b1dcfb3b4' })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 'e22ba883-1352-4a8c-b65b-4f1d2e46c83a' })
  @IsString()
  adminId: string;
}
