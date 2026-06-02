"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const tenants_module_1 = require("../tenants/tenants.module");
const businesses_module_1 = require("../businesses/businesses.module");
const outlets_module_1 = require("../outlets/outlets.module");
const tables_module_1 = require("../tables/tables.module");
const menus_module_1 = require("../menus/menus.module");
const orders_module_1 = require("../orders/orders.module");
const customers_module_1 = require("../customers/customers.module");
const loyalty_module_1 = require("../loyalty/loyalty.module");
const analytics_module_1 = require("../analytics/analytics.module");
const staff_module_1 = require("../staff/staff.module");
const notifications_module_1 = require("../notifications/notifications.module");
const payments_module_1 = require("../payments/payments.module");
const integration_module_1 = require("../integration/integration.module");
const business_entity_1 = require("../entities/business.entity");
const custom_attribute_entity_1 = require("../entities/custom-attribute.entity");
const custom_attribute_value_entity_1 = require("../entities/custom-attribute-value.entity");
const customer_entity_1 = require("../entities/customer.entity");
const customer_feedback_entity_1 = require("../entities/customer-feedback.entity");
const customer_note_entity_1 = require("../entities/customer-note.entity");
const customer_segment_entity_1 = require("../entities/customer-segment.entity");
const customer_segment_member_entity_1 = require("../entities/customer-segment-member.entity");
const loyalty_program_entity_1 = require("../entities/loyalty-program.entity");
const loyalty_reward_entity_1 = require("../entities/loyalty-reward.entity");
const loyalty_tier_rule_entity_1 = require("../entities/loyalty-tier-rule.entity");
const menu_entity_1 = require("../entities/menu.entity");
const menu_category_entity_1 = require("../entities/menu-category.entity");
const menu_group_entity_1 = require("../entities/menu-group.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const menu_option_entity_1 = require("../entities/menu-option.entity");
const menu_option_value_entity_1 = require("../entities/menu-option-value.entity");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const order_item_menu_option_entity_1 = require("../entities/order-item-menu-option.entity");
const order_note_entity_1 = require("../entities/order-note.entity");
const order_status_update_entity_1 = require("../entities/order-status-update.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const point_transaction_entity_1 = require("../entities/point-transaction.entity");
const promotion_entity_1 = require("../entities/promotion.entity");
const promotion_item_entity_1 = require("../entities/promotion-item.entity");
const qr_code_entity_1 = require("../entities/qr-code.entity");
const staff_entity_1 = require("../entities/staff.entity");
const table_entity_1 = require("../entities/table.entity");
const tenant_entity_1 = require("../entities/tenant.entity");
const user_entity_1 = require("../entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST || 'localhost',
                port: parseInt(process.env.DATABASE_PORT || '5432'),
                username: process.env.DATABASE_USER || 'postgres',
                password: process.env.DATABASE_PASSWORD || 'password',
                database: process.env.DATABASE_NAME || 'cafe_flow_dev',
                entities: [
                    business_entity_1.Business, custom_attribute_entity_1.CustomAttribute, custom_attribute_value_entity_1.CustomAttributeValue,
                    customer_entity_1.Customer, customer_feedback_entity_1.CustomerFeedback, customer_note_entity_1.CustomerNote,
                    customer_segment_entity_1.CustomerSegment, customer_segment_member_entity_1.CustomerSegmentMember,
                    loyalty_program_entity_1.LoyaltyProgram, loyalty_reward_entity_1.LoyaltyReward, loyalty_tier_rule_entity_1.LoyaltyTierRule,
                    menu_entity_1.Menu, menu_category_entity_1.MenuCategory, menu_group_entity_1.MenuGroup, menu_item_entity_1.MenuItem,
                    menu_option_entity_1.MenuOption, menu_option_value_entity_1.MenuOptionValue,
                    order_entity_1.Order, order_item_entity_1.OrderItem, order_item_menu_option_entity_1.OrderItemMenuOption,
                    order_note_entity_1.OrderNote, order_status_update_entity_1.OrderStatusUpdate,
                    outlet_entity_1.Outlet, point_transaction_entity_1.PointTransaction,
                    promotion_entity_1.Promotion, promotion_item_entity_1.PromotionItem,
                    qr_code_entity_1.QrCode, staff_entity_1.Staff, table_entity_1.Table, tenant_entity_1.Tenant, user_entity_1.User,
                ],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            businesses_module_1.BusinessesModule,
            outlets_module_1.OutletsModule,
            tables_module_1.TablesModule,
            menus_module_1.MenusModule,
            orders_module_1.OrdersModule,
            customers_module_1.CustomersModule,
            loyalty_module_1.LoyaltyModule,
            analytics_module_1.AnalyticsModule,
            staff_module_1.StaffModule,
            notifications_module_1.NotificationsModule,
            payments_module_1.PaymentsModule,
            integration_module_1.IntegrationModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map