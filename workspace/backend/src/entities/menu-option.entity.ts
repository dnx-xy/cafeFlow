import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { MenuOptionValue } from './menu-option-value.entity';

@Entity('menu_options')
export class MenuOption extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: true })
  priceAdjustment: number;

  @Column({ default: false })
  required: boolean;

  @Column({ type: 'varchar' })
  menuItemId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => MenuItem, (item) => item.menuOptions)
  menuItem: MenuItem;

  @OneToMany(() => MenuOptionValue, (value) => value.menuOption)
  options: MenuOptionValue[];
}