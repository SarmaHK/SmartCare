import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/forms/SearchBar';
import { Select } from '../../components/forms/Select';
import { Pagination } from '../../components/common/Pagination';
import { appointmentService, type Appointment } from '../../services/appointment.service';
import { DoctorAppointmentTable } from './components/DoctorAppointmentTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, searchQuery, statusFilter]);

  async function fetchAppointments() {
    setIsLoading(true);
    try {
      const response = await appointmentService.getDoctorAppointments({
        page: currentPage,
        limit,
        patientName: searchQuery || undefined,
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Patient Appointments" 
        description="View and manage all your scheduled patient appointments."
      />

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-soft border border-secondary-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2">
          <SearchBar 
            placeholder="Search by patient name..." 
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
        <div>
          <Select
            label=""
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={statusOptions}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : (
        <DoctorAppointmentTable appointments={appointments} />
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
