import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_PORT) {
   throw new Error('Database configuration is missing in environment variables');
}

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: parseInt(process.env.DB_PORT, 10),
   max: 20,
   idleTimeoutMillis: 30000,
   connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
   console.log('New client connected to the database');
});

pool.on('error', (err) => {
   console.error('Unexpected error on idle database client:', err.message);
});

export default pool;