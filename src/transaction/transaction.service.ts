import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from '@prisma/client';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TransactionService {
  private bot: TelegramBot;
  private readonly chatId = '-1002661533599'; // Kanal username yoki -1001234567890

  constructor(private prisma: PrismaService) {
    this.bot = new TelegramBot('7897153787:AAEqWoQCiP7z-koNuK7QOSIqNh7caZAXV_w', { polling: false }); // o'z tokeningizni qo‘ying
  }

  async create(dto: CreateTransactionDto, adminId: string) {
    const variant = await this.prisma.variant.findUnique({
      where: { id: dto.variantId },
      include: {
        color: true,
        product: true,
      },
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

    // Mijozga sarf qo‘shiladi
    if (dto.type === TransactionType.SALE) {
      await this.prisma.customer.update({
        where: { id: dto.customerId },
        data: {
          totalSpent: { increment: amount },
          lastPurchase: new Date(),
        },
      });
    }

    // Telegramga yuboramiz
    await this.sendTransactionToTelegram(transaction.id);

    return transaction;
  }

  private async sendTransactionToTelegram(transactionId: string) {
    const trx = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
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

    if (!trx) return;

    const message = `
🧾 *Yangi tranzaksiya amalga oshirildi*

🛍 *Mahsulot:* ${trx.product.name}
👤 *Mijoz:* ${trx.customer.firstName} ${trx.customer.lastName}
🔢 *Miqdor:* ${trx.quantity} dona
💵 *Narxi:* ${trx.unitPrice.toLocaleString()} so'm
💰 *Umumiy summa:* ${trx.amount.toLocaleString()} so'm
📈 *Foyda:* ${trx.profit.toLocaleString()} so'm
⏰ *Vaqt:* ${new Date(trx['createdAt']).toLocaleString('uz-UZ')}
📦 *Turi:* ${trx.type}
`;

    await this.bot.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
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
