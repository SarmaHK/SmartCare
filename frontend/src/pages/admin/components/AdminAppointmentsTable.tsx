import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/tables/Table';
import { Badge, getAppointmentStatusBadge } from '../../../components/common/Badge';
import { EmptyState } from '../../../components/common/EmptyState';
import { type Appointment } from '../../../services/appointment.service';
import { format } from 'date-fns';
import { User, Stethoscope } from 'lucide-react';

interface AdminAppointmentsTableProps {
  appointments: Appointment[];
}

export const AdminAppointmentsTable: React.FC<AdminAppointmentsTableProps> = ({
  appointments = [],
}) => {
  if (appointments.length === 0) {
    return (
      <EmptyState
        size="sm"
        icon={<Stethoscope className="h-6 w-6" />}
        title="No appointments"
        description="Appointments will appear here as patients book consultations."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((apt) => {
          const statusBadge = getAppointmentStatusBadge(apt.status);
          return (
            <TableRow key={apt.id}>
              <TableCell>
                <div className="font-medium text-secondary-900">
                  {format(new Date(apt.slot.slotDate), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-secondary-500">
                  {apt.slot.startTime.substring(11, 16)} – {apt.slot.endTime.substring(11, 16)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary-400" />
                  <span className="font-medium text-secondary-900">
                    {apt.patient?.user?.fullName || `Patient #${apt.patientId}`}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary-600" />
                  <span className="font-medium text-secondary-900">
                    Dr. {apt.doctor?.user?.fullName}
                  </span>
                </div>
                <div className="ml-6 text-xs text-secondary-500">{apt.doctor?.specialization}</div>
              </TableCell>
              <TableCell>
                <Badge variant={statusBadge.variant} dot>
                  {statusBadge.label}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
