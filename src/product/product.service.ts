import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const totalStock = createProductDto.variants.reduce((sum, v) => sum + v.stock, 0);
  
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        model: createProductDto.model,
        categoryId: createProductDto.categoryId,
        userId: createProductDto.userId,
        stock: totalStock,
        variants: {
          create: createProductDto.variants.map(v => ({
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

  async update(id: string, updateProductDto: CreateProductDto) {
    const totalStock = updateProductDto.variants.reduce((sum, v) => sum + v.stock, 0);
  
    return this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        model: updateProductDto.model,
        categoryId: updateProductDto.categoryId,
        userId: updateProductDto.userId,
        supplier: updateProductDto.supplier,
        stock: totalStock,
        variants: {
          deleteMany: {}, 
          create: updateProductDto.variants.map(v => ({
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
  

 async remove(id: string) {
  const product = await this.prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundException('Mahsulot topilmadi');

  await this.prisma.variant.deleteMany({ where: { productId: id } });

  return this.prisma.product.delete({ where: { id } });
}

}
