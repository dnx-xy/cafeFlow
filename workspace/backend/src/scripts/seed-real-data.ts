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

// Real high-quality food images from Unsplash
const IMAGES: Record<string, string> = {
  // Coffee & Beverages
  espresso: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&auto=format&fit=crop',
  cappuccino: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop',
  latte: 'https://images.unsplash.com/photo-1570968992193-fd9536ee74e9?w=600&auto=format&fit=crop',
  americano: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&auto=format&fit=crop',
  mocha: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop',
  cold_brew: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop',
  frappe: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop',
  matcha: 'https://images.unsplash.com/photo-1515823662972-da6a2e1d3102?w=600&auto=format&fit=crop',
  chai: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=600&auto=format&fit=crop',
  thai_tea: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&auto=format&fit=crop',
  smoothie: 'https://images.unsplash.com/photo-1553530979-7ee52a2670fc?w=600&auto=format&fit=crop',
  fresh_juice: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop',
  flatWhite: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop',

  // Breakfast & Brunch
  pancakes: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop',
  waffles: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop',
  french_toast: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop',
  eggs_benedict: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop',
  avocado_toast: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=600&auto=format&fit=crop',
  granola: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop',
  oatmeal: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop',
  breakfast_burrito: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop',
  croissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop',
  bagel: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=600&auto=format&fit=crop',
  muffin: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop',
  scone: 'https://images.unsplash.com/photo-1546552356-3fae876a61ca?w=600&auto=format&fit=crop',

  // Sandwiches & Lunch
  club_sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop',
  blt: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430b?w=600&auto=format&fit=crop',
  grilled_cheese: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop',
  turkey_sandwich: 'https://images.unsplash.com/photo-1554433607-66b5efe7b99e?w=600&auto=format&fit=crop',
  chicken_sandwich: 'https://images.unsplash.com/photo-1606755962773-d324e0a5c09b?w=600&auto=format&fit=crop',
  veggie_wrap: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop',
  panini: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
  chicken_caesar: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop',
  cobb_salad: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
  greek_salad: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop',
  quinoa_bowl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',

  // Pastries & Desserts
  cake_slice: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop',
  cheesecake: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=600&auto=format&fit=crop',
  tiramisu: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop',
  chocolate_cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop',
  carrot_cake: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop',
  brownie: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=600&auto=format&fit=crop',
  cookie: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop',
  macaron: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop',
  donut: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop',
  cinnamon_roll: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&auto=format&fit=crop',
  apple_pie: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600&auto=format&fit=crop',
  gelato: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop',

  // Indonesian Specialties
  nasi_goreng: 'https://images.unsplash.com/photo-1622307144036-5b0b9afb32c8?w=600&auto=format&fit=crop',
  mie_goreng: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop',
  sate_ayam: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop',
  rendang: 'https://images.unsplash.com/photo-1645696301012-1e38f5b2741f?w=600&auto=format&fit=crop',
  kopi_tubruk: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop',
  es_teler: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop',
  // Fallback
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop',
};

interface MenuItemData {
  category: string;
  name: string;
  description: string;
  price: number;
  imageKey: string;
  isFeatured?: boolean;
}

interface CategoryData {
  name: string;
  description: string;
  sortIndex: number;
}

interface CafeData {
  tenantName: string;
  tenantSlug: string;
  businessName: string;
  description: string;
  currency: string;
  outletName: string;
  address: string;
  phone: string;
  categories: CategoryData[];
  items: MenuItemData[];
}

