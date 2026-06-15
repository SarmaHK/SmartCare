import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/tables/Table';
import { Badge, getAppointmentStatusBadge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { type Appointment } from '../../../services/appointment.service';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface AppointmentTableProps {
  appointments: Appointment[];
  onView?: (id: number) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, onView }) => {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-7 w-7" />}
        title="No appointments yet"
        description="Book a consultation with one of our doctors to get started."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Doctor</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((apt) => {
          const statusBadge = getAppointmentStatusBadge(apt.status);
          return (
            <TableRow key={apt.id}>
              <TableCell>
                <div className="font-medium text-secondary-900">
                  Dr. {apt.doctor?.user?.fullName}
                </div>
                <div className="text-xs text-secondary-500">{apt.doctor?.specialization}</div>
              </TableCell>
              <TableCell className="text-secondary-700">
                {format(new Date(apt.slot.slotDate), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-secondary-700">{apt.slot.startTime.slice(0, 5)}</TableCell>
              <TableCell>
                <Badge variant={statusBadge.variant} dot>
                  {statusBadge.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {onView && (
                  <Button variant="outline" size="sm" onClick={() => onView(apt.id)}>
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
