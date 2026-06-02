import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Outlet } from './outlet.entity';
import { Business } from './business.entity';
import { MenuCategory } from './menu-category.entity';
import { MenuGroup } from './menu-group.entity';
import { Promotion } from './promotion.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  outletId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @Column({ type: 'varchar' })
  businessId: string;

  @ManyToOne(() => Business, (business) => business.menus)
  business: Business;

  @ManyToOne(() => Outlet, (outlet) => outlet.menus)
  outlet: Outlet;

  @OneToMany(() => MenuCategory, (category) => category.menu)
  categories: MenuCategory[];

  @OneToMany(() => MenuGroup, (group) => group.menu)
  menuGroups: MenuGroup[];

  @OneToMany(() => Promotion, (promotion) => promotion.menu)
  promotions: Promotion[];
}