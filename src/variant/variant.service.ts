import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VariantService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.variant.findMany({
      include: {
        product: true,
        color: true,
      },
    });
  }

  findByProduct(productId: string) {
    return this.prisma.variant.findMany({
      where: { productId },
      include: {
        color: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.variant.findUnique({
      where: { id },
      include: {
        product: true,
        color: true,
      },
    });
  }
}
