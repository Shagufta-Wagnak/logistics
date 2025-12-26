import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Modals
  activeModal: string | null;
  modalData: Record<string, unknown>;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  
  // Real-time status
  isRealTimeEnabled: boolean;
  toggleRealTime: () => void;
  lastUpdateTime: string | null;
  setLastUpdateTime: (time: string) => void;
  
  // View preferences
  ordersViewMode: 'list' | 'grid';
  setOrdersViewMode: (mode: 'list' | 'grid') => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  // Modals
  activeModal: null,
  modalData: {},
  openModal: (modalId, data = {}) => set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),
  
  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    
    // Auto-remove after duration
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  // Real-time
  isRealTimeEnabled: true,
  toggleRealTime: () => set((state) => ({ isRealTimeEnabled: !state.isRealTimeEnabled })),
  lastUpdateTime: null,
  setLastUpdateTime: (time) => set({ lastUpdateTime: time }),
  
  // View preferences
  ordersViewMode: 'list',
  setOrdersViewMode: (mode) => set({ ordersViewMode: mode }),
}));

