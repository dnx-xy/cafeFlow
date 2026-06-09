import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';
import { CustomAttributeValue } from './custom-attribute-value.entity';
import { OrderItemMenuOption } from './order-item-menu-option.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column({ type: 'float' })
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => MenuItem, (item) => item.orderItems)
  menuItem: MenuItem;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @OneToMany(() => CustomAttributeValue, (value) => value.orderItem, { cascade: true })
  customAttributes: CustomAttributeValue[];

  @OneToMany(() => OrderItemMenuOption, (option) => option.orderItem, { cascade: true })
  menuOptions: OrderItemMenuOption[];
}