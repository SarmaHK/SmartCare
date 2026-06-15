import React from 'react';
import { Card, CardContent } from '../../../components/cards/Card';
import { Badge, getAppointmentStatusBadge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { type Appointment } from '../../../services/appointment.service';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: number) => void;
  onReschedule?: (id: number) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
}) => {
  const statusBadge = getAppointmentStatusBadge(appointment.status);
  const isUpcoming = ['CONFIRMED', 'PENDING'].includes(appointment.status);

  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
              {appointment.doctor?.user?.fullName?.charAt(0) || 'D'}
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900">
                Dr. {appointment.doctor?.user?.fullName}
              </h4>
              <p className="text-sm text-secondary-500">{appointment.doctor?.specialization}</p>
            </div>
          </div>
          <Badge variant={statusBadge.variant} dot>
            {statusBadge.label}
          </Badge>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-secondary-100 bg-secondary-50 p-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-secondary-700">
            <Calendar className="h-4 w-4 shrink-0 text-primary-600" />
            <span className="font-medium">
              {format(new Date(appointment.slot.slotDate), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-700">
            <Clock className="h-4 w-4 shrink-0 text-primary-600" />
            <span className="font-medium">
              {appointment.slot.startTime.slice(0, 5)} – {appointment.slot.endTime.slice(0, 5)}
            </span>
          </div>
        </div>

        {isUpcoming && (onReschedule || onCancel) && (
          <div className="flex gap-3 border-t border-secondary-100 pt-4">
            {onReschedule && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onReschedule(appointment.id)}
              >
                Reschedule
              </Button>
            )}
            {onCancel && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                onClick={() => onCancel(appointment.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
