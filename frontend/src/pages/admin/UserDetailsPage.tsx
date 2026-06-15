import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/cards/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { adminService, type UserSummary } from '../../services/admin.service';
import { type DoctorProfile } from '../../services/doctor.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { ArrowLeft, Mail, Phone, Calendar, Shield, Activity, Droplet, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

type ExtendedUser = UserSummary & { doctorProfile?: DoctorProfile, patientProfile?: any };

export const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit State for Doctor Profile
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [doctorFormData, setDoctorFormData] = useState({
    specialization: '',
    experienceYears: 0,
    consultationFee: 0,
    qualification: '',
    bio: ''
  });

  useEffect(() => {
    if (id) fetchUserDetails(id);
  }, [id]);

  async function fetchUserDetails(userId: string) {
    try {
      const response = await adminService.getUserById(userId);
      if (response.success) {
        setUser(response.data);
        if (response.data.doctorProfile) {
          setDoctorFormData({
            specialization: response.data.doctorProfile.specialization || '',
            experienceYears: response.data.doctorProfile.experienceYears || 0,
            consultationFee: Number(response.data.doctorProfile.consultationFee) || 0,
            qualification: response.data.doctorProfile.qualification || '',
            bio: response.data.doctorProfile.bio || ''
          });
        }
      }
    } catch (error) {
      toast.error('Failed to load user details');
      navigate('/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDoctorProfile = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const response = await adminService.updateDoctor(user.id, {
        specialization: doctorFormData.specialization,
        experienceYears: Number(doctorFormData.experienceYears),
        consultationFee: Number(doctorFormData.consultationFee),
        qualification: doctorFormData.qualification,
        bio: doctorFormData.bio
      });
      if (response.success) {
        toast.success('Doctor profile updated successfully');
        setIsEditingDoctor(false);
        fetchUserDetails(id!);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update doctor profile');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmToggleStatus = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const newState = !user.isActive;
      const response = await adminService.updateUserStatus(user.id, newState);
      if (response.success) {
        toast.success(`User ${newState ? 'activated' : 'deactivated'} successfully`);
        setModalOpen(false);
        fetchUserDetails(id!); // Refresh data
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/users')}
            className="p-2 hover:bg-secondary-100 rounded-full transition-colors text-secondary-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <PageHeader 
            title="User Profile" 
            description="Detailed view of user account and associated profiles."
          />
        </div>
        {user.role !== 'ADMIN' && (
          <Button 
            variant="outline"
            onClick={() => setModalOpen(true)}
            className={user.isActive ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"}
          >
            {user.isActive ? 'Deactivate User' : 'Activate User'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 mx-auto bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 text-3xl font-bold mb-4">
                {user.fullName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-secondary-900">{user.fullName}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant={user.isActive ? 'success' : 'danger'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="default" className="bg-primary-50 text-primary-700">
                  {user.role}
                </Badge>
              </div>
              
              <div className="mt-6 space-y-4 text-left">
                <div className="flex items-center gap-3 text-sm text-secondary-700">
                  <Mail className="w-4 h-4 text-secondary-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-700">
                  <Phone className="w-4 h-4 text-secondary-400 shrink-0" />
                  <span>{user.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-700">
                  <Calendar className="w-4 h-4 text-secondary-400 shrink-0" />
                  <span>Joined {format(new Date(user.createdAt), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Profile Based on Role */}
        <div className="lg:col-span-2 space-y-6">
          {user.role === 'PATIENT' && user.patientProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-600" />
                  Patient Profile Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-secondary-500 text-sm mb-1">Blood Group</p>
                    <p className="font-semibold text-secondary-900 flex items-center gap-1">
                      <Droplet className="w-4 h-4 text-red-500" />
                      {user.patientProfile.bloodGroup || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary-500 text-sm mb-1">Gender</p>
                    <p className="font-semibold text-secondary-900">{user.patientProfile.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-secondary-500 text-sm mb-1">Date of Birth</p>
                    <p className="font-semibold text-secondary-900">
                      {user.patientProfile.dateOfBirth ? format(new Date(user.patientProfile.dateOfBirth), 'MMMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-secondary-500 text-sm mb-1">Address</p>
                  <p className="text-secondary-900">{user.patientProfile.address || 'N/A'}</p>
                </div>
                <div className="mt-6">
                  <p className="text-secondary-500 text-sm mb-2">Medical History</p>
                  <div className="p-4 bg-secondary-50 rounded-lg text-sm text-secondary-700 whitespace-pre-wrap">
                    {user.patientProfile.medicalHistory || 'No medical history on file.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'DOCTOR' && user.doctorProfile && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary-600" />
                  Doctor Profile Data
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingDoctor(!isEditingDoctor)}
                  disabled={isProcessing}
                >
                  {isEditingDoctor ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {isEditingDoctor ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Specialization</label>
                        <input type="text" className="w-full rounded-lg border border-secondary-200 px-3 py-2" value={doctorFormData.specialization} onChange={(e) => setDoctorFormData({...doctorFormData, specialization: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Experience (Years)</label>
                        <input type="number" className="w-full rounded-lg border border-secondary-200 px-3 py-2" value={doctorFormData.experienceYears} onChange={(e) => setDoctorFormData({...doctorFormData, experienceYears: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1 whitespace-nowrap">Consultation Fee (Rs.)</label>
                        <input type="number" className="w-full rounded-lg border border-secondary-200 px-3 py-2" value={doctorFormData.consultationFee} onChange={(e) => setDoctorFormData({...doctorFormData, consultationFee: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">Qualifications</label>
                        <input type="text" className="w-full rounded-lg border border-secondary-200 px-3 py-2" value={doctorFormData.qualification} onChange={(e) => setDoctorFormData({...doctorFormData, qualification: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">Professional Bio</label>
                      <textarea rows={4} className="w-full rounded-lg border border-secondary-200 px-3 py-2" value={doctorFormData.bio} onChange={(e) => setDoctorFormData({...doctorFormData, bio: e.target.value})} />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveDoctorProfile} isLoading={isProcessing}>Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-secondary-500 text-sm mb-1">Specialization</p>
                        <p className="font-semibold text-secondary-900">{user.doctorProfile.specialization}</p>
                      </div>
                      <div>
                        <p className="text-secondary-500 text-sm mb-1">Experience</p>
                        <p className="font-semibold text-secondary-900">{user.doctorProfile.experienceYears} Years</p>
                      </div>
                      <div>
                        <p className="text-secondary-500 text-sm mb-1">Consultation Fee</p>
                        <p className="font-semibold text-secondary-900">Rs.{user.doctorProfile.consultationFee}</p>
                      </div>
                      <div>
                        <p className="text-secondary-500 text-sm mb-1">Qualifications</p>
                        <p className="font-semibold text-secondary-900">{user.doctorProfile.qualification}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-secondary-500 text-sm mb-2">Professional Bio</p>
                      <div className="p-4 bg-secondary-50 rounded-lg text-sm text-secondary-700 whitespace-pre-wrap">
                        {user.doctorProfile.bio || 'No bio provided.'}
                      </div>
                    </div>
                  </>
                )}
                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <Button onClick={() => navigate(`/admin/doctors/${user.doctorProfile!.id}`)}>
                    View Full Doctor Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'ADMIN' && (
            <Card>
              <CardContent className="p-12 text-center text-secondary-500">
                <Shield className="w-12 h-12 mx-auto text-primary-200 mb-4" />
                <p>System Administrator Account</p>
                <p className="text-sm">Has full access to all system features and data.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        title={user.isActive ? "Deactivate User" : "Activate User"}
        message={user.isActive 
          ? "Are you sure you want to deactivate this user? They will lose access to the system immediately."
          : "Are you sure you want to activate this user? They will regain access to the system."}
        onConfirm={confirmToggleStatus}
        onCancel={() => setModalOpen(false)}
        isLoading={isProcessing}
        confirmText={user.isActive ? "Yes, Deactivate" : "Yes, Activate"}
        isDestructive={user.isActive}
      />
    </div>
  );
};
