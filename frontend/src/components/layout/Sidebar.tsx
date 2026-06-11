import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Clock, Users, Stethoscope, Settings,
  ChevronLeft, Heart
} from 'lucide-react';
import { cn } from '../../utils/formatters';
import type { SidebarLink } from '../../types';

interface SidebarProps {
  links: SidebarLink[];
  isOpen: boolean;
  onToggle: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

const Sidebar: React.FC<SidebarProps> = ({ links, isOpen, onToggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 76 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-border flex flex-col',
          'lg:relative lg:z-auto',
          !isOpen && 'max-lg:translate-x-[-100%]'
        )}
      >
        {/* Logo */}
        <div className="h-16 lg:h-18 flex items-center px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-text-primary whitespace-nowrap"
              >
                Smart<span className="text-primary">Care</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path + link.label}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-primary-50 text-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                )}
                title={!isOpen ? link.label : undefined}
              >
                <span className="flex-shrink-0">
                  {link.icon ? iconMap[link.icon] || <LayoutDashboard className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
                </span>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
                {isOpen && link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-surface-hover transition-colors text-text-muted"
            aria-label="Toggle sidebar"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.div>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
