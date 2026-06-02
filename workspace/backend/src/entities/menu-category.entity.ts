import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Menu } from './menu.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_categories')
export class MenuCategory extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ nullable: true })
  sortIndex: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  menuId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Menu, (menu) => menu.categories)
  menu: Menu;

  @OneToMany(() => MenuItem, (item) => item.category)
  menuItems: MenuItem[];
}