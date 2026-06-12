import React, { useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { useDoctorStore } from '../../../store/doctorStore';
import Button from '../../../components/common/Button';

const AdminDoctors: React.FC = () => {
  const { doctors, fetchDoctors, isLoading, search, setSearchQuery, specialization, setSpecializationFilter, page, totalPages, setPage } = useDoctorStore();

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Manage Doctors</h2>
          <p className="text-[13px] text-slate-500 mt-0.5">Add, update, or remove doctors from the system</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Add Doctor</Button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-[4px] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-[13px] bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>
          <select
            className="h-8 text-[13px] border border-slate-300 rounded-[3px] px-3 bg-white focus:outline-none focus:border-blue-500"
            value={specialization}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="all">All Specializations</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading doctors...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">Doctor</th>
                  <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">Specialization</th>
                  <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase">Details</th>
                  <th className="px-4 py-2 text-[11px] font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc: any) => (
                  <tr key={doc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-800">{doc.user_id}</p>
                          <p className="text-[11px] text-slate-400">ID: {doc.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[12px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-[3px]">
                        {doc.specialization}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-[12px] text-slate-600">{doc.experience_years} yrs exp · ${doc.consultation_fee}</p>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-[3px] transition-colors" title="Schedule">
                          <CalendarIcon className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-[3px] transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[3px] transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {doctors.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-xs text-slate-400">No doctors found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[12px] text-slate-500">
          <span>Page <span className="font-medium text-slate-800">{page}</span> of <span className="font-medium text-slate-800">{totalPages}</span></span>
          <div className="flex gap-1">
            <button className="h-7 px-3 border border-slate-300 rounded-[3px] bg-white hover:bg-slate-50 disabled:opacity-50 text-[12px]" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <button className="h-7 px-3 border border-slate-300 rounded-[3px] bg-white hover:bg-slate-50 disabled:opacity-50 text-[12px]" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
