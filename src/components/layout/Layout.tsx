import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { cn } from '@/lib/utils';

export function Layout() {
  const { isAuthenticated } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] grid-pattern">
      <Sidebar />
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

