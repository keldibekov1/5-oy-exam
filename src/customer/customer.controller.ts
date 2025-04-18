import { Controller, Get, Post, Body, Param, Delete, Put, Query, Patch } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Res } from '@nestjs/common';
import { Response } from 'express'; 

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Create customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Get all customers' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Page size' })
  @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search term for first name, last name or phone number' })
  @ApiResponse({ status: 200, description: 'Returns a list of customers' })
  @Get()
  async findAll(
    @Query('page') page = 1, 
    @Query('limit') limit = 10, 
    @Query('searchTerm') searchTerm?: string
  ) {
    return this.customerService.findAll(page, limit, searchTerm);
  }
  


  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({ status: 200, description: 'Returns a single customer' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }

  @ApiOperation({ summary: 'Export all customers to Excel' })
  @ApiResponse({ status: 200, description: 'Returns Excel file of all customers' })
  @Get('export/excel')
  async exportExcel(@Res() res: Response) {
    return this.customerService.exportToExcel(res);
  }

}
