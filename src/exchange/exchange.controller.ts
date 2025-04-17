import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeDto } from './dto/create-exchange.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Exchanges') 
@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly service: ExchangeService) {}

  @Post()
  @ApiOperation({ summary: 'Mahsulotni almashtirish (exchange)' })
  @ApiResponse({ status: 201, description: 'Exchange muvaffaqiyatli yaratildi' })
  create(@Body() dto: ExchangeDto) {
    return this.service.exchangeProduct(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha exchange yozuvlarini olish' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAllExchanges(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.getAllExchanges(Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta exchange yozuvini olish' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Exchange topildi' })
  @ApiResponse({ status: 404, description: 'Exchange topilmadi' })
  getExchange(@Param('id') id: string) {
    return this.service.getExchange(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exchange yozuvini o‘chirish' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Exchange o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Exchange topilmadi' })
  deleteExchange(@Param('id') id: string) {
    return this.service.deleteExchange(id);
  }
}
