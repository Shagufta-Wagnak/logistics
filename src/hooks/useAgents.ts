import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAgentsStore } from '@/stores/agentsStore';
import { useUIStore } from '@/stores/uiStore';
import * as api from '@/services/api';

export function useAgents() {
  const {
    setAgents,
    updateAgentLocation,
    getAllAgents,
    getAgentsByStatus,
    getAgentsByRegion,
    selectedAgentId,
    setSelectedAgent,
  } = useAgentsStore();
  
  const { isRealTimeEnabled } = useUIStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Initial fetch
  const { isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: api.fetchDeliveryAgents,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Set agents when query succeeds
  useEffect(() => {
    api.fetchDeliveryAgents().then(setAgents);
  }, [setAgents]);

  // Real-time location updates
  useEffect(() => {
    if (!isRealTimeEnabled) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    unsubscribeRef.current = api.subscribeToAgentUpdates(({ agentId, lat, lng }) => {
      updateAgentLocation(agentId, lat, lng);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isRealTimeEnabled, updateAgentLocation]);

  return {
    agents: getAllAgents(),
    isLoading,
    error,
    selectedAgentId,
    setSelectedAgent,
    getAgentsByStatus,
    getAgentsByRegion,
  };
}

