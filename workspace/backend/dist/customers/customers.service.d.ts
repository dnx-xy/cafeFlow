import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
export declare class CustomersService {
    private customersRepository;
    constructor(customersRepository: Repository<Customer>);
    create(customerData: Partial<Customer>, tenantId: string): Promise<Customer>;
    findAll(tenantId: string): Promise<Customer[]>;
    findOne(id: string, tenantId: string): Promise<Customer>;
    findByPhoneNumber(phoneNumber: string, tenantId: string): Promise<Customer>;
    update(id: string, updateCustomerDto: Partial<Customer>, tenantId: string): Promise<Customer>;
    remove(id: string, tenantId: string): Promise<void>;
    getCustomerProfile(id: string, tenantId: string): Promise<Customer>;
}
