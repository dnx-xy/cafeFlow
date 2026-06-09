import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Outlet } from '../entities/outlet.entity';
import { Table } from '../entities/table.entity';
import { Business } from '../entities/business.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemMenuOption } from '../entities/order-item-menu-option.entity';
import { Customer } from '../entities/customer.entity';
import { CustomerFeedback } from '../entities/customer-feedback.entity';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Menu, MenuCategory, MenuItem, Outlet, Table, Business,
      Order, OrderItem, OrderItemMenuOption, Customer, CustomerFeedback,
      LoyaltyProgram, PointTransaction,
    ]),
    NotificationsModule,
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
