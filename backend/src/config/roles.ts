import { Role } from '@prisma/client';

export const Roles = {
  ADMIN: 'ADMIN' as Role,
  DOCTOR: 'DOCTOR' as Role,
  PATIENT: 'PATIENT' as Role,
};

export const Permissions = {
  MANAGE_USERS: [Roles.ADMIN],
  MANAGE_DOCTORS: [Roles.ADMIN],
  ACCESS_DASHBOARD: [Roles.ADMIN],
  VIEW_ALL_USERS: [Roles.ADMIN],
  
  MANAGE_SLOTS: [Roles.DOCTOR, Roles.ADMIN],
  UPDATE_APPT_STATUS: [Roles.DOCTOR, Roles.ADMIN],
  
  BOOK_APPOINTMENT: [Roles.PATIENT],
  RESCHEDULE_APPOINTMENT: [Roles.PATIENT],
  
  CANCEL_APPOINTMENT: [Roles.PATIENT, Roles.DOCTOR],
  VIEW_OWN_PROFILE: [Roles.PATIENT, Roles.DOCTOR],
  VIEW_OWN_APPOINTMENTS: [Roles.PATIENT, Roles.DOCTOR],
};
