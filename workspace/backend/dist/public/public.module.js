"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const public_controller_1 = require("./public.controller");
const public_service_1 = require("./public.service");
const menu_entity_1 = require("../entities/menu.entity");
const menu_category_entity_1 = require("../entities/menu-category.entity");
const menu_item_entity_1 = require("../entities/menu-item.entity");
const outlet_entity_1 = require("../entities/outlet.entity");
const table_entity_1 = require("../entities/table.entity");
const business_entity_1 = require("../entities/business.entity");
const order_entity_1 = require("../entities/order.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const order_item_menu_option_entity_1 = require("../entities/order-item-menu-option.entity");
const customer_entity_1 = require("../entities/customer.entity");
const customer_feedback_entity_1 = require("../entities/customer-feedback.entity");
const loyalty_program_entity_1 = require("../entities/loyalty-program.entity");
const point_transaction_entity_1 = require("../entities/point-transaction.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let PublicModule = class PublicModule {
};
exports.PublicModule = PublicModule;
exports.PublicModule = PublicModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                menu_entity_1.Menu, menu_category_entity_1.MenuCategory, menu_item_entity_1.MenuItem, outlet_entity_1.Outlet, table_entity_1.Table, business_entity_1.Business,
                order_entity_1.Order, order_item_entity_1.OrderItem, order_item_menu_option_entity_1.OrderItemMenuOption, customer_entity_1.Customer, customer_feedback_entity_1.CustomerFeedback,
                loyalty_program_entity_1.LoyaltyProgram, point_transaction_entity_1.PointTransaction,
            ]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [public_controller_1.PublicController],
        providers: [public_service_1.PublicService],
    })
], PublicModule);
//# sourceMappingURL=public.module.js.map