const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'cafe_flow_dev',
});

const IMAGES = {
  espresso: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&auto=format&fit=crop',
  cappuccino: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop',
  latte: 'https://images.unsplash.com/photo-1570968992193-fd9536ee74e9?w=600&auto=format&fit=crop',
  croissant: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop',
  avocado_toast: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=600&auto=format&fit=crop',
  pancakes: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
  cake: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop',
  cookie: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop',
  nasi_goreng: 'https://images.unsplash.com/photo-1622307144036-5b0b9afb32c8?w=600&auto=format&fit=crop',
  rendang: 'https://images.unsplash.com/photo-1645696301012-1e38f5b2741f?w=600&auto=format&fit=crop',
  sate: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop',
};

async function seedTenants() {
  const client = await pool.connect();
  try {
    console.log('Database connected');
    console.log('\n=== SEEDING TENANTS ===\n');

    const superAdminRes = await client.query(`SELECT id FROM users WHERE role = 'SUPER_ADMIN' LIMIT 1`);
    const superAdminId = superAdminRes.rows[0]?.id;
    
    if (!superAdminId) {
      throw new Error('Super admin not found');
    }

    const tenants = [
      {
        name: 'The Daily Grind Coffee Co.',
        slug: 'the-daily-grind',
        description: 'Artisan coffee roasters serving specialty single-origin coffee and house-made pastries since 2018.',
        currency: 'USD',
        address: '123 Main Street, Seattle, WA 98101',
        phone: '12065551234',
        items: [
          { name: 'House Blend Drip', description: 'Our signature medium roast with notes of chocolate and caramel', price: 3.50, image: 'espresso' },
          { name: 'Cold Brew', description: 'Steeped 18 hours for smooth, low-acid coffee', price: 4.00, image: 'espresso' },
          { name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and foam', price: 3.75, image: 'cappuccino' },
          { name: 'Almond Croissant', description: 'Buttery croissant with almond filling', price: 4.50, image: 'croissant' },
          { name: 'Avocado Toast', description: 'Sourdough, smashed avocado, chili flakes, sea salt', price: 8.50, image: 'avocado_toast' },
          { name: 'Buttermilk Pancakes', description: 'Three fluffy pancakes with maple syrup', price: 9.00, image: 'pancakes' },
        ]
      },
      {
        name: 'Warung Kopi Nusantara',
        slug: 'warung-kopi-nusantara',
        description: 'Authentic Indonesian coffee shop serving traditional Kopi Tubruk and Nusantara cuisine.',
        currency: 'IDR',
        address: 'Jl. Kemang Raya No. 12, Jakarta Selatan',
        phone: '6281234567890',
        items: [
          { name: 'Kopi Tubruk', description: 'Traditional Indonesian black coffee', price: 15000, image: 'espresso' },
          { name: 'Nasi Goreng Kampung', description: 'Village-style fried rice with egg and sambal', price: 45000, image: 'nasi_goreng' },
          { name: 'Rendang Sapi', description: 'Slow-cooked beef in coconut milk and spices', price: 55000, image: 'rendang' },
          { name: 'Sate Ayam', description: 'Chicken satay with peanut sauce', price: 35000, image: 'sate' },
          { name: 'Es Teler', description: 'Refreshing tropical fruit cocktail', price: 25000, image: 'coffee' },
          { name: 'Martabak Manis', description: 'Sweet thick pancake with toppings', price: 40000, image: 'pancakes' },
        ]
      },
      {
        name: 'Cafe de la Paix',
        slug: 'cafe-de-la-paix',
        description: 'Parisian-style cafe offering authentic French pastries and coffee.',
        currency: 'EUR',
        address: '15 Rue de la Paix, Paris, France',
        phone: '33142999999',
        items: [
          { name: 'Cafe au Lait', description: 'Half coffee, half steamed milk', price: 3.50, image: 'latte' },
          { name: 'Croissant au Beurre', description: 'Buttery French croissant', price: 2.50, image: 'croissant' },
          { name: 'Pain au Chocolat', description: 'Chocolate-filled pastry', price: 3.00, image: 'croissant' },
          { name: 'Tarte Tatin', description: 'Caramelized apple tart', price: 6.50, image: 'cake' },
          { name: 'Macarons', description: 'Assorted French macarons', price: 4.50, image: 'cookie' },
          { name: 'Quiche Lorraine', description: 'Savory tart with bacon and cheese', price: 8.00, image: 'sandwich' },
        ]
      }
    ];

    for (const tenantData of tenants) {
      const existingTenant = await client.query(`SELECT id FROM tenants WHERE slug = $1`, [tenantData.slug]);

      let tenantId;
      if (existingTenant.rows.length === 0) {
        const tenantRes = await client.query(
          `INSERT INTO tenants (id, name, slug, "createdAt", "updatedAt") 
           VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) 
           RETURNING id`,
          [tenantData.name, tenantData.slug]
        );
        tenantId = tenantRes.rows[0].id;
        console.log(`✓ Created tenant: ${tenantData.name}`);
      } else {
        tenantId = existingTenant.rows[0].id;
        console.log(`• Tenant exists: ${tenantData.name}`);
        continue;
      }

      const city = tenantData.address.split(',')[0];
      const countryCode = tenantData.currency === 'USD' ? 'US' : tenantData.currency === 'EUR' ? 'FR' : 'ID';

      const businessRes = await client.query(
        `INSERT INTO businesses (id, name, description, "ownerId", "tenantId", currency, plan, city, "countryCode", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'PRO', $6, $7, NOW(), NOW())
         RETURNING id`,
        [tenantData.name, tenantData.description, superAdminId, tenantId, tenantData.currency, city, countryCode]
      );
      const businessId = businessRes.rows[0].id;
      console.log(`✓ Created business`);

      const ownerEmail = `owner@${tenantData.slug}.com`;
      const passwordHash = await bcrypt.hash('owner123', 10);
      await client.query(
        `INSERT INTO users (id, name, email, "passwordHash", role, "isActive", "tenantId", "businessId", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, 'TENANT_OWNER', true, $4, $5, NOW(), NOW())`,
        [`${tenantData.name} Owner`, ownerEmail, passwordHash, tenantId, businessId]
      );
      console.log(`✓ Created owner: ${ownerEmail} / password: owner123`);

      const ownerRes = await client.query(`SELECT id FROM users WHERE email = $1`, [ownerEmail]);
      const ownerId = ownerRes.rows[0].id;
      await client.query(`UPDATE businesses SET "ownerId" = $1 WHERE id = $2`, [ownerId, businessId]);

      const outletName = `${tenantData.name} - Main Outlet`;
      const outletDesc = `${tenantData.name} main location`;
      const outletRes = await client.query(
        `INSERT INTO outlets (id, name, description, address, "phoneNumber", "businessId", "tenantId", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING id`,
        [outletName, outletDesc, tenantData.address, tenantData.phone, businessId, tenantId]
      );
      const outletId = outletRes.rows[0].id;
      console.log(`✓ Created outlet`);

      const menuDesc = `Complete menu for ${tenantData.name}`;
      const menuRes = await client.query(
        `INSERT INTO menus (id, name, description, "isActive", "outletId", "tenantId", "businessId", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), 'Main Menu', $1, true, $2, $3, $4, NOW(), NOW())
         RETURNING id`,
        [menuDesc, outletId, tenantId, businessId]
      );
      const menuId = menuRes.rows[0].id;
      console.log(`✓ Created menu`);

      const catRes = await client.query(
        `INSERT INTO menu_categories (id, name, description, "sortIndex", "isActive", "menuId", "tenantId", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), 'Featured Items', 'Most popular menu items', 1, true, $1, $2, NOW(), NOW())
         RETURNING id`,
        [menuId, tenantId]
      );
      const categoryId = catRes.rows[0].id;
      console.log(`✓ Created category`);

      for (const item of tenantData.items) {
        await client.query(
          `INSERT INTO menu_items (id, name, description, price, "imageUrl", available, "soldOut", hidden, "isFeatured", "isSpecialOffer", "categorySortIndex", "menuCategoryId", "menuId", "tenantId", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, $4, true, false, false, true, false, 0, $5, $6, $7, NOW(), NOW())`,
          [item.name, item.description, item.price, IMAGES[item.image], categoryId, menuId, tenantId]
        );
      }
      console.log(`✓ Created ${tenantData.items.length} menu items`);

      const tableNames = ['1', '2', '3', '4', '5'];
      for (const tableNum of tableNames) {
        const tableRes = await client.query(
          `INSERT INTO tables (id, number, name, "outletId", "tenantId", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
           RETURNING id`,
          [tableNum, `Table ${tableNum}`, outletId, tenantId]
        );
        const tableId = tableRes.rows[0].id;
        
        const qrCode = `cf-${tenantId.substring(0, 6)}-${tableId.substring(0, 8)}`;
        await client.query(
          `INSERT INTO qr_codes (id, code, "tableId", "businessId", "isActive", "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW())`,
          [qrCode, tableId, businessId]
        );
      }
      console.log(`✓ Created ${tableNames.length} tables with QR codes`);

      console.log('');
    }

    console.log('=== SEEDING COMPLETE ===');
    console.log('');
    console.log('Login credentials:');
    console.log('  Super Admin: admin@cafeflow.com / admin123');
    for (const tenant of tenants) {
      console.log(`  ${tenant.name}: owner@${tenant.slug}.com / owner123`);
    }
    console.log('');

    const finalTenants = await client.query(`SELECT id, name, slug FROM tenants ORDER BY name`);
    console.log(`Total tenants: ${finalTenants.rowCount}`);
    for (const t of finalTenants.rows) {
      console.log(`  - ${t.name} (${t.slug})`);
    }

  } finally {
    client.release();
    await pool.end();
  }
}

seedTenants().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
