import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { PaginatedResult } from '../interfaces';

export class ScheduleRepository {
  async findAll(page: number, limit: number, doctorId?: string, day?: string): Promise<PaginatedResult<RowDataPacket>> {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM schedules WHERE 1=1';
    const params: any[] = [];

    if (doctorId) {
      query += ' AND doctor_id = ?';
      params.push(doctorId);
    }

    if (day) {
      query += ' AND day = ?';
      params.push(day);
    }

    const [countRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM (${query}) as subquery`, params);
    const total = countRows[0].total;

    query += ' ORDER BY day, start_time LIMIT ? OFFSET ?';
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
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM schedules WHERE id = ? LIMIT 1', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async checkOverlap(doctorId: string, day: string, startTime: string, endTime: string, excludeId?: string): Promise<boolean> {
    let query = `
      SELECT id FROM schedules 
      WHERE doctor_id = ? AND day = ? 
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `;
    const params: any[] = [doctorId, day, startTime, startTime, endTime, endTime, startTime, endTime];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows.length > 0;
  }

  async create(scheduleData: any): Promise<string> {
    const id = crypto.randomUUID();
    await pool.query<ResultSetHeader>(
      'INSERT INTO schedules (id, doctor_id, day, start_time, end_time, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [id, scheduleData.doctor_id, scheduleData.day, scheduleData.start_time, scheduleData.end_time, true]
    );
    return id;
  }

  async update(id: string, scheduleData: any): Promise<void> {
    const fields = [];
    const params = [];
    
    if (scheduleData.day) { fields.push('day = ?'); params.push(scheduleData.day); }
    if (scheduleData.start_time) { fields.push('start_time = ?'); params.push(scheduleData.start_time); }
    if (scheduleData.end_time) { fields.push('end_time = ?'); params.push(scheduleData.end_time); }
    if (scheduleData.is_active !== undefined) { fields.push('is_active = ?'); params.push(scheduleData.is_active); }

    if (fields.length === 0) return;

    params.push(id);
    await pool.query<ResultSetHeader>(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`, params);
  }

  async delete(id: string): Promise<void> {
    await pool.query<ResultSetHeader>('DELETE FROM schedules WHERE id = ?', [id]);
  }

  // Used for slot API calculation
  async findByDoctorAndDay(doctorId: string, day: string): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM schedules WHERE doctor_id = ? AND day = ? AND is_active = true',
      [doctorId, day]
    );
    return rows;
  }
}
