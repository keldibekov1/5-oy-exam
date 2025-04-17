import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ReturnService } from './return.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Return')
@Controller('return')
export class ReturnController {
  constructor(private readonly service: ReturnService) {}

  @Post()
  @ApiOperation({ summary: 'Qaytarilgan mahsulot qo‘shish' })
  @ApiBody({ type: CreateReturnDto })
  create(@Body() dto: CreateReturnDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha returnlar ro‘yxati (pagination bilan)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.service.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta returnni olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Returnni tahrirlash' })
  update(@Param('id') id: string, @Body() dto: UpdateReturnDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Returnni o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
