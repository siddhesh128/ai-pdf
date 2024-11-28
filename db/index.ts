import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

let db;

try {
  const sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });

  // Test connection without throwing
  const testConnection = async () => {
    try {
      await sql`SELECT 1`;
      console.log('Database connection test successful');
    } catch (error) {
      console.warn('Database connection warning:', error);
    }
  };

  // Run test but don't await it
  testConnection();

} catch (error) {
  console.error('Failed to initialize database:', error);
  throw error;
}

export { db };