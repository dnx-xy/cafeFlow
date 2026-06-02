import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
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

async function seed() {
  const dataSource = new DataSource({
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
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connected');

  const userRepo = dataSource.getRepository(User);
  const tenantRepo = dataSource.getRepository(Tenant);
  const businessRepo = dataSource.getRepository(Business);

  const existingAdmin = await userRepo.findOne({ where: { role: 'SUPER_ADMIN' as any } });
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
    ownerId: '',  // will update after user creation
    tenantId: tenant.id,
  });
  await businessRepo.save(business);

  const adminUser = userRepo.create({
    name: 'Super Admin',
    email: 'admin@cafeflow.com',
    passwordHash,
    role: 'SUPER_ADMIN' as any,
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
