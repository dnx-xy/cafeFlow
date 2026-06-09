import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { User } from '../entities/user.entity';
import { QrCode } from '../entities/qr-code.entity';
import { QrCodesModule } from '../qr-codes/qr-codes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, Business, Outlet, User, QrCode]),
    QrCodesModule,
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}