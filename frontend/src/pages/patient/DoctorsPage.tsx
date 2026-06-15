import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/forms/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import { Card, CardContent } from '../../components/cards/Card';
import { doctorService, type DoctorProfile } from '../../services/doctor.service';
import { DoctorCard } from './components/DoctorCard';
import { Stethoscope } from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, searchQuery]);

  async function fetchDoctors() {
    setIsLoading(true);
    try {
      const response = await doctorService.getAllDoctors({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
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
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find a Doctor"
        description="Search for specialists and book your medical consultation online."
      />

      <Card>
        <CardContent className="p-4">
          <SearchBar
            placeholder="Search by name or specialization..."
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <TableSkeleton key={i} rows={1} />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="h-7 w-7" />}
          title="No doctors found"
          description="Try adjusting your search criteria or check back later for new specialists."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
