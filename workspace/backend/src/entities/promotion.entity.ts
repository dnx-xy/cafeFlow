import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Menu } from './menu.entity';
import { PromotionItem } from './promotion-item.entity';

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  FREESHIP = 'FREESHIP'
}

@Entity('promotions')
export class Promotion extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PromotionType })
  type: PromotionType;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'float' })
  discountValue: number;

  @Column({ type: 'float', nullable: true })
  maxDiscount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar' })
  menuId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => Menu, (menu) => menu.promotions)
  menu: Menu;

  @OneToMany(() => PromotionItem, (item) => item.promotion)
  promotionItems: PromotionItem[];
}