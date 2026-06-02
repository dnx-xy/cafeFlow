import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser, Roles, Public } from './decorators/auth.decorators';
import { UserRole } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return await this.authService.login(user);
  }

  @Get('me')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async getProfile(@AuthenticatedUser() user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      businessId: user.businessId,
    };
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: any) {
    const user = await this.authService.register(registerDto);
    return await this.authService.login(user);
  }

  @Post('refresh')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async refreshToken(@Body() refreshTokenDto: { refresh_token: string }, @AuthenticatedUser() user: any) {
    // For simplicity, we'll just return a new token with same data
    // In production, you'd want to validate the refresh token properly
    const payload = {
      email: user.email,
      id: user.id,
      name: user.name,
      tenantId: user.tenantId,
      businessId: user.businessId,
      role: user.role,
    };
    
    return {
      access_token: this.authService.signToken(payload),
      expires_in: 3600,
    };
  }

  @Post('logout')
  @Roles(UserRole.TENANT_OWNER, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER)
  async logout(@AuthenticatedUser() user: any) {
    // In a real implementation, you'd invalidate tokens here
    return { message: 'Successfully logged out' };
  }
}