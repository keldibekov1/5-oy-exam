import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VariantUpdateDto } from 'src/product/dto/update-product.dto';

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

  async updateVariant(
    productId: string,
    variantId: string,
    variantData: VariantUpdateDto,
  ) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        variants: {
          update: {
            where: { id: variantId },
            data: {
              ...variantData, 
            },
          },
        },
      },
    });
  }
  
}
