import mysql from 'mysql2/promise';
import { env } from './env';
import { logger } from '../utils/logger';

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT, 10),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info('✅ Successfully connected to the MySQL database.');
    connection.release();
  } catch (error) {
    logger.error('❌ Failed to connect to the MySQL database:', error);
    process.exit(1);
  }
};

export const executeTransaction = async <T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
