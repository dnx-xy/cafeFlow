import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TenantsModule } from '../tenants/tenants.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { OutletsModule } from '../outlets/outlets.module';
import { TablesModule } from '../tables/tables.module';
import { MenusModule } from '../menus/menus.module';
import { OrdersModule } from '../orders/orders.module';
import { CustomersModule } from '../customers/customers.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { StaffModule } from '../staff/staff.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { IntegrationModule } from '../integration/integration.module';
import { QrCodesModule } from '../qr-codes/qr-codes.module';
import { PublicModule } from '../public/public.module';
import { PlansModule } from '../plans/plans.module';
import { Business } from '../entities/business.entity';
import { CustomAttribute } from '../entities/custom-attribute.entity';
import { CustomAttributeValue } from '../entities/custom-attribute-value.entity';
import { Customer } from '../entities/customer.entity';
import { CustomerFeedback } from '../entities/customer-feedback.entity';
import { CustomerNote } from '../entities/customer-note.entity';
import { CustomerSegment } from '../entities/customer-segment.entity';
import { CustomerSegmentMember } from '../entities/customer-segment-member.entity';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { LoyaltyReward } from '../entities/loyalty-reward.entity';
import { LoyaltyTierRule } from '../entities/loyalty-tier-rule.entity';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuGroup } from '../entities/menu-group.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuOption } from '../entities/menu-option.entity';
import { MenuOptionValue } from '../entities/menu-option-value.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemMenuOption } from '../entities/order-item-menu-option.entity';
import { OrderNote } from '../entities/order-note.entity';
import { OrderStatusUpdate } from '../entities/order-status-update.entity';
import { Outlet } from '../entities/outlet.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { Promotion } from '../entities/promotion.entity';
import { PromotionItem } from '../entities/promotion-item.entity';
import { QrCode } from '../entities/qr-code.entity';
import { Staff } from '../entities/staff.entity';
import { Table } from '../entities/table.entity';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'cafe_flow_dev',
      entities: [
        Business, CustomAttribute, CustomAttributeValue,
        Customer, CustomerFeedback, CustomerNote,
        CustomerSegment, CustomerSegmentMember,
        LoyaltyProgram, LoyaltyReward, LoyaltyTierRule,
        Menu, MenuCategory, MenuGroup, MenuItem,
        MenuOption, MenuOptionValue,
        Order, OrderItem, OrderItemMenuOption,
        OrderNote, OrderStatusUpdate,
        Outlet, PointTransaction,
        Promotion, PromotionItem,
        QrCode, Staff, Table, Tenant, User,
      ],
      synchronize: true,
    }),
    AuthModule,
    TenantsModule,
    BusinessesModule,
    OutletsModule,
    TablesModule,
    MenusModule,
    OrdersModule,
    CustomersModule,
    LoyaltyModule,
    AnalyticsModule,
    StaffModule,
    NotificationsModule,
    PaymentsModule,
    IntegrationModule,
    QrCodesModule,
    PublicModule,
    PlansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
