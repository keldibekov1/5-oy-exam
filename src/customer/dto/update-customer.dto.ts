import { IsOptional, IsString, IsUUID, IsPhoneNumber, IsBoolean, IsNumber } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsUUID()
  regionId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  totalSpent?: number;

  @IsOptional()
  lastPurchase?: Date;
}
