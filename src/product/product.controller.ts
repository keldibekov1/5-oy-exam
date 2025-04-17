import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth-guard/jwt-auth-guard.guard';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Yangi mahsulot yaratish' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli yaratildi' })
  create(@Body() dto: CreateProductDto, @Request() req) {
    const userId = req.user.id; 
    return this.productService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
  @ApiResponse({ status: 200, description: 'Mahsulotlar ro‘yxati qaytarildi' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID orqali bitta mahsulotni olish' })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi' })
  @ApiResponse({ status: 200, description: 'Topilgan mahsulot qaytarildi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mahsulotni tahrirlash' })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Mahsulot muvaffaqiyatli yangilandi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  update(@Param('id') id: string, @Body() dto: any, @Request() req) {
    const userId = req.user.id; 
    return this.productService.update(id, dto, userId);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Mahsulotni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Mahsulot IDsi' })
  @ApiResponse({ status: 200, description: 'Mahsulot o‘chirildi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
