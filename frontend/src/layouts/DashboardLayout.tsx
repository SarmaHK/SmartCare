import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, type SidebarItem } from '../components/navigation/Sidebar';
import { TopHeader } from '../components/navigation/TopHeader';
import { cn } from '../utils/cn';

interface DashboardLayoutProps {
  navItems: SidebarItem[];
  roleName: string;
  role: string;
  portalTitle: string;
  maxWidth?: '6xl' | '7xl';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  navItems,
  roleName,
  role,
  portalTitle,
  maxWidth = '7xl',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary-50 font-sans">
      <Sidebar
        items={navItems}
        roleName={roleName}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          isCollapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-64'
        )}
      >
        <TopHeader
          onOpenSidebar={() => setIsMobileOpen(true)}
          role={role}
          portalTitle={portalTitle}
        />

        <main className="flex-1 overflow-auto">
          <div
            className={cn(
              'mx-auto w-full p-4 sm:p-6 lg:p-8',
              maxWidth === '6xl' ? 'max-w-6xl' : 'max-w-7xl'
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
