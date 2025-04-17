import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    

    const existingCategory = await this.prisma.category.findFirst({
      where: { name: data.name }, 
    });

    if (existingCategory) {
      throw new ConflictException(`Bu kategoriya allaqachon mavjud!`);
    }

    return this.prisma.category.create({ data });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const categories = await this.prisma.category.findMany({
      skip,
      take: limit,
    });

    const total = await this.prisma.category.count();
    return {
      data: categories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCategories: total,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Kategoriya topilmadi!`);
    }
    return category;
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Bunday kategoriya topilmadi!`);
    }

    return this.prisma.category.delete({ where: { id } });
  }

  async update(id: string, data: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      throw new NotFoundException('Kategoriya topilmadi!');
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }
}