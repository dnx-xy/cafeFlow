import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomAttribute } from './custom-attribute.entity';
import { OrderItem } from './order-item.entity';

@Entity('custom_attribute_values')
export class CustomAttributeValue extends BaseEntity {
  @Column({ type: 'varchar' })
  attributeId: string;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'varchar' })
  orderItemId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => CustomAttribute, (attribute) => attribute.values)
  attribute: CustomAttribute;

  @ManyToOne(() => OrderItem, (item) => item.customAttributes)
  orderItem: OrderItem;
}