
import pool from './database';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Hash password once (reused for all test users)
    const passwordHash = await bcrypt.hash('SecurePass123', 12);

    // Insert test users with UUIDs
    const usersResult = await client.query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES 
         ('soniya@example.com', $1, 'Soniya Buyer', 'buyer'),
         ('thapa@example.com', $1, 'Thapa Agent', 'agent')
            ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [passwordHash]
    );

    const buyerId = usersResult.rows[0].id;
    const agentId = usersResult.rows[1].id;

    console.log('Created users:', usersResult.rows.map((u: any) => u.email));

    // Insert sample properties
    const propertiesResult = await client.query(
      `INSERT INTO properties (title, description, price, location, city, state, property_type, image_url, is_available)
       VALUES 
         ('Modern Downtown Apartment', 'Luxury 2-bedroom apartment with city views', 450000.00, '123 Main St', 'New York', 'NY', 'apartment', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400', true),
         ('Suburban Family Home', 'Spacious 4-bedroom house with garden', 650000.00, '456 Oak Ave', 'Austin', 'TX', 'house', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', true),
         ('Cozy Studio Loft', 'Perfect starter home in trendy neighborhood', 280000.00, '789 Arts Ln', 'Portland', 'OR', 'apartment', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', true),
         ('Waterfront Villa', 'Stunning 5-bedroom villa with private dock', 1200000.00, '321 Marina Bay', 'Miami', 'FL', 'villa', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400', true),
         ('Penthouse Suite', 'Exclusive penthouse with rooftop terrace', 850000.00, '555 Finance St', 'Chicago', 'IL', 'condo', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', true)
       RETURNING id, title`
    );

    console.log('Created properties:', propertiesResult.rows.map((p: any) => p.title));

    // Get property IDs for favourites
    const propertyIds = propertiesResult.rows.map((p: any) => p.id);

    // Insert sample favourites for buyer
    await client.query(
      `INSERT INTO favourites (user_id, property_id) VALUES ($1, $2), ($1, $3)`,
      [buyerId, propertyIds[0], propertyIds[2]]
    );

    console.log('Created sample favourites');

    await client.query('COMMIT');
    console.log('Database seeded successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if executed directly
if (require.main === module) {
  seed().catch(console.error);
}

export default seed;