import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { Business } from '../entities/business.entity';
import { Outlet } from '../entities/outlet.entity';
import { Staff } from '../entities/staff.entity';
import { Menu } from '../entities/menu.entity';
import { MenuItem } from '../entities/menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Outlet, Staff, Menu, MenuItem])],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
