import React, { useState } from 'react';
import { Input } from '../../../components/forms/Input';
import { Select } from '../../../components/forms/Select';
import { Button } from '../../../components/common/Button';
import { type PatientProfile, patientService } from '../../../services/patient.service';
import { toast } from 'react-hot-toast';

interface ProfileFormProps {
  profile: PatientProfile;
  onUpdate: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
    gender: (profile.gender || '') as 'MALE' | 'FEMALE' | 'OTHER' | '',
    bloodGroup: profile.bloodGroup || '',
    address: profile.address || '',
    emergencyContact: profile.emergencyContact || '',
    medicalHistory: profile.medicalHistory || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        gender: formData.gender === '' ? undefined : formData.gender as 'MALE' | 'FEMALE' | 'OTHER'
      };
      const response = await patientService.updateProfile(payload);
      if (response.success) {
        toast.success('Profile updated successfully');
        onUpdate();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Read Only Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-secondary-200">
        <Input label="Full Name" value={profile.user.fullName} disabled />
        <Input label="Email Address" value={profile.user.email} disabled />
        <Input label="Phone Number" value={profile.user.phone || 'N/A'} disabled />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { label: 'Select Gender', value: '' },
            { label: 'Male', value: 'MALE' },
            { label: 'Female', value: 'FEMALE' },
            { label: 'Other', value: 'OTHER' }
          ]}
        />

        <Input
          label="Blood Group"
          name="bloodGroup"
          placeholder="e.g. O+, A-, B+"
          value={formData.bloodGroup}
          onChange={handleChange}
        />

        <Input
          label="Emergency Contact"
          name="emergencyContact"
          placeholder="Contact Number"
          value={formData.emergencyContact}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <Input
          label="Residential Address"
          name="address"
          placeholder="Full Address"
          value={formData.address}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">
            Medical History (Optional)
          </label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-secondary-200 bg-white px-4 py-3 text-sm transition-colors resize-y focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="List any ongoing medical conditions, allergies, or past surgeries..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-secondary-200">
        <Button type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};
