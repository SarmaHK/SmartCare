import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findUserById(id: string): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, full_name as name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createUser(user: any): Promise<string> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [user.name, user.email, user.phone, user.password, user.role]
    );
    return result.insertId.toString();
  }
}
