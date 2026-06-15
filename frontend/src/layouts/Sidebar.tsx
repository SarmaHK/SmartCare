import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Clock, Users, Stethoscope, Settings,
  ChevronLeft, ChevronRight, Activity, BookOpen, MessageSquare, Award
} from 'lucide-react';
import type { SidebarLink } from '../types';

interface SidebarProps {
  links: SidebarLink[];
  isOpen: boolean;
  onToggle: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-[18px] h-[18px]" />,
  Calendar: <Calendar className="w-[18px] h-[18px]" />,
  Clock: <Clock className="w-[18px] h-[18px]" />,
  Users: <Users className="w-[18px] h-[18px]" />,
  Stethoscope: <Stethoscope className="w-[18px] h-[18px]" />,
  Settings: <Settings className="w-[18px] h-[18px]" />,
  BookOpen: <BookOpen className="w-[18px] h-[18px]" />,
  MessageSquare: <MessageSquare className="w-[18px] h-[18px]" />,
  Award: <Award className="w-[18px] h-[18px]" />
};

const Sidebar: React.FC<SidebarProps> = ({ links, isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-[#4f46e5] text-white transition-all duration-300 ease-in-out lg:relative lg:z-auto ${
          isOpen ? 'w-[260px]' : 'w-[80px]'
        } ${!isOpen ? 'max-lg:-translate-x-full' : ''}`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <span className="text-xl font-bold tracking-tight text-white">
                Smart<span className="font-normal text-white/80">Care</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto space-y-1 pr-6">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center h-12 px-6 transition-all duration-200 group overflow-hidden whitespace-nowrap ${
                  isActive
                    ? 'bg-[#f4f7fc] text-[#4f46e5] rounded-r-[30px] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
                title={!isOpen ? link.label : undefined}
              >
                <span className={`flex-shrink-0 flex items-center justify-center transition-colors w-[18px] ${isActive ? 'text-[#4f46e5]' : 'text-white/80 group-hover:text-white'}`}>
                  {link.icon ? iconMap[link.icon] || <LayoutDashboard className="w-[18px] h-[18px]" /> : <LayoutDashboard className="w-[18px] h-[18px]" />}
                </span>
                {isOpen && (
                  <span className={`ml-4 text-[14px] font-semibold tracking-wide ${isActive ? 'text-[#4f46e5]' : 'text-white/80 group-hover:text-white'}`}>
                    {link.label}
                  </span>
                )}
                {isOpen && link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-[#ff6b6b] text-white px-2 py-0.5 rounded-full leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle / Bottom Area */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={onToggle}
            className="w-full h-10 flex items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
