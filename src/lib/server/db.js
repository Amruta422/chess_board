import pg from 'pg';
import { env } from '$env/dynamic/private';

const { Pool } = pg;

if (!env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Database actions will fail until it is configured.');
}

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}

export async function transaction(callback) {
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