// Real cafe data with actual products
const CAFES: CafeData[] = [
  {
    tenantName: 'The Daily Grind Coffee Co.',
    tenantSlug: 'the-daily-grind',
    businessName: 'The Daily Grind Coffee Co.',
    description: 'Artisan coffee roasters serving specialty single-origin coffee and house-made pastries since 2018.',
    currency: 'USD',
    outletName: 'Main Street Location',
    address: '123 Main Street, Seattle, WA 98101',
    phone: '12065551234',
    categories: [
      { name: 'Hot Coffee', description: 'Freshly brewed specialty coffee', sortIndex: 1 },
      { name: 'Cold Coffee', description: 'Iced and cold brew selections', sortIndex: 2 },
      { name: 'Espresso Bar', description: 'Classic espresso beverages', sortIndex: 3 },
      { name: 'Breakfast', description: 'Morning favorites', sortIndex: 4 },
      { name: 'Pastries', description: 'Fresh baked daily', sortIndex: 5 },
      { name: 'Lunch', description: 'Sandwiches and salads', sortIndex: 6 },
    ],
    items: [
      // Hot Coffee
      { category: 'Hot Coffee', name: 'House Blend Drip', description: 'Our signature medium roast with notes of chocolate and caramel', price: 3.50, imageKey: 'espresso', isFeatured: true },
      { category: 'Hot Coffee', name: 'Single Origin Pour Over', description: 'Rotating selection of Ethiopian or Colombian beans', price: 4.50, imageKey: 'espresso' },
      { category: 'Hot Coffee', name: 'French Press', description: 'Rich, full-bodied coffee for two', price: 5.00, imageKey: 'espresso' },
      // Cold Coffee
      { category: 'Cold Coffee', name: 'Cold Brew', description: 'Steeped 18 hours for smooth, low-acid coffee', price: 4.00, imageKey: 'cold_brew', isFeatured: true },
      { category: 'Cold Coffee', name: 'Nitro Cold Brew', description: 'Creamy, nitrogen-infused cold brew', price: 5.00, imageKey: 'cold_brew' },
      { category: 'Cold Coffee', name: 'Iced Latte', description: 'Espresso over ice with cold milk', price: 4.50, imageKey: 'latte' },
      { category: 'Cold Coffee', name: 'Iced Mocha', description: 'Espresso, chocolate, and milk over ice', price: 5.00, imageKey: 'mocha' },
      // Espresso Bar
      { category: 'Espresso Bar', name: 'Espresso', description: 'Double shot of our house espresso blend', price: 2.50, imageKey: 'espresso' },
      { category: 'Espresso Bar', name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and foam', price: 3.75, imageKey: 'cappuccino', isFeatured: true },
      { category: 'Espresso Bar', name: 'Latte', description: 'Espresso with steamed milk and light foam', price: 4.00, imageKey: 'latte' },
      { category: 'Espresso Bar', name: 'Flat White', description: 'Espresso with velvety steamed milk', price: 4.00, imageKey: 'flatWhite' },
      { category: 'Espresso Bar', name: 'Americano', description: 'Espresso diluted with hot water', price: 3.25, imageKey: 'americano' },
      { category: 'Espresso Bar', name: 'Mocha', description: 'Espresso with chocolate and steamed milk', price: 4.75, imageKey: 'mocha', isFeatured: true },
      // Breakfast
      { category: 'Breakfast', name: 'Avocado Toast', description: 'Sourdough, smashed avocado, chili flakes, sea salt', price: 8.50, imageKey: 'avocado_toast', isFeatured: true },
      { category: 'Breakfast', name: 'Buttermilk Pancakes', description: 'Three fluffy pancakes with maple syrup', price: 9.00, imageKey: 'pancakes' },
      { category: 'Breakfast', name: 'Belgian Waffles', description: 'Crispy waffles with berries and whipped cream', price: 10.00, imageKey: 'waffles' },
      { category: 'Breakfast', name: 'Granola Bowl', description: 'House-made granola with yogurt and fresh fruit', price: 7.50, imageKey: 'granola' },
      // Pastries
      { category: 'Pastries', name: 'Almond Croissant', description: 'Buttery croissant with almond filling', price: 4.50, imageKey: 'croissant', isFeatured: true },
      { category: 'Pastries', name: 'Chocolate Muffin', description: 'Rich double chocolate muffin', price: 3.50, imageKey: 'muffin' },
      { category: 'Pastries', name: 'Cinnamon Roll', description: 'Warm roll with cream cheese glaze', price: 4.00, imageKey: 'cinnamon_roll' },
      { category: 'Pastries', name: 'Blueberry Scone', description: 'Buttery scone with fresh blueberries', price: 3.50, imageKey: 'scone' },
      { category: 'Pastries', name: 'Chocolate Chip Cookie', description: 'Large cookie with sea salt', price: 2.50, imageKey: 'cookie' },
      // Lunch
      { category: 'Lunch', name: 'Turkey Club', description: 'Roasted turkey, bacon, avocado on sourdough', price: 11.00, imageKey: 'turkey_sandwich' },
      { category: 'Lunch', name: 'Grilled Chicken Panini', description: 'Chicken, pesto, mozzarella on focaccia', price: 10.50, imageKey: 'panini', isFeatured: true },
      { category: 'Lunch', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, house dressing', price: 9.00, imageKey: 'chicken_caesar' },
      { category: 'Lunch', name: 'Quinoa Bowl', description: 'Quinoa, roasted veggies, tahini dressing', price: 10.00, imageKey: 'quinoa_bowl' },
    ],
  },
  {
    tenantName: 'Urban Brew & Bites',
    tenantSlug: 'urban-brew',
    businessName: 'Urban Brew & Bites',
    description: 'Modern cafe offering craft coffee, healthy bowls, and grab-and-go meals for busy professionals.',
    currency: 'USD',
    outletName: 'Downtown Express',
    address: '456 Commerce Ave, New York, NY 10001',
    phone: '12125559876',
    categories: [
      { name: 'Craft Coffee', description: 'Specialty coffee drinks', sortIndex: 1 },
      { name: 'Alternative Milks', description: 'Oat, almond, coconut milk options', sortIndex: 2 },
      { name: 'Power Bowls', description: 'Nutritious grain bowls', sortIndex: 3 },
      { name: 'Fresh Pressed', description: 'Cold pressed juices', sortIndex: 4 },
      { name: 'Quick Bites', description: 'Snacks and light meals', sortIndex: 5 },
    ],
    items: [
      // Craft Coffee
      { category: 'Craft Coffee', name: 'Oat Milk Latte', description: 'Silky oat milk latte with espresso', price: 5.50, imageKey: 'latte', isFeatured: true },
      { category: 'Craft Coffee', name: 'Honey Almond Cappuccino', description: 'Cappuccino with honey and almond milk', price: 5.00, imageKey: 'cappuccino' },
      { category: 'Craft Coffee', name: 'Coconut Mocha', description: 'Mocha with coconut milk and dark chocolate', price: 5.50, imageKey: 'mocha' },
      { category: 'Craft Coffee', name: 'Maple Cold Brew', description: 'Cold brew sweetened with pure maple syrup', price: 5.00, imageKey: 'cold_brew' },
      // Alternative Milks
      { category: 'Alternative Milks', name: 'Matcha Latte', description: 'Ceremonial grade matcha with oat milk', price: 5.50, imageKey: 'matcha', isFeatured: true },
      { category: 'Alternative Milks', name: 'Golden Milk', description: 'Turmeric, ginger, cinnamon with coconut milk', price: 4.50, imageKey: 'chai' },
      { category: 'Alternative Milks', name: 'Chai Latte', description: 'Spiced chai with steamed milk', price: 4.50, imageKey: 'chai' },
      // Power Bowls
      { category: 'Power Bowls', name: 'Acai Bowl', description: 'Acai, granola, banana, berries, honey', price: 10.00, imageKey: 'granola', isFeatured: true },
      { category: 'Power Bowls', name: 'Buddha Bowl', description: 'Brown rice, chickpeas, avocado, tahini', price: 12.00, imageKey: 'quinoa_bowl' },
      { category: 'Power Bowls', name: 'Poke Bowl', description: 'Sushi rice, salmon, edamame, seaweed', price: 14.00, imageKey: 'quinoa_bowl' },
      // Fresh Pressed
      { category: 'Fresh Pressed', name: 'Green Detox', description: 'Kale, apple, lemon, ginger', price: 6.50, imageKey: 'fresh_juice', isFeatured: true },
      { category: 'Fresh Pressed', name: 'Carrot Sunshine', description: 'Carrot, orange, turmeric', price: 6.00, imageKey: 'fresh_juice' },
      { category: 'Fresh Pressed', name: 'Berry Blast', description: 'Strawberry, blueberry, apple', price: 6.50, imageKey: 'smoothie' },
      // Quick Bites
      { category: 'Quick Bites', name: 'Protein Box', description: 'Hard-boiled eggs, cheese, nuts, fruit', price: 8.00, imageKey: 'granola' },
      { category: 'Quick Bites', name: 'Veggie Wrap', description: 'Hummus, veggies, feta in spinach wrap', price: 7.50, imageKey: 'veggie_wrap' },
      { category: 'Quick Bites', name: 'Energy Balls', description: 'Dates, oats, almond butter, cacao', price: 3.50, imageKey: 'granola' },
    ],
  },
  {
    tenantName: 'Cafe des Artistes',
    tenantSlug: 'cafe-des-artistes',
    businessName: 'Cafe des Artistes',
    description: 'French-inspired cafe with artisan pastries, light meals, and an artistic atmosphere perfect for creative work.',
    currency: 'USD',
    outletName: 'Gallery District',
    address: '789 Gallery Row, San Francisco, CA 94102',
    phone: '14155551234',
    categories: [
      { name: 'French Coffee', description: 'Classic French coffee preparations', sortIndex: 1 },
      { name: 'Pâtisserie', description: 'French pastries', sortIndex: 2 },
      { name: 'Tartines', description: 'Open-faced sandwiches', sortIndex: 3 },
      { name: 'Desserts', description: 'Sweet indulgences', sortIndex: 4 },
    ],
    items: [
      // French Coffee
      { category: 'French Coffee', name: 'Café au Lait', description: 'Half coffee, half steamed milk', price: 4.00, imageKey: 'latte' },
      { category: 'French Coffee', name: 'Café Crème', description: 'Espresso with thick cream', price: 4.50, imageKey: 'cappuccino', isFeatured: true },
      { category: 'French Coffee', name: 'Noisette', description: 'Espresso with a touch of milk', price: 3.50, imageKey: 'espresso' },
      // Pâtisserie
      { category: 'Pâtisserie', name: 'Croissant au Beurre', description: 'Buttery French croissant', price: 3.50, imageKey: 'croissant', isFeatured: true },
      { category: 'Pâtisserie', name: 'Pain au Chocolat', description: 'Chocolate-filled pastry', price: 4.00, imageKey: 'croissant' },
      { category: 'Pâtisserie', name: 'Almond Croissant', description: 'Croissant with almond cream', price: 4.50, imageKey: 'croissant' },
      { category: 'Pâtisserie', name: 'Macarons', description: 'Three macarons: choose your flavors', price: 5.00, imageKey: 'macaron', isFeatured: true },
      { category: 'Pâtisserie', name: 'Éclair', description: 'Choux pastry with vanilla cream', price: 4.50, imageKey: 'donut' },
      { category: 'Pâtisserie', name: 'Mille-feuille', description: 'Layers of puff pastry and cream', price: 5.50, imageKey: 'cake_slice' },
      // Tartines
      { category: 'Tartines', name: 'Tartine Provençal', description: 'Tomato, herbes de Provence, olive oil', price: 7.00, imageKey: 'avocado_toast' },
      { category: 'Tartines', name: 'Tartine Nordique', description: 'Smoked salmon, crème fraîche, dill', price: 9.00, imageKey: 'avocado_toast', isFeatured: true },
      { category: 'Tartines', name: 'Tartine Chevre', description: 'Goat cheese, honey, walnuts', price: 8.00, imageKey: 'avocado_toast' },
      // Desserts
      { category: 'Desserts', name: 'Tarte Tatin', description: 'Caramelized apple tart', price: 7.00, imageKey: 'apple_pie', isFeatured: true },
      { category: 'Desserts', name: 'Crème Brûlée', description: 'Vanilla custard with caramelized sugar', price: 7.50, imageKey: 'pancakes' },
      { category: 'Desserts', name: 'Chocolate Fondant', description: 'Molten chocolate cake', price: 8.00, imageKey: 'chocolate_cake' },
      { category: 'Desserts', name: 'Profiteroles', description: 'Cream puffs with chocolate sauce', price: 6.50, imageKey: 'donut' },
    ],
  },
];

async function seedRealData() {
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

  const tenantRepo = dataSource.getRepository(Tenant);
  const businessRepo = dataSource.getRepository(Business);
  const outletRepo = dataSource.getRepository(Outlet);
  const menuRepo = dataSource.getRepository(Menu);
  const categoryRepo = dataSource.getRepository(MenuCategory);
  const itemRepo = dataSource.getRepository(MenuItem);
  const userRepo = dataSource.getRepository(User);

  console.log('\n=== SEEDING REAL CAFE DATA ===\n');

  let totalTenants = 0;
  let totalBusinesses = 0;
  let totalItems = 0;

  for (const cafe of CAFES) {
    // Check if tenant already exists
    let tenant = await tenantRepo.findOne({ where: { slug: cafe.tenantSlug } });

    if (!tenant) {
      // Create tenant
      tenant = tenantRepo.create({
        name: cafe.tenantName,
        slug: cafe.tenantSlug,
      });
      await tenantRepo.save(tenant);
      console.log(`✓ Created tenant: ${tenant.name}`);
      totalTenants++;
    } else {
      // Update tenant name if it was generic
      if (tenant.name !== cafe.tenantName) {
        tenant.name = cafe.tenantName;
        await tenantRepo.save(tenant);
        console.log(`✓ Updated tenant: ${tenant.name}`);
      } else {
        console.log(`• Tenant exists: ${tenant.name}`);
      }
    }

    // Check if business exists first
    let business = await businessRepo.findOne({ where: { tenantId: tenant.id, name: cafe.businessName } });

    if (!business) {
      // Create business without owner first
      business = businessRepo.create({
        name: cafe.businessName,
        description: cafe.description,
        ownerId: '', // Will update after user creation
        tenantId: tenant.id,
        currency: cafe.currency,
        plan: 'PRO',
        city: cafe.address.split(',').slice(-2)[0]?.trim() || 'Unknown',
        countryCode: cafe.currency === 'USD' ? 'US' : 'ID',
      });
      // Temporarily bypass FK constraint by setting a valid UUID
      business.ownerId = tenant.id; // Use tenant id as placeholder
      await businessRepo.save(business);
      console.log(`✓ Created business: ${business.name}`);
      totalBusinesses++;
    } else {
      console.log(`• Business exists: ${business.name}`);
    }

    // Create owner user
    const ownerEmail = `owner@${cafe.tenantSlug}.com`;
    let owner = await userRepo.findOne({ where: { email: ownerEmail } });

    if (!owner) {
      const passwordHash = await bcrypt.hash('owner123', 10);
      owner = userRepo.create({
        name: `${cafe.tenantName} Owner`,
        email: ownerEmail,
        passwordHash,
        role: 'TENANT_OWNER' as any,
        isActive: true,
        tenantId: tenant.id,
        businessId: business.id,
      });
      await userRepo.save(owner);
      console.log(`✓ Created owner: ${owner.email} / password: owner123`);
    }

    // Update business owner
    business.ownerId = owner.id;
    await businessRepo.save(business);

    // Create outlet
    let outlet = await outletRepo.findOne({ where: { businessId: business.id, name: cafe.outletName } });

    if (!outlet) {
      outlet = outletRepo.create({
        name: cafe.outletName,
        description: `${cafe.businessName} main location`,
        address: cafe.address,
        phoneNumber: cafe.phone,
        businessId: business.id,
        tenantId: tenant.id,
      });
      await outletRepo.save(outlet);
      console.log(`✓ Created outlet: ${outlet.name}`);
    } else {
      console.log(`• Outlet exists: ${outlet.name}`);
    }

    // Create menu
    let menu = await menuRepo.findOne({ where: { outletId: outlet.id, name: 'Main Menu' } });

    if (!menu) {
      menu = menuRepo.create({
        name: 'Main Menu',
        description: `Complete menu for ${cafe.businessName}`,
        isActive: true,
        outletId: outlet.id,
        tenantId: tenant.id,
        businessId: business.id,
      });
      await menuRepo.save(menu);
      console.log(`✓ Created menu: ${menu.name}`);
    } else {
      console.log(`• Menu exists: ${menu.name}`);
    }

    // Create categories
    const categoryMap: Record<string, MenuCategory> = {};
    for (const catData of cafe.categories) {
      let category = await categoryRepo.findOne({
        where: { menuId: menu.id, name: catData.name }
      });

      if (!category) {
        category = categoryRepo.create({
          ...catData,
          isActive: true,
          menuId: menu.id,
          tenantId: tenant.id,
        });
        await categoryRepo.save(category);
        console.log(`  ✓ Created category: ${category.name}`);
      }
      categoryMap[catData.name] = category;
    }

    // Create menu items
    for (const itemData of cafe.items) {
      const category = categoryMap[itemData.category];
      if (!category) continue;

      const existing = await itemRepo.findOne({
        where: { menuId: menu.id, name: itemData.name }
      });

      if (!existing) {
        const imageUrl = IMAGES[itemData.imageKey] || IMAGES.coffee;
        const item = itemRepo.create({
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          imageUrl: imageUrl,
          available: true,
          soldOut: false,
          hidden: false,
          isFeatured: itemData.isFeatured || false,
          isSpecialOffer: false,
          categorySortIndex: 0,
          menuCategoryId: category.id,
          menuId: menu.id,
          tenantId: tenant.id,
        });
        await itemRepo.save(item);
        totalItems++;
        process.stdout.write(`.`);
      }
    }
    console.log(`\n  ✓ Created/verified ${cafe.items.length} menu items\n`);
  }

  console.log('\n=== SEEDING COMPLETE ===');
  console.log(`Total tenants created/updated: ${totalTenants}`);
  console.log(`Total businesses created/updated: ${totalBusinesses}`);
  console.log(`Total menu items created: ${totalItems}`);
  console.log('');
  console.log('Sample login credentials:');
  console.log('  Super Admin: admin@cafeflow.com / admin123');
  for (const cafe of CAFES) {
    console.log(`  ${cafe.tenantName}: owner@${cafe.tenantSlug}.com / owner123`);
  }
  console.log('');

  await dataSource.destroy();
}

seedRealData().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
