import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { patientService, type PatientProfile } from '../../services/patient.service';
import { ProfileForm } from './components/ProfileForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setIsLoading(true);
    try {
      const response = await patientService.getProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        description="Manage your personal details and medical history."
      />

      <div className="bg-white p-6 rounded-xl shadow-soft border border-secondary-200 max-w-4xl">
        {isLoading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : profile ? (
          <ProfileForm profile={profile} onUpdate={fetchProfile} />
        ) : (
          <div className="text-center py-10 text-secondary-500">
            Failed to load profile. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};
