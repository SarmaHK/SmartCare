import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronRight, LogOut, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { NotificationDropdown } from './NotificationDropdown';

interface TopHeaderProps {
  onOpenSidebar: () => void;
  role: string;
  portalTitle?: string;
}

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  doctors: 'Doctors',
  appointments: 'Appointments',
  profile: 'Profile',
  slots: 'Slots',
  create: 'Create Slot',
  edit: 'Edit Slot',
  users: 'Users',
  reports: 'Reports',
};

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenSidebar, role, portalTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentSegment = pathSegments[pathSegments.length - 1] || 'dashboard';
  const formattedPage =
    PAGE_LABELS[currentSegment] ||
    currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1);

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const profilePath = `/${role.toLowerCase()}/profile`;

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-secondary-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-secondary-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          {portalTitle && (
            <p className="hidden text-xs font-medium uppercase tracking-wider text-secondary-400 sm:block">
              {portalTitle}
            </p>
          )}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
            <span className="hidden capitalize text-secondary-400 sm:inline">{role}</span>
            <ChevronRight className="hidden h-3.5 w-3.5 text-secondary-300 sm:inline" />
            <span className="truncate font-semibold text-secondary-900">{formattedPage}</span>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationDropdown />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 rounded-lg border border-secondary-200 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-secondary-50"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-[120px] truncate text-sm font-medium leading-tight text-secondary-900">
                {user?.fullName}
              </p>
              <p className="text-xs capitalize text-secondary-400">{role}</p>
            </div>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 animate-slide-up overflow-hidden rounded-xl border border-secondary-200 bg-white py-1 shadow-soft-lg"
              role="menu"
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(profilePath);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-secondary-700 hover:bg-secondary-50"
                role="menuitem"
              >
                <User className="h-4 w-4 text-secondary-400" />
                My Profile
              </button>
              <div className="my-1 border-t border-secondary-100" />
              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50'
                )}
                role="menuitem"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
