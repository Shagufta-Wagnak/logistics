import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';

export function useDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.fetchDashboardStats,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });

  return {
    stats,
    isLoading,
    error,
  };
}


