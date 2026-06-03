import { DataSource } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Business } from '../entities/business.entity';
import { User } from '../entities/user.entity';
import { Customer } from '../entities/customer.entity';
import { Menu } from '../entities/menu.entity';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Outlet } from '../entities/outlet.entity';
import { QrCode } from '../entities/qr-code.entity';
import { Table } from '../entities/table.entity';
import { Staff } from '../entities/staff.entity';
import { CustomerFeedback } from '../entities/customer-feedback.entity';
import { CustomerNote } from '../entities/customer-note.entity';
import { CustomerSegment } from '../entities/customer-segment.entity';
import { CustomerSegmentMember } from '../entities/customer-segment-member.entity';
import { LoyaltyProgram } from '../entities/loyalty-program.entity';
import { LoyaltyReward } from '../entities/loyalty-reward.entity';
import { LoyaltyTierRule } from '../entities/loyalty-tier-rule.entity';
import { MenuGroup } from '../entities/menu-group.entity';
import { MenuOption } from '../entities/menu-option.entity';
import { MenuOptionValue } from '../entities/menu-option-value.entity';
import { OrderItemMenuOption } from '../entities/order-item-menu-option.entity';
import { OrderNote } from '../entities/order-note.entity';
import { OrderStatusUpdate } from '../entities/order-status-update.entity';
import { PointTransaction } from '../entities/point-transaction.entity';
import { Promotion } from '../entities/promotion.entity';
import { PromotionItem } from '../entities/promotion-item.entity';

async function cleanupGenericData() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'cafe_flow_dev',
    entities: [
      Tenant, Business, User, Customer, Menu, MenuCategory, MenuItem,
      Order, OrderItem, Outlet, QrCode, Table, Staff,
      CustomerFeedback, CustomerNote, CustomerSegment, CustomerSegmentMember,
      LoyaltyProgram, LoyaltyReward, LoyaltyTierRule,
      MenuGroup, MenuOption, MenuOptionValue,
      OrderItemMenuOption, OrderNote, OrderStatusUpdate,
      PointTransaction, Promotion, PromotionItem,
    ],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connected');
  console.log('\n=== CLEANING UP GENERIC DATA ===\n');

  // Find and delete generic tenants
  const genericTenantNames = ['My Cafe', 'Test Cafe', 'Test Business'];

  for (const name of genericTenantNames) {
    const result = await dataSource.query(
      `DELETE FROM tenants WHERE name = $1 RETURNING id, name`,
      [name]
    );
    if (result.length > 0) {
      console.log(`✓ Deleted generic tenant: ${name}`);
    }
  }

  // Also delete by slug
  const genericSlugs = ['my-cafe', 'test-cafe', 'cafe', 'test-business'];

  for (const slug of genericSlugs) {
    const result = await dataSource.query(
      `DELETE FROM tenants WHERE slug = $1 AND name IN ('My Cafe', 'Test Cafe', 'Test Business') RETURNING id, name`,
      [slug]
    );
    if (result.length > 0) {
      console.log(`✓ Deleted tenant by slug: ${slug}`);
    }
  }

  // Delete generic businesses
  const genericBusinessNames = ['My Cafe', 'Test Cafe', 'Test Business'];

  for (const name of genericBusinessNames) {
    const result = await dataSource.query(
      `DELETE FROM businesses WHERE name = $1 RETURNING id, name`,
      [name]
    );
    if (result.length > 0) {
      console.log(`✓ Deleted generic business: ${name}`);
    }
  }

  // Delete users associated with deleted tenants (optional - be careful)
  // Keep super admin and real tenant users
  const deletedUsers = await dataSource.query(
    `DELETE FROM users WHERE email LIKE '%@my-cafe%' OR email LIKE '%@test-cafe%' RETURNING email`
  );
  if (deletedUsers.length > 0) {
    console.log(`✓ Deleted ${deletedUsers.length} generic users`);
  }

  console.log('\n=== CLEANUP COMPLETE ===\n');

  // Show remaining tenants
  const remainingTenants = await dataSource.query(
    `SELECT id, name, slug FROM tenants ORDER BY name`
  );
  console.log('Remaining tenants:');
  for (const tenant of remainingTenants) {
    console.log(`  - ${tenant.name} (${tenant.slug})`);
  }

  await dataSource.destroy();
}

cleanupGenericData().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
