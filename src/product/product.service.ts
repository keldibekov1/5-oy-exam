import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: string) {
    const totalStock = dto.variants.reduce((sum, v) => sum + v.stock, 0);
  
    return this.prisma.product.create({
      data: {
        name: dto.name,
        model: dto.model,
        categoryId: dto.categoryId,
        supplier: dto.supplier,
        stock: totalStock,
        userId,
        variants: {
          create: dto.variants.map(v => ({
            colorId: v.colorId,
            storage: v.storage,
            stock: v.stock,
            purchasePrice: v.purchasePrice,
          })),
        },
      },
      include: {
        variants: {
          include: {
            color: true,
          },
        },
        category: true,
      },
    });
  }
  


  async findAll(query: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    categoryId?: string;
  }) {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      categoryId,
    } = query;
  
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
  
    const where: any = {};
  
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }
  
    if (categoryId) {
      where.categoryId = categoryId;
    }
  
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          variants: {
            include: { color: true },
          },
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);
  
    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }
  

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { 
        variants: {
          include: {
            color: true, 
          },
        },
        category: true, 
      },
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const totalStock = updateProductDto.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        model: updateProductDto.model,
        categoryId: updateProductDto.categoryId,
        supplier: updateProductDto.supplier,
        stock: totalStock,
        userId,
      },
      include: {
        variants: {
          include: { color: true },
        },
        category: true,
      },
    });
  
    if (updateProductDto.variants && updateProductDto.variants.length > 0) {
      const updatedVariantIds: string[] = [];
  
      for (const variant of updateProductDto.variants) {
        if (variant.id) {
          const existingVariant = await this.prisma.variant.findUnique({
            where: { id: variant.id },
          });
  
          if (existingVariant) {
            await this.prisma.variant.update({
              where: { id: variant.id },
              data: {
                colorId: variant.colorId,
                storage: variant.storage,
                stock: variant.stock,
                purchasePrice: variant.purchasePrice,
              },
            });
            updatedVariantIds.push(variant.id);
            continue;
          }
        }
  
        const newVariant = await this.prisma.variant.create({
          data: {
            productId: id,
            colorId: variant.colorId,
            storage: variant.storage,
            stock: variant.stock,
            purchasePrice: variant.purchasePrice,
          },
        });
  
        updatedVariantIds.push(newVariant.id);
      }
  
      // Eski qolgan variantlarni o‘chiramiz
      await this.prisma.variant.deleteMany({
        where: {
          productId: id,
          NOT: {
            id: { in: updatedVariantIds },
          },
        },
      });
    }
  
    return updatedProduct;
  }
  
  
  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },  
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
  
    const variantIds = product.variants.map(variant => variant.id);
  
    await this.prisma.transaction.deleteMany({
      where: { variantId: { in: variantIds } },
    });
  
    await this.prisma.variant.deleteMany({
      where: { productId: id },
    });
  
    await this.prisma.exchange.deleteMany({
      where: { oldProductId: id },
    });
  
    return this.prisma.product.delete({
      where: { id },
    });
  }
  

}
