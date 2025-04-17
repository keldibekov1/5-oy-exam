import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExchangeDto } from './dto/create-exchange.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async exchangeProduct(dto: ExchangeDto, userId: string) {
    const {
      customerId,
      oldPrice,
      unitPrice,
      productId,
      variantId,
      oldProduct,
    } = dto;

    if (!variantId) {
      throw new Error('Variant ID kiritilishi shart');
    }

    return this.prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          ...oldProduct,
          stock: 1,
          userId, 
          variants: {
            create: oldProduct.variants.map((variant) => ({
              colorId: variant.colorId,
              storage: variant.storage,
              stock: variant.stock,
              purchasePrice: variant.purchasePrice,
            })),
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          productId,
          variantId,
          customerId,
          adminId: userId, 
          type: TransactionType.SALE,
          amount: unitPrice,
          quantity: 1,
          unitPrice,
          profit: unitPrice - oldPrice,
        },
      });

      await tx.variant.update({
        where: { id: variantId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      const exchange = await tx.exchange.create({
        data: {
          oldProductId: newProduct.id,
          oldPrice,
          unitPrice,
          difference: unitPrice - oldPrice,
          productId,
          variantId,
          customerId,
          adminId: userId,
          description: 'Telefonni almashish',
        },
      });

      return {
        message: 'Muvaffaqiyatli exchange amalga oshirildi',
        oldProductId: newProduct.id,
        newProductId: productId,
        transactionId: transaction.id,
        exchangeId: exchange.id,
      };
    });
  }

  async getAllExchanges(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.exchange.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          variant: true,
          customer: true,
          admin: true,
          oldProduct: {
            include: {
              category: true,
              variants: true,
            },
          },
        },
      }),
      this.prisma.exchange.count(),
    ]);

    const exchangesWithOldProduct = data.map((exchange) => ({
      ...exchange,
      oldProductName: exchange.oldProduct.name,
      oldProductModel: exchange.oldProduct.model,
      oldProductCategory: exchange.oldProduct.category.name,
      oldProductVariants: exchange.oldProduct.variants.map((variant) => ({
        color: variant.colorId,
        storage: variant.storage,
        stock: variant.stock,
      })),
    }));

    return {
      data: exchangesWithOldProduct,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getExchange(exchangeId: string) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: {
        product: true,
        variant: true,
        customer: true,
        admin: true,
      },
    });

    if (!exchange) {
      throw new Error("Exchange ma'lumoti topilmadi");
    }

    return exchange;
  }

  async deleteExchange(exchangeId: string) {
    const exchange = await this.prisma.exchange.findUnique({
      where: { id: exchangeId },
    });

    if (!exchange) {
      throw new Error("Exchange ma'lumoti topilmadi");
    }

    return this.prisma.exchange.delete({
      where: { id: exchangeId },
    });
  }
}
