import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/cards/Card';
import { adminService, type DoctorSummary } from '../../services/admin.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ArrowLeft, Stethoscope, Award, Banknote, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorSummary & { slots: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDoctorDetails(id);
  }, [id]);

  async function fetchDoctorDetails(doctorId: string) {
    try {
      const response = await adminService.getDoctorSummary(doctorId);
      if (response.success) {
        setDoctor(response.data);
      }
    } catch (error) {
      toast.error('Failed to load doctor details');
      navigate('/admin/doctors');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!doctor) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/admin/doctors')}
          className="p-2 hover:bg-secondary-100 rounded-full transition-colors text-secondary-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader 
          title="Doctor Performance Summary" 
          description="Review professional details and appointment statistics."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold mb-4">
                {doctor.user.fullName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-secondary-900">Dr. {doctor.user.fullName}</h2>
              <p className="text-sm text-secondary-500 mb-4">{doctor.user.email}</p>
              
              <div className="pt-4 border-t border-secondary-200 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-secondary-700">
                  <Stethoscope className="w-5 h-5 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs text-secondary-500">Specialization</p>
                    <p className="font-medium">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-700">
                  <Award className="w-5 h-5 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs text-secondary-500">Experience</p>
                    <p className="font-medium">{doctor.experienceYears} Years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-700">
                  <Banknote className="w-5 h-5 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-xs text-secondary-500">Consultation Fee</p>
                    <p className="font-medium">Rs.{doctor.consultationFee}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Slots */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-secondary-900">Appointment Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-900">{doctor.appointmentCount}</p>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mt-1">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-emerald-900">{doctor.completedCount}</p>
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mt-1">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 text-center">
                <XCircle className="w-6 h-6 mx-auto text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-900">{doctor.cancelledCount}</p>
                <p className="text-xs font-medium text-red-600 uppercase tracking-wider mt-1">Cancelled</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                <p className="text-2xl font-bold text-amber-900">
                  {doctor.appointmentCount - doctor.completedCount - doctor.cancelledCount}
                </p>
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mt-1">Pending</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Professional Biography</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-secondary-700 whitespace-pre-wrap">
                {doctor.bio || 'No professional biography provided.'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Slot Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-secondary-500 mb-1">Total Created Slots</p>
                  <p className="text-3xl font-bold text-secondary-900">{doctor.slots.length}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500 mb-1">Available Slots</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {doctor.slots.filter(s => s.isAvailable).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
