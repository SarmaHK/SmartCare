import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { PaginatedResult } from '../interfaces';

export class AppointmentRepository {
  async findAll(page: number, limit: number, status?: string, date?: string): Promise<PaginatedResult<RowDataPacket>> {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    const [countRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) as total FROM (${query}) as subquery`, params);
    const total = countRows[0].total;

    query += ' ORDER BY date DESC, time DESC LIMIT ? OFFSET ?';
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

  async findByPatient(patientId: string): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM appointments WHERE patient_id = ? ORDER BY date DESC, time DESC',
      [patientId]
    );
    return rows;
  }

  async findByDoctor(doctorId: string): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM appointments WHERE doctor_id = ? ORDER BY date DESC, time DESC',
      [doctorId]
    );
    return rows;
  }

  async findById(id: string): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM appointments WHERE id = ? LIMIT 1', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async findByDoctorAndDate(doctorId: string, date: string): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM appointments WHERE doctor_id = ? AND date = ? AND status != "CANCELLED"',
      [doctorId, date]
    );
    return rows;
  }

  async checkSlotAvailability(doctorId: string, date: string, time: string, connection?: PoolConnection): Promise<boolean> {
    const queryPool = connection || pool;
    // Lock the row if using a transaction (for booking)
    const query = connection 
      ? 'SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status != "CANCELLED" FOR UPDATE'
      : 'SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status != "CANCELLED"';
      
    const [rows] = await queryPool.query<RowDataPacket[]>(query, [doctorId, date, time]);
    return rows.length === 0;
  }

  async create(appointmentData: any, connection: PoolConnection): Promise<string> {
    const id = crypto.randomUUID();
    await connection.query<ResultSetHeader>(
      'INSERT INTO appointments (id, patient_id, doctor_id, schedule_id, date, time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        appointmentData.patient_id,
        appointmentData.doctor_id,
        appointmentData.schedule_id,
        appointmentData.date,
        appointmentData.time,
        'CONFIRMED',
        appointmentData.notes || null
      ]
    );
    return id;
  }

  async updateStatus(id: string, status: string, connection?: PoolConnection): Promise<void> {
    const queryPool = connection || pool;
    await queryPool.query<ResultSetHeader>('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
  }

  async reschedule(id: string, newDate: string, newTime: string, newScheduleId: string, connection: PoolConnection): Promise<void> {
    await connection.query<ResultSetHeader>(
      'UPDATE appointments SET date = ?, time = ?, schedule_id = ? WHERE id = ?',
      [newDate, newTime, newScheduleId, id]
    );
  }

  async delete(id: string): Promise<void> {
    await pool.query<ResultSetHeader>('DELETE FROM appointments WHERE id = ?', [id]);
  }
}
