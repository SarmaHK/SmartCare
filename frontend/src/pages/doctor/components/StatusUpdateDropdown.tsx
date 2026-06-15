import React, { useState } from 'react';
import { Select } from '../../../components/forms/Select';
import { Button } from '../../../components/common/Button';
import { appointmentService } from '../../../services/appointment.service';
import { toast } from 'react-hot-toast';

interface StatusUpdateDropdownProps {
  appointmentId: number;
  currentStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  onStatusUpdated: () => void;
}

export const StatusUpdateDropdown: React.FC<StatusUpdateDropdownProps> = ({ appointmentId, currentStatus, onStatusUpdated }) => {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const options = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    
    setIsUpdating(true);
    try {
      const response = await appointmentService.updateAppointmentStatus(appointmentId, status as any);
      if (response.success) {
        toast.success('Status updated successfully');
        onStatusUpdated();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      setStatus(currentStatus); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
      <div className="w-full sm:w-48">
        <Select
          label="Update Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          options={options}
        />
      </div>
      <Button 
        onClick={handleUpdate} 
        disabled={status === currentStatus || isUpdating}
        isLoading={isUpdating}
        className="mb-1"
      >
        Update
      </Button>
    </div>
  );
};
