import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Select } from '../../components/forms/Select';
import { Pagination } from '../../components/common/Pagination';
import { adminService } from '../../services/admin.service';
import { type Appointment } from '../../services/appointment.service';
import { AdminAppointmentsTable } from './components/AdminAppointmentsTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, statusFilter]);

  async function fetchAppointments() {
    setIsLoading(true);
    try {
      const response = await adminService.getAppointments({
        page: currentPage,
        limit,
        status: statusFilter || undefined
      });
      if (response.success) {
        setAppointments(response.data.appointments);
        setTotalPages(Math.ceil(response.data.total / limit) || 1);
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Global Appointments" 
        description="Monitor all patient appointments across the entire system."
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-soft border border-secondary-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div>
          <Select
            label=""
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Confirmed', value: 'CONFIRMED' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Cancelled', value: 'CANCELLED' }
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : (
        <AdminAppointmentsTable appointments={appointments} />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="rounded-xl shadow-soft"
        />
      )}
    </div>
  );
};
