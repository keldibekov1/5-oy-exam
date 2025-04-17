import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@prisma/client';
import { Prisma } from '@prisma/client';


@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const regionExists = await this.prisma.region.findUnique({
      where: { id: createCustomerDto.regionId },
    });
    
  
    if (!regionExists) {
      throw new Error('Region not found');
    }
  
    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        totalSpent: createCustomerDto.totalSpent ?? 0,
      },
    });
  }
  
  

  async findAll(page: number, limit: number, phoneNumber?: string) {
    const skip = (page - 1) * limit;
  
    const where: Prisma.CustomerWhereInput = phoneNumber
      ? { phoneNumber: { contains: phoneNumber, mode: Prisma.QueryMode.insensitive } } // QueryMode.insensitive to'g'ri ishlatish
      : {}; // Agar phoneNumber berilmagan bo‘lsa, boshqa filtrlar ishlatilmaydi
  
    const customers = await this.prisma.customer.findMany({
      where,
      skip,
      take: limit,
      include: {
        region: true, // regionni include qilish
      },
    });
  
    const total = await this.prisma.customer.count({
      where,
    });
  
    return {
      data: customers.map(customer => ({
        ...customer,
        regionName: customer.region?.name, // region nomini olish
      })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCustomers: total,
    };
  }
  
  
  
  

  async findOne(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: {
        ...updateCustomerDto,
        totalSpent: updateCustomerDto.totalSpent ?? 0, 
      },
    });
  }
  

  async remove(id: string): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
