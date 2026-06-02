import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { Promotion } from './promotion.entity';

@Entity('promotion_items')
export class PromotionItem extends BaseEntity {
  @Column({ type: 'varchar' })
  menuItemId: string;

  @Column({ type: 'varchar' })
  promotionId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => MenuItem, (item) => item.promotionItems)
  menuItem: MenuItem;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionItems)
  promotion: Promotion;
}