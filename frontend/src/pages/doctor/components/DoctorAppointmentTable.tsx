import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/tables/Table';
import { Badge, getAppointmentStatusBadge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { type Appointment } from '../../../services/appointment.service';
import { format } from 'date-fns';
import { Eye, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DoctorAppointmentTableProps {
  appointments: Appointment[];
}

export const DoctorAppointmentTable: React.FC<DoctorAppointmentTableProps> = ({ appointments }) => {
  const navigate = useNavigate();

  if (appointments.length === 0) {
    return (
      <EmptyState
        size="sm"
        icon={<Calendar className="h-6 w-6" />}
        title="No appointments scheduled"
        description="Appointments will appear here when patients book with you."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((apt) => {
          const statusBadge = getAppointmentStatusBadge(apt.status);
          return (
            <TableRow key={apt.id}>
              <TableCell>
                <div className="font-medium text-secondary-900">
                  {apt.patient?.user?.fullName || `Patient #${apt.patientId}`}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-secondary-900">
                  {format(new Date(apt.slot.slotDate), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-secondary-500">
                  {apt.slot.startTime.slice(0, 5)} – {apt.slot.endTime.slice(0, 5)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusBadge.variant} dot>
                  {statusBadge.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/doctor/appointments/${apt.id}`)}
                  leftIcon={<Eye className="h-4 w-4" />}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
