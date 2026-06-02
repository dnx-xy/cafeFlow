import { BaseEntity } from './base.entity';
import { Menu } from './menu.entity';
import { PromotionItem } from './promotion-item.entity';
export declare enum PromotionType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    BUY_X_GET_Y = "BUY_X_GET_Y",
    FREESHIP = "FREESHIP"
}
export declare class Promotion extends BaseEntity {
    name: string;
    description: string;
    type: PromotionType;
    startDate: Date;
    endDate: Date;
    discountValue: number;
    maxDiscount: number;
    isActive: boolean;
    menuId: string;
    tenantId: string;
    menu: Menu;
    promotionItems: PromotionItem[];
}
