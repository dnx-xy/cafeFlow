import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuCategory } from './menu-category.entity';
import { MenuGroup } from './menu-group.entity';
import { Menu } from './menu.entity';
import { CustomAttribute } from './custom-attribute.entity';
import { MenuOption } from './menu-option.entity';
import { OrderItem } from './order-item.entity';
import { PromotionItem } from './promotion-item.entity';

@Entity('menu_items')
export class MenuItem extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  available: boolean;

  @Column({ default: false })
  soldOut: boolean;

  @Column({ default: false })
  hidden: boolean;

  @Column({ nullable: true })
  stockQuantity: number;

  @Column({ nullable: true })
  categorySortIndex: number;

  @Column({ nullable: true })
  groupSortIndex: number;

  @Column({ default: 0 })
  popularityScore: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isSpecialOffer: boolean;

  @Column({ nullable: true })
  menuCategoryId: string;

  @Column({ nullable: true })
  menuGroupId: string;

  @Column({ type: 'varchar' })
  menuId: string;

  @Column({ type: 'varchar' })
  tenantId: string;

  @ManyToOne(() => MenuCategory, (category) => category.menuItems, { nullable: true })
  @JoinColumn({ name: 'menuCategoryId' })
  category: MenuCategory;

  @ManyToOne(() => MenuGroup, (group) => group.menuItems, { nullable: true })
  @JoinColumn({ name: 'menuGroupId' })
  group: MenuGroup;

  @ManyToOne(() => Menu, (menu) => menu.categories)
  menu: Menu;

  @OneToMany(() => CustomAttribute, (attribute) => attribute.menuItem)
  customAttributes: CustomAttribute[];

  @OneToMany(() => MenuOption, (option) => option.menuItem)
  menuOptions: MenuOption[];

  @OneToMany(() => OrderItem, (item) => item.menuItem)
  orderItems: OrderItem[];

  @OneToMany(() => PromotionItem, (item) => item.menuItem)
  promotionItems: PromotionItem[];
}