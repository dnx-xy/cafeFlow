"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
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
async function seed() {
    const dataSource = new typeorm_1.DataSource({
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
        synchronize: false,
    });
    await dataSource.initialize();
    console.log('Database connected');
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const tenantRepo = dataSource.getRepository(tenant_entity_1.Tenant);
    const businessRepo = dataSource.getRepository(business_entity_1.Business);
    const existingAdmin = await userRepo.findOne({ where: { role: 'SUPER_ADMIN' } });
    if (existingAdmin) {
        console.log(`SUPER_ADMIN already exists: ${existingAdmin.email}`);
        await dataSource.destroy();
        return;
    }
    const passwordHash = await bcrypt.hash('admin123', 10);
    const tenant = tenantRepo.create({
        name: 'CafeFlow Platform',
        slug: 'cafeflow-platform',
    });
    await tenantRepo.save(tenant);
    const business = businessRepo.create({
        name: 'CafeFlow Platform',
        ownerId: '',
        tenantId: tenant.id,
    });
    await businessRepo.save(business);
    const adminUser = userRepo.create({
        name: 'Super Admin',
        email: 'admin@cafeflow.com',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
        tenantId: tenant.id,
        businessId: business.id,
    });
    await userRepo.save(adminUser);
    business.ownerId = adminUser.id;
    await businessRepo.save(business);
    console.log('');
    console.log('=== SUPER_ADMIN Created ===');
    console.log('  Email:    admin@cafeflow.com');
    console.log('  Password: admin123');
    console.log('');
    await dataSource.destroy();
}
seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map