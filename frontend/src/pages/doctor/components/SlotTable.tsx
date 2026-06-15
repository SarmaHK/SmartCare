import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/tables/Table';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { EmptyState } from '../../../components/common/EmptyState';
import { type Slot } from '../../../services/slot.service';
import { format } from 'date-fns';
import { Edit2, Trash2, Clock } from 'lucide-react';

interface SlotTableProps {
  slots: Slot[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const SlotTable: React.FC<SlotTableProps> = ({ slots, onEdit, onDelete }) => {
  if (slots.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="h-7 w-7" />}
        title="No slots created"
        description="Create availability slots so patients can book appointments with you."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {slots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell className="font-medium text-secondary-900">
              {format(new Date(slot.slotDate), 'MMM d, yyyy (EEE)')}
            </TableCell>
            <TableCell className="text-secondary-600">
              {slot.startTime.substring(11, 16)} – {slot.endTime.substring(11, 16)}
            </TableCell>
            <TableCell className="text-secondary-600">
              {slot.location || '-'}
            </TableCell>
            <TableCell>
              <Badge variant={slot.isAvailable ? 'success' : 'default'} dot>
                {slot.isAvailable ? 'Available' : 'Booked'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(slot.id)}
                  disabled={!slot.isAvailable}
                  aria-label="Edit slot"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(slot.id)}
                  disabled={!slot.isAvailable}
                  className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                  aria-label="Delete slot"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
