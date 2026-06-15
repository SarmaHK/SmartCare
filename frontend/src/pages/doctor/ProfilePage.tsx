import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/cards/Card';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/common/Button';
import { doctorService, type DoctorProfile } from '../../services/doctor.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    experienceYears: 0,
    consultationFee: 0,
    qualification: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setIsLoading(true);
    try {
      const response = await doctorService.getMyProfile();
      if (response.success) {
        setProfile(response.data);
        setFormData({
          fullName: response.data.user.fullName || '',
          email: response.data.user.email || '',
          specialization: response.data.specialization || 'Not specified',
          experienceYears: response.data.experienceYears || 0,
          consultationFee: Number(response.data.consultationFee) || 0,
          qualification: response.data.qualification || '',
          bio: response.data.bio || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        specialization: formData.specialization,
        experienceYears: Number(formData.experienceYears),
        consultationFee: String(formData.consultationFee),
        qualification: formData.qualification,
        bio: formData.bio
      };
      const response = await doctorService.updateMyProfile(payload);
      if (response.success) {
        toast.success('Profile updated successfully');
        setProfile(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;
  }

  if (!profile) {
    return <div className="text-center py-10 text-secondary-500">Failed to load profile. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        description="View your public information and update your professional bio."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Read Only Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-4xl font-bold mb-6">
                {profile.user.fullName.charAt(0)}
              </div>
              
              <div className="space-y-4">
                <Input 
                  label="Full Name" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                />
                <Input 
                  label="Email Address" 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input 
                  label="Specialization" 
                  value={formData.specialization} 
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    type="number"
                    label="Experience (Years)" 
                    value={formData.experienceYears.toString()} 
                    onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: Number(e.target.value) }))}
                  />
                  <Input 
                    type="number"
                    label="Consultation Fee" 
                    leftIcon={<span className="text-sm font-medium">Rs.</span>}
                    value={formData.consultationFee.toString()} 
                    onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: Number(e.target.value) }))}
                  />
                </div>
                <Input 
                  label="Qualifications" 
                  value={formData.qualification} 
                  onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Editable Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">Professional Bio</h3>
              <p className="text-sm text-secondary-600 mb-4">
                This biography will be visible to patients when they are searching for doctors or booking an appointment. Make it professional and welcoming.
              </p>
              
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={8}
                className="w-full rounded-lg border border-secondary-200 bg-white px-4 py-3 text-sm transition-colors resize-y focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 mb-4"
                placeholder="Write a brief professional biography..."
              />
              
              <div className="flex justify-end pt-4 border-t border-secondary-100">
                <Button 
                  onClick={handleSave} 
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
