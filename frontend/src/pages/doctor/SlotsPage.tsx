import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { slotService, type Slot } from '../../services/slot.service';
import { SlotTable } from './components/SlotTable';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { toast } from 'react-hot-toast';

export const SlotsPage: React.FC = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    setIsLoading(true);
    try {
      const response = await slotService.getMySlots();
      if (response.success) {
        setSlots(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch slots', error);
      toast.error('Failed to load slots');
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/doctor/slots/${id}/edit`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedSlotId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSlotId) return;

    setIsDeleting(true);
    try {
      const response = await slotService.deleteSlot(selectedSlotId);
      if (response.success) {
        toast.success('Slot deleted successfully');
        setDeleteModalOpen(false);
        fetchSlots();
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to delete slot';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Availability"
        description="Create and manage your time slots for patient appointments."
        action={
          <Button
            onClick={() => navigate('/doctor/slots/create')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Slot
          </Button>
        }
      />

      {isLoading ? <TableSkeleton rows={6} /> : (
        <SlotTable slots={slots} onEdit={handleEdit} onDelete={handleDeleteClick} />
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Slot"
        message="Are you sure you want to delete this availability slot? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isLoading={isDeleting}
        confirmText="Delete Slot"
        isDestructive
      />
    </div>
  );
};
