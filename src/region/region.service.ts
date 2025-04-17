import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    const existingRegion = await this.prisma.region.findFirst({
      where: { name: createRegionDto.name },
    });

    if (existingRegion) {
      throw new ConflictException(`Bu region allaqachon mavjud!`);
    }

    return this.prisma.region.create({
      data: createRegionDto,
    });
  }

  

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const regions = await this.prisma.region.findMany({
      skip,
      take: limit,
    });

    const total = await this.prisma.region.count();
    return {
      data: regions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRegions: total,
    };
  }

  async findOne(id: string) {
    return await this.prisma.region.findUnique({ where: { id } });
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
  return await this.prisma.region.update({
    where: { id },
    data: {
      name: updateRegionDto.name ?? undefined, 
    },
  });
}


  async remove(id: string) {
    return await this.prisma.region.delete({ where: { id } });
  }
}