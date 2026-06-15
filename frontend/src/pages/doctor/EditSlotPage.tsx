import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/cards/Card';
import { SlotForm } from './components/SlotForm';
import { slotService, type Slot } from '../../services/slot.service';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const EditSlotPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slot, setSlot] = useState<Slot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchSlot(id);
  }, [id]);

  async function fetchSlot(slotId: string) {
    try {
      const response = await slotService.getSlotById(slotId);
      if (response.success) {
        if (!response.data.isAvailable) {
          toast.error('Cannot edit a booked slot');
          navigate('/doctor/slots');
          return;
        }
        setSlot(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch slot details');
      navigate('/doctor/slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: { slotDate: string; startTime: string; endTime: string }) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const response = await slotService.updateSlot(id, data);
      if (response.success) {
        toast.success('Slot updated successfully');
        navigate('/doctor/slots');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update slot');
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
          title="Edit Slot" 
          description="Update your availability slot."
        />
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="py-12 flex justify-center"><LoadingSpinner /></div>
          ) : slot ? (
            <SlotForm initialData={slot} onSubmit={handleSubmit} isLoading={isSubmitting} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
