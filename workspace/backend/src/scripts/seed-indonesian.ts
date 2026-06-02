import { DataSource } from 'typeorm';
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
import * as crypto from 'crypto';

const IMAGES = {
  nasi_goreng: 'https://images.unsplash.com/photo-1622307144036-5b0b9afb32c8?w=600&auto=format&fit=crop',
  mie_goreng: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop',
  sate_ayam: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop',
  rendang: 'https://images.unsplash.com/photo-1645696301012-1e38f5b2741f?w=600&auto=format&fit=crop',
  soto_ayam: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&auto=format&fit=crop',
  gado_gado: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop',
  bakso: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&auto=format&fit=crop',
  ayam_goreng: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop',
  ikan_bakar: 'https://images.unsplash.com/photo-1539735257881-5b7e1c8b8b1e?w=600&auto=format&fit=crop',
  capcay: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&auto=format&fit=crop',
  es_campur: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop',
  es_teler: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop',
  kopi: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop',
  es_kopi: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop',
  teh: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop',
  jus: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&auto=format&fit=crop',
  pisang_goreng: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop',
  tahu: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
  martabak: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop',
  es_krim: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop',
  lumpia: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop',
  sate_babi: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop',
  nasi_uduk: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop',
  rawon: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop',
};

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
  const businessRepo = dataSource.getRepository(Business);
  const outletRepo = dataSource.getRepository(Outlet);
  const menuRepo = dataSource.getRepository(Menu);
  const categoryRepo = dataSource.getRepository(MenuCategory);
  const itemRepo = dataSource.getRepository(MenuItem);
  const tableRepo = dataSource.getRepository(Table);
  const qrRepo = dataSource.getRepository(QrCode);

  const admin = await userRepo.findOne({ where: { email: 'admin@cafeflow.com' } });
  if (!admin) { console.log('Run seed.ts first!'); await dataSource.destroy(); return; }

  const tenantId = admin.tenantId;

  let business = await businessRepo.findOne({ where: { name: 'Warung Kopi Nusantara' } });
  if (!business) {
    business = businessRepo.create({
      name: 'Warung Kopi Nusantara',
      description: 'Kopi tradisional & masakan Nusantara asli — cita rasa Indonesia dari Sabang sampai Merauke',
      ownerId: admin.id,
      tenantId,
      currency: 'IDR',
      plan: 'PRO',
      city: 'Jakarta',
      countryCode: 'ID',
    });
    await businessRepo.save(business);
    console.log(`Created business: ${business.name} (IDR)`);
  } else {
    business.currency = 'IDR';
    await businessRepo.save(business);
    console.log(`Updated business currency to IDR`);
  }

  const businessId = business.id;

  let outlet = await outletRepo.findOne({ where: { businessId, name: 'Cafe R - Main Outlet' } });
  if (!outlet) {
    outlet = outletRepo.create({
      name: 'Cafe R - Main Outlet',
      description: 'Cafe & Resto Nusantara',
      address: 'Jl. Kemang Raya No. 12, Jakarta Selatan',
      phoneNumber: '6281234567890',
      businessId,
      tenantId,
    });
    await outletRepo.save(outlet);
    console.log(`Created outlet: ${outlet.name}`);
  }

  const outletId = outlet.id;

  let menu = await menuRepo.findOne({ where: { outletId, name: 'Menu Utama' } });
  if (!menu) {
    menu = menuRepo.create({
      name: 'Menu Utama',
      description: 'Nikmati cita rasa Nusantara autentik',
      isActive: true,
      outletId,
      tenantId,
      businessId,
    });
    await menuRepo.save(menu);
    console.log(`Created menu: ${menu.name}`);
  }

  const categories = [
    { name: 'Makanan Pembuka', description: 'Hidangan pembuka tradisional', sortIndex: 1 },
    { name: 'Makanan Utama', description: 'Hidangan utama Nusantara', sortIndex: 2 },
    { name: 'Nasi & Mie', description: 'Nasi dan mie khas Indonesia', sortIndex: 3 },
    { name: 'Sup & Soto', description: 'Sup dan soto hangat', sortIndex: 4 },
    { name: 'Camilan', description: 'Camilan ringan & gorengan', sortIndex: 5 },
    { name: 'Kopi & Teh', description: 'Kopi dan teh pilihan', sortIndex: 6 },
    { name: 'Minuman Segar', description: 'Jus & minuman segar', sortIndex: 7 },
    { name: 'Dessert', description: 'Manis-manis penutup', sortIndex: 8 },
  ];

  const menuCategories: Record<string, MenuCategory> = {};
  for (const catData of categories) {
    let cat = await categoryRepo.findOne({ where: { menuId: menu.id, name: catData.name } });
    if (!cat) {
      cat = categoryRepo.create({ ...catData, isActive: true, menuId: menu.id, tenantId });
      await categoryRepo.save(cat);
    }
    menuCategories[catData.name] = cat;
  }
  console.log(`Created/verified ${Object.keys(menuCategories).length} categories`);

  const items: { category: string; items: { name: string; description: string; price: number; imageKey: string; isFeatured?: boolean; isSpecialOffer?: boolean }[] }[] = [
    {
      category: 'Makanan Pembuka',
      items: [
        { name: 'Lumpia Semarang', description: 'Lumpia khas Semarang dengan isi rebung dan udang segar, disajikan dengan saus pedas manis', price: 28000, imageKey: 'lumpia' },
        { name: 'Tahu Gejrot', description: 'Tahu goreng potong kecil dengan kuah gula merah pedas, bawang putih, dan cabai rawit', price: 22000, imageKey: 'tahu', isFeatured: true },
        { name: 'Perkedel Jagung', description: 'Perkedel jagung manis goreng renyah dengan potongan cabai dan daun bawang', price: 20000, imageKey: 'tahu' },
        { name: 'Bakwan Udang', description: 'Bakwan udang goreng tepung renyah dengan udang utuh dan sayuran segar', price: 25000, imageKey: 'tahu' },
        { name: 'Siomay Bandung', description: 'Siomay ikan tenggiri kukus dengan saus kacang, kecap, dan sambal', price: 30000, imageKey: 'bakso', isFeatured: true },
      ],
    },
    {
      category: 'Makanan Utama',
      items: [
        { name: 'Rendang Sapi', description: 'Daging sapi dimasak lambat dengan santan dan bumbu rempah khas Padang selama 4 jam hingga empuk dan meresap', price: 55000, imageKey: 'rendang', isFeatured: true },
        { name: 'Ayam Goreng Kremes', description: 'Ayam goreng kampung dengan taburan kremes renyah, disajikan dengan sambal terasi dan lalapan', price: 38000, imageKey: 'ayam_goreng', isFeatured: true },
        { name: 'Ikan Bakar Jimbaran', description: 'Ikan kakap merah segar bakar bumbu Jimbaran dengan sambal matah khas Bali', price: 65000, imageKey: 'ikan_bakar' },
        { name: 'Sate Ayam Madura', description: 'Sate ayam bumbu kacang khas Madura dengan lontong dan acar bawang', price: 35000, imageKey: 'sate_ayam', isFeatured: true },
        { name: 'Sate Babi Kecap', description: 'Sate babi manis bumbu kecap dengan irisan nanas dan sambal', price: 40000, imageKey: 'sate_babi' },
      ],
    },
    {
      category: 'Nasi & Mie',
      items: [
        { name: 'Nasi Goreng Kambing', description: 'Nasi goreng kambing spesial dengan potongan daging kambing empuk dan telur ceplok', price: 45000, imageKey: 'nasi_goreng', isFeatured: true },
        { name: 'Nasi Goreng Bakso', description: 'Nasi goreng dengan bakso sapi, sosis, dan acar timun segar', price: 35000, imageKey: 'nasi_goreng' },
        { name: 'Mie Goreng Jawa', description: 'Mie goreng khas Jawa dengan telur, ayam suwir, sayuran, dan kerupuk', price: 32000, imageKey: 'mie_goreng', isFeatured: true },
        { name: 'Nasi Uduk Betawi', description: 'Nasi uduk khas Betawi dengan lauk lengkap: ayam goreng, bihun, telur balado, orek tempe, dan sambal', price: 40000, imageKey: 'nasi_uduk' },
        { name: 'Nasi Liwet Solo', description: 'Nasi liwet khas Solo dengan suwiran ayam, telur pindang, areh, dan sayur labu siam', price: 38000, imageKey: 'nasi_uduk' },
        { name: 'Mie Aceh', description: 'Mie tebal khas Aceh dengan daging kambing, dimasak bumbu rempah pedas', price: 40000, imageKey: 'mie_goreng' },
        { name: 'Bakmi Ayam', description: 'Bakmi ayam cincang dengan pangsit goreng, sayur sawi, dan kuah kaldu ayam', price: 30000, imageKey: 'mie_goreng' },
      ],
    },
    {
      category: 'Sup & Soto',
      items: [
        { name: 'Soto Ayam Lamongan', description: 'Soto ayam khas Lamongan dengan kuah kuning, suwiran ayam, telur rebus, dan koya', price: 35000, imageKey: 'soto_ayam', isFeatured: true },
        { name: 'Bakso Urat Sapi', description: 'Bakso sapi urat ukuran jumbo dengan kuah kaldu sapi gurih, mie, tahu, dan pangsit', price: 30000, imageKey: 'bakso', isFeatured: true },
        { name: 'Rawon Surabaya', description: 'Rawon daging sapi dengan kuah hitam khas Surabaya, dilengkapi telur asin dan kerupuk', price: 40000, imageKey: 'rawon' },
        { name: 'Soto Betawi', description: 'Soto betawi dengan daging sapi, kuah santan susu, kentang goreng, dan emping', price: 38000, imageKey: 'soto_ayam' },
        { name: 'Sop Buntut', description: 'Sop buntut sapi dengan kuah bening kaldu sayuran, kentang, wortel, dan taburan bawang goreng', price: 55000, imageKey: 'soto_ayam' },
      ],
    },
    {
      category: 'Camilan',
      items: [
        { name: 'Pisang Goreng Madu', description: 'Pisang raja goreng tepung crispy dengan siraman madu dan taburan keju', price: 18000, imageKey: 'pisang_goreng', isFeatured: true },
        { name: 'Martabak Manis', description: 'Martabak manis tebal dengan taburan keju, coklat, kacang, dan susu kental manis', price: 35000, imageKey: 'martabak', isFeatured: true },
        { name: 'Martabak Telur', description: 'Martabak telur gurih dengan daging cincang, telur, daun bawang, dan acar', price: 30000, imageKey: 'martabak' },
        { name: 'Tahu Cabe Garam', description: 'Tahu goreng crispy dengan bumbu cabe garam, potongan cabai, dan daun bawang', price: 22000, imageKey: 'tahu' },
        { name: 'Tempe Mendoan', description: 'Tempe goreng tepung khas Banyumas dengan bumbu kecap pedas', price: 15000, imageKey: 'tahu' },
        { name: 'Cireng Isi', description: 'Cireng isi ayam suwir pedas dengan bumbu oncom dan sambal', price: 18000, imageKey: 'tahu' },
      ],
    },
    {
      category: 'Kopi & Teh',
      items: [
        { name: 'Kopi Tubruk', description: 'Kopi hitam khas Indonesia diseduh tradisional — strong, bold, dan penuh cita rasa', price: 15000, imageKey: 'kopi', isFeatured: true },
        { name: 'Es Kopi Susu Nusantara', description: 'Es kopi susu kekinian dengan gula aren asli dan susu segar', price: 25000, imageKey: 'es_kopi', isFeatured: true },
        { name: 'Kopi Luwak', description: 'Kopi luwak premium pilihan — cita rasa halus dengan aroma khas', price: 75000, imageKey: 'kopi' },
        { name: 'Vietnam Drip', description: 'Kopi Vietnam slow drip dengan susu kental manis, disajikan dengan es', price: 28000, imageKey: 'kopi' },
        { name: 'Teh Tarik', description: 'Teh susu tarik khas Melayu dengan busa creamy', price: 18000, imageKey: 'teh' },
        { name: 'Teh Botol Sosro', description: 'Teh botol asli Indonesia — manis dan segar', price: 7000, imageKey: 'teh' },
        { name: 'Wedang Jahe', description: 'Wedang jahe hangat dengan serai, kayu manis, dan gula batu', price: 12000, imageKey: 'teh' },
      ],
    },
    {
      category: 'Minuman Segar',
      items: [
        { name: 'Es Campur', description: 'Es campur segar dengan campuran buah, cincau, kolang-kaling, dan susu kental manis', price: 22000, imageKey: 'es_campur', isFeatured: true },
        { name: 'Es Teler', description: 'Es teler khas dengan alpukat, kelapa muda, nangka, dan susu kental manis', price: 25000, imageKey: 'es_teler', isFeatured: true },
        { name: 'Jus Alpukat', description: 'Jus alpukat segar dengan susu coklat dan taburan keju', price: 25000, imageKey: 'jus' },
        { name: 'Jus Mangga', description: 'Jus mangga harum manis segar, tanpa gula tambahan', price: 22000, imageKey: 'jus' },
        { name: 'Jus Jambu Merah', description: 'Jus jambu biji merah segar dengan sedikit garam', price: 20000, imageKey: 'jus' },
        { name: 'Es Kelapa Muda', description: 'Es kelapa muda segar dengan daging kelapa, jeruk nipis, dan sirup gula', price: 20000, imageKey: 'es_campur' },
      ],
    },
    {
      category: 'Dessert',
      items: [
        { name: 'Es Krim Durian', description: 'Es krim durian Medan super creamy dengan potongan daging durian asli', price: 30000, imageKey: 'es_krim', isFeatured: true },
        { name: 'Pisang Ijo', description: 'Pisang ijo khas Makassar dengan bubur sumsum, sirup merah, dan es serut', price: 25000, imageKey: 'pisang_goreng' },
        { name: 'Klepon', description: 'Kue klepon ketan hijau isi gula merah dengan taburan kelapa parut', price: 15000, imageKey: 'pisang_goreng' },
        { name: 'Bubur Ketan Hitam', description: 'Bubur ketan hitam hangat dengan santan kental dan gula merah', price: 18000, imageKey: 'pisang_goreng' },
        { name: 'Dadar Gulung', description: 'Dadar gulung isi kelapa parut manis dengan gula merah', price: 12000, imageKey: 'pisang_goreng' },
      ],
    },
  ];

  let itemCount = 0;
  for (const group of items) {
    const category = menuCategories[group.category];
    if (!category) continue;
    for (const itemData of group.items) {
      const exists = await itemRepo.findOne({ where: { menuId: menu.id, name: itemData.name } });
      if (!exists) {
        const item = itemRepo.create({
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          imageUrl: IMAGES[itemData.imageKey as keyof typeof IMAGES] || '',
          available: true,
          soldOut: false,
          hidden: false,
          isFeatured: itemData.isFeatured || false,
          isSpecialOffer: itemData.isSpecialOffer || false,
          categorySortIndex: itemCount,
          menuCategoryId: category.id,
          menuId: menu.id,
          tenantId,
        });
        await itemRepo.save(item);
        itemCount++;
      }
    }
  }
  console.log(`Created/verified ${itemCount + 1} menu items`);

  const tableData = [
    { number: 'A01', name: 'Indoor 1', capacity: 2 },
    { number: 'A02', name: 'Indoor 2', capacity: 2 },
    { number: 'A03', name: 'Indoor 3', capacity: 4 },
    { number: 'A04', name: 'Indoor 4', capacity: 4 },
    { number: 'A05', name: 'VIP Room', capacity: 8 },
    { number: 'B01', name: 'Terrace 1', capacity: 2 },
    { number: 'B02', name: 'Terrace 2', capacity: 2 },
    { number: 'B03', name: 'Terrace 3', capacity: 4 },
    { number: 'B04', name: 'Garden 1', capacity: 6 },
    { number: 'B05', name: 'Garden 2', capacity: 6 },
  ];

  let tableCount = 0;
  for (const td of tableData) {
    const existing = await dataSource.query(`SELECT id FROM tables WHERE "outletId"=$1 AND "number"=$2 LIMIT 1`, [outletId, td.number]);
    let tableId: string;
    if (existing.length > 0) {
      tableId = existing[0].id;
    } else {
      const result = await dataSource.query(`INSERT INTO tables (id, number, name, "outletId", "tenantId") VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id`, [td.number, td.name, outletId, tenantId]);
      tableId = result[0].id;
    }

    const qrExisting = await dataSource.query(`SELECT id FROM qr_codes WHERE "tableId"=$1 AND "isActive"=true LIMIT 1`, [tableId]);
    if (qrExisting.length === 0) {
      const code = `cf-${tenantId.substring(0, 6)}-${tableId.substring(0, 8)}`;
      await dataSource.query(`INSERT INTO qr_codes (id, code, "tableId", "businessId", "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW())`, [code, tableId, businessId]);
    }
    tableCount++;
  }
  console.log(`Created/verified ${tableCount} tables with QR codes`);

  console.log('');
  console.log('=== SEED INDONESIAN COMPLETE ===');
  console.log(`  Business: Warung Kopi Nusantara (IDR)`);
  console.log(`  Outlet:   Cafe R - Main Outlet`);
  console.log(`  Menu:     Menu Utama (${itemCount + 1} items)`);
  console.log(`  Tables:   ${tableCount} with QR codes`);
  console.log('');

  await dataSource.destroy();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
