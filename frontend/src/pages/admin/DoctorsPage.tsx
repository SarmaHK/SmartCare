import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/forms/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { adminService, type DoctorSummary } from '../../services/admin.service';
import { DoctorsTable } from './components/DoctorsTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, searchQuery]);

  async function fetchDoctors() {
    setIsLoading(true);
    try {
      const response = await adminService.getDoctors({
        page: currentPage,
        limit,
        search: searchQuery || undefined
      });
      if (response.success) {
        setDoctors(response.data.doctors);
        setTotalPages(Math.ceil(response.data.total / limit) || 1);
      }
    } catch (error) {
      console.error('Failed to fetch doctors', error);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Doctor Management" 
        description="Monitor medical staff performance and appointment statistics."
      />

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-soft border border-secondary-200">
        <div className="w-full md:w-1/2">
          <SearchBar 
            placeholder="Search by doctor name or specialization..." 
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : (
        <DoctorsTable doctors={doctors} />
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
