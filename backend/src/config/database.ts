import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use connection pooler for serverless/transaction queries
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
  max: 10, // Lower limit for Supabase free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('--------  Connected to Supabase PostgreSQL  --------');
});

pool.on('error', (err) => {
  console.error('-------- Supabase connection error:', err);
});

// Transaction helper
export async function withTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function query<T = any>(text: string, params?: any[]) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (duration > 100) {
    console.warn('Slow query:', { text: text.substring(0, 100), duration });
  }

  return result;
}

export default pool;