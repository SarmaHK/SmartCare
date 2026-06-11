import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { mockDoctors } from '../../../mock';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

const AdminDoctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Basic mock filter
  const filteredDoctors = mockDoctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Doctors</h2>
          <p className="text-gray-500 mt-1">Add, update, or remove doctors from the system.</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add New Doctor
        </Button>
      </div>

      <Card className="flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-200 rounded-lg text-sm py-2 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">All Specializations</option>
              <option value="cardiology">Cardiology</option>
              <option value="pediatrics">Pediatrics</option>
            </select>
            <select className="border border-gray-200 rounded-lg text-sm py-2 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="py-3 px-6 font-medium">Doctor</th>
                <th className="py-3 px-6 font-medium">Specialization</th>
                <th className="py-3 px-6 font-medium">Contact</th>
                <th className="py-3 px-6 font-medium">Status</th>
                <th className="py-3 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDoctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{doctor.name}</p>
                        <p className="text-xs text-gray-500">ID: {doctor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary">
                      {doctor.specialization}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{doctor.email || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{doctor.phone || 'N/A'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={doctor.isAvailable ? 'success' : 'default'} size="sm">
                      {doctor.isAvailable ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-50 transition-colors" title="View Schedule">
                        <CalendarIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit Doctor">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete Doctor">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-900">No doctors found</p>
                    <p className="text-sm">Try adjusting your search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <div>
            Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{Math.min(filteredDoctors.length, 10)}</span> of <span className="font-medium text-gray-900">{filteredDoctors.length}</span> results
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDoctors;
