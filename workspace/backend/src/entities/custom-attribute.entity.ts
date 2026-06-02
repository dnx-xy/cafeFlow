import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { CustomAttributeValue } from './custom-attribute-value.entity';

@Entity('custom_attributes')
export class CustomAttribute extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'varchar' })
  menuItemId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => MenuItem, (item) => item.customAttributes)
  menuItem: MenuItem;

  @OneToMany(() => CustomAttributeValue, (value) => value.attribute)
  values: CustomAttributeValue[];
}