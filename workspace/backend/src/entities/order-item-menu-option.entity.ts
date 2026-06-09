import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuOption } from './menu-option.entity';
import { OrderItem } from './order-item.entity';

@Entity('order_item_menu_options')
export class OrderItemMenuOption extends BaseEntity {
  @Column({ nullable: true })
  optionValueId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'float', nullable: true })
  priceAdjustment: number;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => MenuOption, (option) => option.options)
  option: MenuOption;

  @ManyToOne(() => OrderItem, (item) => item.menuOptions)
  orderItem: OrderItem;
}