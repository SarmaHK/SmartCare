import React from 'react';
import { Calendar, Clock, X, RefreshCw } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { getInitials } from '../../utils/formatters';

interface AppointmentCardProps {
  appointment: any;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  showActions?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment, onCancel, onReschedule, showActions = true,
}) => {
  const doctorName = appointment.doctor_name || appointment.doctor_id || 'Doctor';

  return (
    <div className="bg-white border border-slate-200 rounded-[4px] p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-white">{getInitials(doctorName)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-[13px] font-semibold text-slate-800">Dr. {doctorName}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Consultation</p>
            </div>
            <Badge status={appointment.status} size="sm" />
          </div>

          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-[12px] text-slate-500">
              <Calendar className="w-3 h-3" /> {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-slate-500">
              <Clock className="w-3 h-3" /> {appointment.start_time}
            </span>
          </div>

          {showActions && (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              {onReschedule && (
                <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3 h-3" />}
                  onClick={() => onReschedule(appointment.id)}>Reschedule</Button>
              )}
              {onCancel && (
                <Button variant="danger" size="sm" leftIcon={<X className="w-3 h-3" />}
                  onClick={() => onCancel(appointment.id)}>Cancel</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
