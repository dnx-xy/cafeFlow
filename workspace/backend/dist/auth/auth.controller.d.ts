import { AuthService } from './auth.service';
import { UserRole } from '../entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
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
    getProfile(user: any): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        tenantId: any;
        businessId: any;
    }>;
    register(registerDto: any): Promise<{
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
    refreshToken(refreshTokenDto: {
        refresh_token: string;
    }, user: any): Promise<{
        access_token: string;
        expires_in: number;
    }>;
    logout(user: any): Promise<{
        message: string;
    }>;
    switchTenant(body: {
        tenantId: string;
    }, currentUser: any): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            tenantId: string;
            businessId: string;
        };
    }>;
}
