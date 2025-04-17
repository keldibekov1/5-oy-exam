import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth-guard/jwt-auth-guard.guard';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi tranzaksiya (sotish)' })
  @ApiResponse({ status: 201, description: 'Tranzaksiya yaratildi' })
  @UseGuards(JwtAuthGuard) 
  async create(@Body() dto: CreateTransactionDto, @Req() req: any) {
    const adminId = req.user.id; 
    return this.service.create(dto, adminId); 
  }

  @Get()
  @ApiOperation({ summary: 'Barcha tranzaksiyalar ro‘yxati' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta tranzaksiyani olish' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Tranzaksiyani tahrirlash' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Tranzaksiyani o‘chirish' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
