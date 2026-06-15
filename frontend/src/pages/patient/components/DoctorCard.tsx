import React from 'react';
import { Card, CardContent } from '../../../components/cards/Card';
import { Button } from '../../../components/common/Button';
import { type DoctorProfile } from '../../../services/doctor.service';
import { Stethoscope, Clock, IndianRupee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <Card hover className="group">
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-2xl font-bold text-primary-700">
          {doctor.user.fullName.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Dr. {doctor.user.fullName}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 font-medium text-primary-600">
                <Stethoscope className="h-4 w-4" />
                {doctor.specialization}
              </p>
            </div>
            <Button
              onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
              size="sm"
              className="shrink-0"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Book Now
            </Button>
          </div>

          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-secondary-600">
            {doctor.bio || 'Experienced medical professional dedicated to patient care.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-secondary-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-secondary-400" />
              {doctor.experienceYears} yrs experience
            </span>
            <span className="flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-secondary-400" />
              ₹{doctor.consultationFee}
            </span>
            <span className="rounded-md bg-secondary-100 px-2.5 py-1 text-xs font-medium text-secondary-700">
              {doctor.qualification}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
