import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Stethoscope, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps {
  items: SidebarItem[];
  roleName: string;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  roleName,
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const sidebarContent = (
    <>
      {/* Brand */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-secondary-200 px-4',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        <div className={cn('flex items-center gap-2.5', isCollapsed && 'justify-center')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 shadow-sm">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-base font-bold tracking-tight text-secondary-900">SmartCare</span>
              <p className="text-[10px] font-medium uppercase tracking-wider text-secondary-400">
                {roleName}
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin" aria-label="Main navigation">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length <= 2}
            onClick={onCloseMobile}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isCollapsed && 'justify-center px-2',
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'
                  )}
                >
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden border-t border-secondary-200 p-3 lg:block">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700',
            isCollapsed && 'justify-center px-2'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-secondary-200 bg-white shadow-soft-lg transition-transform duration-300 lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-secondary-200 bg-white transition-all duration-300 lg:flex',
          isCollapsed ? 'w-[4.5rem]' : 'w-64'
        )}
        aria-label="Sidebar navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
};
