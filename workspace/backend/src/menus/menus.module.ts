import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Outlet } from '../entities/outlet.entity';
import { MenuGateway } from './menu.gateway';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, MenuCategory, MenuItem, Outlet]), PlansModule],
  controllers: [MenusController],
  providers: [MenusService, MenuGateway],
  exports: [MenusService, MenuGateway],
})
export class MenusModule {}