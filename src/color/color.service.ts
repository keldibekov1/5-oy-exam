import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateColorDto) {
    const existingType = await this.prisma.color.findUnique({
      where: { name: data.name }, 
    });

    if (existingType) {
      throw new ConflictException(`Bu rang allaqachon mavjud!`);
    }

    return this.prisma.color.create({ data });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [colors, total] = await this.prisma.$transaction([
      this.prisma.color.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.color.count(),
    ]);

    return {
      data: colors,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const color = await this.prisma.color.findUnique({ where: { id } });
    if (!color) {
      throw new NotFoundException(`Bunday rang mavjud emas!`);
    }
    return color;
  }

  async remove(id: string) {
    const existingType = await this.prisma.color.findUnique({
      where: { id },
    });

    if (!existingType) {
      throw new NotFoundException(`Bunday rang mavjud emas!`);
    }

    return this.prisma.color.delete({ where: { id } });
  }

  async update(id: string, updateColorDto: UpdateColorDto) {
    return await this.prisma.color.update({
      where: { id },
      data: {
        name: updateColorDto.name ?? undefined, 
      },
    });
  }
}