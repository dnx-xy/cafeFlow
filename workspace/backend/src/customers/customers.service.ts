import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(customerData: Partial<Customer>, tenantId: string): Promise<Customer> {
    const customer = this.customersRepository.create({
      ...customerData,
      tenantId,
      joinDate: new Date(),
    });
    return await this.customersRepository.save(customer);
  }

  async findAll(tenantId: string): Promise<Customer[]> {
    return await this.customersRepository.find({
      where: { tenantId },
      order: { joinDate: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Customer> {
    return await this.customersRepository.findOne({
      where: { id, tenantId },
    });
  }

  async findByPhoneNumber(phoneNumber: string, tenantId: string): Promise<Customer> {
    return await this.customersRepository.findOne({
      where: { phoneNumber, tenantId },
    });
  }

  async update(id: string, updateCustomerDto: Partial<Customer>, tenantId: string): Promise<Customer> {
    await this.customersRepository.update(
      { id, tenantId },
      updateCustomerDto,
    );
    return await this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.customersRepository.delete({ id, tenantId });
  }

  async getCustomerProfile(id: string, tenantId: string): Promise<Customer> {
    return await this.findOne(id, tenantId);
  }
}