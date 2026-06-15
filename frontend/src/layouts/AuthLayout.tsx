import React from 'react';
import { Outlet } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-secondary-50 font-sans">
      {/* Left branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary-900 p-12 text-white lg:flex">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/glowing-medical-cross-symbol-gently-cradled-in-open-hands-signifying-healthcare-hope-and-healing-a-powerful-image-representing-medical-care-support-and-the-promise-of-a-b.jpg')" }}
        />
        {/* Subtle gradient overlay to keep text readable but image clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-transparent to-primary-900/80" />

        <div className="relative z-10">
          <div className="mb-16 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-soft">
              <Stethoscope className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">SmartCare</span>
              <p className="text-sm text-white/90">Healthcare Management Platform</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex w-full text-sm text-white/90">
          <p>&copy; {new Date().getFullYear()} SmartCare</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex w-full flex-1 items-center justify-center p-6 sm:p-10 lg:w-1/2 lg:p-16">
        <div className="absolute left-6 top-6 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-secondary-900">SmartCare</span>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <div className="rounded-xl border border-secondary-200 bg-white p-8 shadow-soft-lg sm:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
