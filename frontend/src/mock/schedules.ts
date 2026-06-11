import type { Schedule } from '../types';

export const mockSchedules: Schedule[] = [
  { id: 'sch-001', doctorId: 'doc-001', doctorName: 'Dr. Sarah Mitchell', day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-002', doctorId: 'doc-001', doctorName: 'Dr. Sarah Mitchell', day: 'Wednesday', startTime: '09:00 AM', endTime: '05:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-003', doctorId: 'doc-001', doctorName: 'Dr. Sarah Mitchell', day: 'Friday', startTime: '09:00 AM', endTime: '03:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-004', doctorId: 'doc-002', doctorName: 'Dr. James Anderson', day: 'Tuesday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-005', doctorId: 'doc-002', doctorName: 'Dr. James Anderson', day: 'Thursday', startTime: '10:00 AM', endTime: '05:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-006', doctorId: 'doc-003', doctorName: 'Dr. Emily Chen', day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-007', doctorId: 'doc-003', doctorName: 'Dr. Emily Chen', day: 'Wednesday', startTime: '09:00 AM', endTime: '12:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-008', doctorId: 'doc-003', doctorName: 'Dr. Emily Chen', day: 'Friday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-009', doctorId: 'doc-004', doctorName: 'Dr. Michael Roberts', day: 'Tuesday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-010', doctorId: 'doc-004', doctorName: 'Dr. Michael Roberts', day: 'Thursday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-011', doctorId: 'doc-004', doctorName: 'Dr. Michael Roberts', day: 'Saturday', startTime: '09:00 AM', endTime: '12:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-012', doctorId: 'doc-005', doctorName: 'Dr. Priya Sharma', day: 'Monday', startTime: '10:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-013', doctorId: 'doc-005', doctorName: 'Dr. Priya Sharma', day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-014', doctorId: 'doc-005', doctorName: 'Dr. Priya Sharma', day: 'Friday', startTime: '09:00 AM', endTime: '11:00 AM', slotDuration: 30, isActive: false },
  { id: 'sch-015', doctorId: 'doc-006', doctorName: 'Dr. William Thompson', day: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-016', doctorId: 'doc-006', doctorName: 'Dr. William Thompson', day: 'Tuesday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-017', doctorId: 'doc-006', doctorName: 'Dr. William Thompson', day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-018', doctorId: 'doc-006', doctorName: 'Dr. William Thompson', day: 'Thursday', startTime: '09:00 AM', endTime: '04:00 PM', slotDuration: 30, isActive: true },
  { id: 'sch-019', doctorId: 'doc-006', doctorName: 'Dr. William Thompson', day: 'Friday', startTime: '09:00 AM', endTime: '12:00 PM', slotDuration: 30, isActive: true },
];
