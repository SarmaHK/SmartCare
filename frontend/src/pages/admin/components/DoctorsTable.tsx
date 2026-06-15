import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/tables/Table';
import { Button } from '../../../components/common/Button';
import { type DoctorSummary } from '../../../services/admin.service';
import { Eye, Stethoscope, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DoctorsTableProps {
  doctors: DoctorSummary[];
}

export const DoctorsTable: React.FC<DoctorsTableProps> = ({ doctors }) => {
  const navigate = useNavigate();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Appointments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-secondary-500">
                No doctors found.
              </TableCell>
            </TableRow>
          ) : (
            doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <div className="font-bold text-secondary-900">Dr. {doctor.user.fullName}</div>
                  <div className="text-sm text-secondary-500">{doctor.user.email}</div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Stethoscope className="w-4 h-4 text-primary-600" />
                    {doctor.specialization}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-secondary-400" />
                    {doctor.experienceYears} Years
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-secondary-700">
                    <Users className="w-4 h-4 text-emerald-600" />
                    {doctor.appointmentCount} Total
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                    leftIcon={<Eye className="w-4 h-4" />}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
