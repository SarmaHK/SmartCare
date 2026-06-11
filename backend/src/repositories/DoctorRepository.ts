import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { PaginatedResult } from '../interfaces';

export class DoctorRepository {
  async findAll(page: number, limit: number, search?: string, specialization?: string): Promise<PaginatedResult<RowDataPacket>> {
    const offset = (page - 1) * limit;
    let query = 'SELECT d.*, u.name, u.email FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.role = "DOCTOR"';
    const params: any[] = [];

    if (search) {
      query += ' AND u.name LIKE ?';
      params.push(`%${search}%`);
    }

    if (specialization) {
      query += ' AND d.specialization = ?';
      params.push(specialization);
    }

    const [countRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM (${query}) as subquery`, params);
    const total = countRows[0].total;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT d.*, u.name, u.email FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ? LIMIT 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(doctorData: any): Promise<string> {
    const id = crypto.randomUUID();
    await pool.query<ResultSetHeader>(
      'INSERT INTO doctors (id, user_id, specialization, consultation_fee, image) VALUES (?, ?, ?, ?, ?)',
      [id, doctorData.user_id, doctorData.specialization, doctorData.consultation_fee, doctorData.image || null]
    );
    return id;
  }

  async update(id: string, doctorData: any): Promise<void> {
    const fields = [];
    const params = [];
    if (doctorData.specialization !== undefined) {
      fields.push('specialization = ?');
      params.push(doctorData.specialization);
    }
    if (doctorData.consultation_fee !== undefined) {
      fields.push('consultation_fee = ?');
      params.push(doctorData.consultation_fee);
    }
    if (doctorData.image !== undefined) {
      fields.push('image = ?');
      params.push(doctorData.image);
    }

    if (fields.length === 0) return;

    params.push(id);
    await pool.query<ResultSetHeader>(
      `UPDATE doctors SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
  }

  async delete(id: string): Promise<void> {
    await pool.query<ResultSetHeader>('DELETE FROM doctors WHERE id = ?', [id]);
  }
}
