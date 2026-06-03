#!/usr/bin/env node
// Direct SQL cleanup script - no TypeORM entities needed

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'cafe_flow_dev',
});

async function cleanup() {
  const client = await pool.connect();
  try {
    console.log('Database connected');
    console.log('\n=== CLEANING UP GENERIC DATA ===\n');

    // First get the tenant IDs as strings
    const tenantsToDelete = await client.query(`
      SELECT id::text as id FROM tenants WHERE name IN ('My Cafe', 'Test Cafe', 'Test Business')
    `);
    const tenantIds = tenantsToDelete.rows.map(r => r.id);
    
    if (tenantIds.length === 0) {
      console.log('No generic tenants found');
    } else {
      console.log(`Found ${tenantIds.length} generic tenants to delete`);

      // Build the IN clause
      const tenantIdList = tenantIds.map(id => `'${id}'`).join(',');

      // Delete in correct order (child tables first)

      // Delete menu items for generic tenants
      await client.query(`
        DELETE FROM menu_items 
        WHERE "tenantId" IN (${tenantIdList})
      `);
      console.log('✓ Deleted menu items for generic tenants');

      // Delete menu categories for generic tenants
      await client.query(`
        DELETE FROM menu_categories 
        WHERE "tenantId" IN (${tenantIdList})
      `);
      console.log('✓ Deleted menu categories for generic tenants');

      // Delete menus for generic tenants
      await client.query(`
        DELETE FROM menus 
        WHERE "tenantId" IN (${tenantIdList})
      `);
      console.log('✓ Deleted menus for generic tenants');

      // Delete tables for generic tenants
      await client.query(`
        DELETE FROM tables 
        WHERE "tenantId" IN (${tenantIdList})
      `);
      console.log('✓ Deleted tables for generic tenants');

      // Delete users for generic tenants
      const deletedUsers = await client.query(`
        DELETE FROM users 
        WHERE "tenantId" IN (${tenantIdList})
        RETURNING email
      `);
      console.log(`✓ Deleted ${deletedUsers.rowCount} users for generic tenants`);

      // Delete outlets for generic tenants
      await client.query(`
        DELETE FROM outlets 
        WHERE "tenantId" IN (${tenantIdList})
      `);
      console.log('✓ Deleted outlets for generic tenants');

      // Now delete businesses that reference these tenants
      const deletedBusinesses = await client.query(`
        DELETE FROM businesses 
        WHERE "tenantId" IN (${tenantIdList})
        RETURNING id, name
      `);
      console.log(`✓ Deleted ${deletedBusinesses.rowCount} businesses`);

      // Now delete QR codes for these businesses
      const businessIds = deletedBusinesses.rows.map(r => r.id);
      if (businessIds.length > 0) {
        const businessIdList = businessIds.map(id => `'${id}'`).join(',');
        await client.query(`
          DELETE FROM qr_codes 
          WHERE "businessId" IN (${businessIdList})
        `);
        console.log('✓ Deleted QR codes for generic businesses');
      }

      // Finally delete tenants
      const deletedTenants = await client.query(`
        DELETE FROM tenants 
        WHERE id IN (${tenantIdList})
        RETURNING id, name
      `);
      console.log(`✓ Deleted ${deletedTenants.rowCount} generic tenants`);
    }

    // Also clean up any remaining generic businesses by name
    const businessesToDelete = await client.query(`
      SELECT id::text as id FROM businesses WHERE name IN ('My Cafe', 'Test Cafe', 'Test Business')
    `);
    const remainingBusinessIds = businessesToDelete.rows.map(r => r.id);
    
    if (remainingBusinessIds.length > 0) {
      const businessIdList = remainingBusinessIds.map(id => `'${id}'`).join(',');
      
      await client.query(`
        DELETE FROM qr_codes 
        WHERE "businessId" IN (${businessIdList})
      `);
      console.log('✓ Deleted additional QR codes');

      const deletedBusinesses = await client.query(`
        DELETE FROM businesses 
        WHERE id IN (${businessIdList})
        RETURNING id, name
      `);
      console.log(`✓ Deleted ${deletedBusinesses.rowCount} additional generic businesses`);
    }

    console.log('\n=== CLEANUP COMPLETE ===\n');

    // Show remaining tenants
    const remainingTenants = await client.query(
      `SELECT id, name, slug FROM tenants ORDER BY name`
    );
    console.log(`Remaining tenants (${remainingTenants.rowCount}):`);
    for (const tenant of remainingTenants.rows) {
      console.log(`  - ${tenant.name} (${tenant.slug})`);
    }

    // Show remaining businesses
    const remainingBusinesses = await client.query(
      `SELECT id, name FROM businesses ORDER BY name`
    );
    console.log(`\nRemaining businesses (${remainingBusinesses.rowCount}):`);
    for (const business of remainingBusinesses.rows) {
      console.log(`  - ${business.name}`);
    }

  } finally {
    client.release();
    await pool.end();
  }
}

cleanup().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
