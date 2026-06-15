import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/cards/Card';
import { SlotForm } from './components/SlotForm';
import { slotService } from '../../services/slot.service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export const CreateSlotPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { slotDate: string; startTime: string; endTime: string }) => {
    setIsSubmitting(true);
    try {
      const response = await slotService.createSlot(data);
      if (response.success) {
        toast.success('Slot created successfully');
        navigate('/doctor/slots');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/doctor/slots')}
          className="p-2 hover:bg-secondary-100 rounded-full transition-colors text-secondary-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader 
          title="Create New Slot" 
          description="Open up your availability for patient bookings."
        />
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <SlotForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
};
