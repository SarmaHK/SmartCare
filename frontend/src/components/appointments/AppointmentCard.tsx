import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, X, RefreshCw } from 'lucide-react';
import type { Appointment } from '../../types';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { staggerItem } from '../../hooks/useAnimations';
import { formatDate } from '../../utils/formatters';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  showActions?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
  showActions = true,
}) => {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-surface rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 p-5"
    >
      <div className="flex items-start gap-4">
        {/* Doctor Image */}
        <img
          src={appointment.doctorImage}
          alt={appointment.doctorName}
          className="w-12 h-12 rounded-xl object-cover border border-border flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-text-primary text-sm">{appointment.doctorName}</h4>
              <p className="text-primary text-xs font-medium">{appointment.doctorSpecialization}</p>
            </div>
            <Badge status={appointment.status} dot size="sm" />
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-text-secondary text-xs">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary text-xs">
              <Clock className="w-3.5 h-3.5 text-text-muted" />
              <span>{appointment.time}</span>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <p className="text-text-muted text-xs mt-2 line-clamp-2">{appointment.notes}</p>
          )}

          {/* Actions */}
          {showActions && appointment.status === 'upcoming' && (
            <div className="flex gap-2 mt-3">
              {onReschedule && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={() => onReschedule(appointment.id)}
                >
                  Reschedule
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<X className="w-3.5 h-3.5" />}
                  onClick={() => onCancel(appointment.id)}
                  className="text-danger hover:bg-red-50 hover:text-danger"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
