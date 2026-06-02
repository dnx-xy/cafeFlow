import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { Promotion } from './promotion.entity';
export declare class PromotionItem extends BaseEntity {
    menuItemId: string;
    promotionId: string;
    tenantId: string;
    menuItem: MenuItem;
    promotion: Promotion;
}
