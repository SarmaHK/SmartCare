import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Search, Bell, Menu, Mail, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../store/authStore';
import { getInitials } from '../utils/formatters';
import type { SidebarLink } from '../types';

interface DashboardLayoutProps {
  links: SidebarLink[];
  title: string;
  role: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ links }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex bg-[#f4f7fc] font-sans">
      <Sidebar
        links={links}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-[#f4f7fc] flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-30">
          {/* Left - Search */}
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex relative w-full max-w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                className="w-full h-11 pl-10 pr-4 bg-white border border-slate-100 rounded-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Right - Controls */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-slate-900">
              ENG <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <div className="flex items-center gap-4">
              <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
              <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-5 h-5 text-slate-700" />
                <span className="absolute 1 top-0 right-0 w-2 h-2 bg-blue-600 rounded-full border border-[#f4f7fc]" />
              </button>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-slate-500">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </span>
                )}
              </div>
              <p className="hidden sm:block text-[14px] font-semibold text-slate-700">
                {user?.name || 'User Name'}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
