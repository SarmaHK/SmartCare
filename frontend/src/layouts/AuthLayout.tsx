import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Stethoscope,
  Shield,
  Activity,
  Clock,
  HeartPulse,
  CalendarCheck,
} from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-secondary-50 font-sans">
      {/* Left branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary-700 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.95)_0%,rgba(30,64,175,0.98)_100%)]" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-500/20" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-primary-400/10" />

        <div className="relative z-10">
          <div className="mb-16 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-soft">
              <Stethoscope className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">SmartCare</span>
              <p className="text-sm text-primary-200">Healthcare Management Platform</p>
            </div>
          </div>

          <div className="max-w-lg">
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight">
              Your health, managed with care.
            </h1>
            <p className="mb-12 text-lg leading-relaxed text-primary-100">
              A trusted platform connecting patients with qualified healthcare professionals
              for seamless appointment scheduling and care coordination.
            </p>

            <div className="space-y-5">
              {[
                { icon: CalendarCheck, title: 'Easy Scheduling', desc: 'Book appointments online, anytime' },
                { icon: Shield, title: 'Secure & Private', desc: 'Your health data is protected' },
                { icon: HeartPulse, title: 'Expert Care', desc: 'Verified medical professionals' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <Icon className="h-5 w-5 text-primary-200" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="text-sm text-primary-200">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-sm text-primary-200">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>24/7 Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Real-time Updates</span>
          </div>
          <p className="ml-auto">&copy; {new Date().getFullYear()} SmartCare</p>
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
