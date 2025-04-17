import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransactionDto, adminId: string) {
    const variant = await this.prisma.variant.findUnique({
      where: { id: dto.variantId },
    });

    if (!variant || variant.stock < dto.quantity) {
      throw new NotFoundException('Variant topilmadi yoki yetarli emas');
    }

    const amount = dto.unitPrice * dto.quantity;
    const profit = (dto.unitPrice - variant.purchasePrice) * dto.quantity;

    await this.prisma.variant.update({
      where: { id: dto.variantId },
      data: { stock: { decrement: dto.quantity } },
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        type: dto.type,
        productId: dto.productId,
        customerId: dto.customerId,
        adminId, 
        variantId: dto.variantId,
        amount,
        profit,
        unitPrice: dto.unitPrice,
        quantity: dto.quantity,  
      },
    });

    if (dto.type === TransactionType.SALE) {
      await this.prisma.customer.update({
        where: { id: dto.customerId },
        data: {
          totalSpent: {
            increment: amount,
          },
          lastPurchase: new Date(),
        },
      });
    }

    return transaction;
  }

  findAll() {
    return this.prisma.transaction.findMany({
      include: {
        product: true,
        customer: true,
        admin: true,
        variant: {
          include: {
            color: true,
            product: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true,
        admin: true,
        variant: {
          include: {
            color: true,
            product: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
