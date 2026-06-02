import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Tenant, Business, Outlet]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
  exports: [AuthService],
})
export class AuthModule {}