import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersRepository;
    private tenantsRepository;
    private businessesRepository;
    private outletsRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, tenantsRepository: Repository<Tenant>, businessesRepository: Repository<Business>, outletsRepository: Repository<Outlet>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: User): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            tenantId: string;
            businessId: string;
        };
    }>;
    signToken(payload: any, expiresIn?: string): string;
    register(userData: Partial<User> & {
        businessName?: string;
    }): Promise<User>;
    findTenantById(id: string): Promise<Tenant | null>;
    findBusinessByTenantId(tenantId: string): Promise<Business | null>;
}
