import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/tables/Table';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { type UserSummary } from '../../../services/admin.service';
import { format } from 'date-fns';
import { Eye, Shield, User, Power, PowerOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UsersTableProps {
  users: UserSummary[];
  onToggleStatus: (id: number, currentStatus: boolean) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users = [], onToggleStatus }) => {
  const navigate = useNavigate();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-primary-600" />;
      case 'DOCTOR': return <User className="w-4 h-4 text-primary-600" />;
      default: return <User className="w-4 h-4 text-secondary-600" />;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-secondary-500">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-secondary-50/50 transition-colors">
                <TableCell>
                  <div className="font-semibold text-secondary-900">{user.fullName}</div>
                  <div className="text-sm text-secondary-500">{user.email}</div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-secondary-700">
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(user.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {user.role !== 'ADMIN' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onToggleStatus(user.id, user.isActive)}
                        className={user.isActive ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"}
                        title={user.isActive ? "Deactivate User" : "Activate User"}
                      >
                        {user.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
