import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import { generateMockUser } from '@/mocks/generators';
import { ROLE_PERMISSIONS } from '@/lib/utils';
import { useOrdersStore } from './ordersStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole, region?: string) => void;
  logout: () => void;
  hasPermission: (permission: keyof typeof ROLE_PERMISSIONS.admin) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (role: UserRole, region?: string) => {
        set({ isLoading: true });
        
        // Simulate API delay
        setTimeout(() => {
          const user = generateMockUser(role, region);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        }, 500);
      },

      logout: () => {
        // Reset orders store to clear cached data
        useOrdersStore.getState().reset();
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return ROLE_PERMISSIONS[user.role][permission];
      },
    }),
    {
      name: 'logistics-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);


