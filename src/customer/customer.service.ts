import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { Response } from 'express'; 


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
      ? { phoneNumber: { contains: phoneNumber, mode: Prisma.QueryMode.insensitive } } 
      : {}; 
  
    const customers = await this.prisma.customer.findMany({
      where,
      skip,
      take: limit,
      include: {
        region: true, 
      },
    });
  
    const total = await this.prisma.customer.count({
      where,
    });
  
    return {
      data: customers.map(customer => ({
        ...customer,
        regionName: customer.region?.name, 
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

  async exportToExcel(res: Response) {
    const customers = await this.prisma.customer.findMany({
      include: {
        region: true,
      },
    });
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Customers');
  
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 30 },
      { header: 'Ismi', key: 'firstName', width: 20 },
      { header: 'Familiyasi', key: 'lastName', width: 20 },
      { header: 'Telefon raqami', key: 'phoneNumber', width: 20 },
      { header: 'Hudud', key: 'regionName', width: 20 },
      { header: 'Faollik', key: 'isActive', width: 10 },
      { header: 'Umumiy xarajat', key: 'totalSpent', width: 15 },
    ];
  
    customers.forEach((customer) => {
      worksheet.addRow({
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        regionName: customer.region?.name || '',
        isActive: customer.isActive ? 'Ha' : 'Yo‘q',
        totalSpent: customer.totalSpent,
      });
    });
  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');
  
    await workbook.xlsx.write(res);
    res.end();
  }
  
}
