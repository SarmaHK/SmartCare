import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/forms/SearchBar';
import { Select } from '../../components/forms/Select';
import { Pagination } from '../../components/common/Pagination';
import { adminService, type UserSummary } from '../../services/admin.service';
import { UsersTable } from './components/UsersTable';
import { Card, CardContent } from '../../components/cards/Card';
import { TableSkeleton } from '../../components/common/Skeleton';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { toast } from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'deactivate'>('deactivate');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers({
        page: currentPage,
        limit,
        search: searchQuery || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined
      });
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(Math.ceil(response.data.total / limit) || 1);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleToggleStatusClick = (id: number, currentStatus: boolean) => {
    setSelectedUserId(id);
    setActionType(currentStatus ? 'deactivate' : 'activate');
    setModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUserId) return;
    setIsProcessing(true);
    try {
      const newState = actionType === 'activate';
      const response = await adminService.updateUserStatus(selectedUserId, newState);
      if (response.success) {
        toast.success(`User ${actionType}d successfully`);
        setModalOpen(false);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="Manage system access, roles, and view user profiles."
      />

      <Card>
        <CardContent className="grid grid-cols-1 items-end gap-4 p-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search by name, email or phone..."
              onSearch={handleSearch}
            />
          </div>
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { label: 'All Roles', value: '' },
              { label: 'Patient', value: 'PATIENT' },
              { label: 'Doctor', value: 'DOCTOR' },
              { label: 'Admin', value: 'ADMIN' },
            ]}
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : (
        <UsersTable users={users} onToggleStatus={handleToggleStatusClick} />
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

      <ConfirmationModal
        isOpen={modalOpen}
        title={actionType === 'activate' ? "Activate User" : "Deactivate User"}
        message={actionType === 'activate' 
          ? "Are you sure you want to activate this user? They will regain access to the system." 
          : "Are you sure you want to deactivate this user? They will lose access to the system immediately."}
        onConfirm={confirmToggleStatus}
        onCancel={() => setModalOpen(false)}
        isLoading={isProcessing}
        confirmText={actionType === 'activate' ? "Yes, Activate" : "Yes, Deactivate"}
        isDestructive={actionType === 'deactivate'}
      />
    </div>
  );
};
