import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2/promise';

export class DashboardRepository {
  async getAdminStats(): Promise<any> {
    const [[doctors]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM doctors');
    const [[patients]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users WHERE role = "PATIENT"');
    const [[totalAppointments]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM appointments');
    const [[pendingAppointments]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM appointments WHERE status = "PENDING"');
    const [[completedAppointments]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM appointments WHERE status = "COMPLETED"');
    const [[cancelledAppointments]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM appointments WHERE status = "CANCELLED"');

    return {
      totalDoctors: doctors.count,
      totalPatients: patients.count,
      totalAppointments: totalAppointments.count,
      pendingAppointments: pendingAppointments.count,
      completedAppointments: completedAppointments.count,
      cancelledAppointments: cancelledAppointments.count,
    };
  }

  async getDoctorStats(doctorId: string): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    
    const [[todayAppointments]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND date = ?',
      [doctorId, today]
    );
    const [[upcomingAppointments]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND date > ? AND status != "CANCELLED"',
      [doctorId, today]
    );
    const [[totalPatients]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(DISTINCT patient_id) as count FROM appointments WHERE doctor_id = ?',
      [doctorId]
    );
    const [[totalAppointments]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ?',
      [doctorId]
    );

    return {
      todayAppointments: todayAppointments.count,
      upcomingAppointments: upcomingAppointments.count,
      totalPatients: totalPatients.count,
      totalAppointments: totalAppointments.count,
    };
  }

  async getPatientStats(patientId: string): Promise<any> {
    const today = new Date().toISOString().split('T')[0];

    const [[upcomingAppointments]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND date >= ? AND status != "CANCELLED"',
      [patientId, today]
    );
    const [[completedAppointments]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND status = "COMPLETED"',
      [patientId]
    );
    const [[cancelledAppointments]] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? AND status = "CANCELLED"',
      [patientId]
    );

    return {
      upcomingAppointments: upcomingAppointments.count,
      completedAppointments: completedAppointments.count,
      cancelledAppointments: cancelledAppointments.count,
    };
  }
}
