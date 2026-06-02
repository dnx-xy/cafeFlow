import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Menu } from './menu.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_groups')
export class MenuGroup extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  sortIndex: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  menuId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Menu, (menu) => menu.menuGroups)
  menu: Menu;

  @OneToMany(() => MenuItem, (item) => item.group)
  menuItems: MenuItem[];
}