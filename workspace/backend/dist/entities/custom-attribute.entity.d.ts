import { BaseEntity } from './base.entity';
import { MenuItem } from './menu-item.entity';
import { CustomAttributeValue } from './custom-attribute-value.entity';
export declare class CustomAttribute extends BaseEntity {
    name: string;
    value: string;
    menuItemId: string;
    tenantId: string;
    menuItem: MenuItem;
    values: CustomAttributeValue[];
}
