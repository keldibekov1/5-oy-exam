import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';


@ApiTags('Region') 
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Yangi region yaratish' })
  @ApiResponse({ status: 201, description: 'Region muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Xatolik: Malumotlar notogri' })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha regionlarni olish (pagination bilan)' })
  @ApiResponse({ status: 200, description: 'Barcha regionlar' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Sahifa raqami (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Sahifadagi elementlar soni (default: 10)' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.regionService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta regionni olish' })
  @ApiResponse({ status: 200, description: 'Region topildi' })
  @ApiResponse({ status: 404, description: 'Region topilmadi' })
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Regionni yangilash' })
  @ApiResponse({ status: 200, description: 'Region yangilandi' })
  @ApiResponse({ status: 400, description: 'Xatolik: Malumotlar notogri' })
  @ApiResponse({ status: 404, description: 'Region topilmadi' })
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Regionni ochirish' })
  @ApiResponse({ status: 200, description: 'Region ochirildi' })
  @ApiResponse({ status: 404, description: 'Region topilmadi' })
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}