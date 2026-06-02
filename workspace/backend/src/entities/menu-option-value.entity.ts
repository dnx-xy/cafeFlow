import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuOption } from './menu-option.entity';

@Entity('menu_option_values')
export class MenuOptionValue extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: true })
  priceAdjustment: number;

  @Column({ default: true })
  available: boolean;

  @Column({ type: 'varchar' })
  menuOptionId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => MenuOption, (option) => option.options)
  menuOption: MenuOption;
}