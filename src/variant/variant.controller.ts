import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { VariantService } from './variant.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Variants')
@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha variantlarni olish' })
  findAll() {
    return this.variantService.findAll();
  }

  @Get('/product/:productId')
  @ApiOperation({ summary: 'Maʼlum bir mahsulotga tegishli variantlarni olish' })
  findByProduct(@Param('productId') productId: string) {
    return this.variantService.findByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta variantni olish' })
  findOne(@Param('id') id: string) {
    return this.variantService.findOne(id);
  }
}
