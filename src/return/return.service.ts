import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReturnDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: dto.transactionId },
      include: { variant: true, customer: true },
    });

    if (!transaction) {
      throw new NotFoundException('Tranzaksiya topilmadi');
    }

    if (dto.quantity > transaction.quantity) {
      throw new NotFoundException('Qaytarilayotgan soni tranzaksiyadagi mahsulotdan kop bolmasligi kerak');
    }

    const profitPerItem = transaction.profit / transaction.quantity;

    const createdReturn = await this.prisma.return.create({
      data: {
        transactionId: dto.transactionId,
        reason: dto.reason,
        amount: dto.amount,
        quantity: dto.quantity,
      },
    });

    await this.prisma.variant.update({
      where: { id: transaction.variantId },
      data: {
        stock: {
          increment: dto.quantity,
        },
      },
    });

    await this.prisma.transaction.update({
      where: { id: dto.transactionId },
      data: {
        amount: {
          decrement: dto.amount,
        },
        profit: {
          decrement: profitPerItem * dto.quantity,
        },
        quantity: {
          decrement: dto.quantity,
        },
      },
    });

    await this.prisma.customer.update({
      where: { id: transaction.customerId },
      data: {
        totalSpent: {
          decrement: dto.amount,
        },
      },
    });

    return createdReturn;
  }

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
  
    return this.prisma.return.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, 
      include: {
        transaction: {
          include: { customer: true, admin: true, product: true },
        },
      },
    });
  }
  

  findOne(id: string) {
    return this.prisma.return.findUnique({
      where: { id },
      include: {
        transaction: {
          include: { customer: true, admin: true, product: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateReturnDto) {
    await this.prisma.return.findUniqueOrThrow({ where: { id } });
    return this.prisma.return.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.return.delete({ where: { id } });
  }
}
