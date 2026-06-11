import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Search, Bell, User as UserIcon } from 'lucide-react';
import Sidebar from './Sidebar';
import type { SidebarLink } from '../../types';

interface DashboardLayoutProps {
  links: SidebarLink[];
  title: string;
  role: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ links, title, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic mock logout
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar
        links={links}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 lg:h-18 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors -ml-2"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">{title}</h1>
          </div>

          {/* Right side navbar items */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Search */}
            <div className="hidden md:flex relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-primary focus:border-primary bg-gray-50"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-gray-100 relative text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            {/* User Profile Dropdown placeholder */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800">Demo User</span>
                <span className="text-xs font-medium text-primary px-2 py-0.5 bg-primary-50 rounded-full mt-0.5 capitalize">
                  {role}
                </span>
              </div>
              <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 hover:bg-gray-200 transition-colors">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors hidden sm:block ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
