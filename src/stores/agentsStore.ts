import { create } from 'zustand';
import type { DeliveryAgent, AgentStatus } from '@/types';

interface AgentsState {
  agents: Map<string, DeliveryAgent>;
  selectedAgentId: string | null;
  isLoading: boolean;
  
  // Actions
  setAgents: (agents: DeliveryAgent[]) => void;
  updateAgentLocation: (agentId: string, lat: number, lng: number) => void;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  setSelectedAgent: (agentId: string | null) => void;
  
  // Computed
  getAgent: (agentId: string) => DeliveryAgent | undefined;
  getAgentsByStatus: (status: AgentStatus) => DeliveryAgent[];
  getAgentsByRegion: (region: string) => DeliveryAgent[];
  getAllAgents: () => DeliveryAgent[];
}

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: new Map(),
  selectedAgentId: null,
  isLoading: false,

  setAgents: (agents) => {
    const agentsMap = new Map(agents.map((a) => [a.id, a]));
    set({ agents: agentsMap, isLoading: false });
  },

  updateAgentLocation: (agentId, lat, lng) => {
    set((state) => {
      const agent = state.agents.get(agentId);
      if (!agent) return state;
      
      const newAgents = new Map(state.agents);
      newAgents.set(agentId, {
        ...agent,
        currentLocation: { lat, lng },
      });
      
      return { agents: newAgents };
    });
  },

  updateAgentStatus: (agentId, status) => {
    set((state) => {
      const agent = state.agents.get(agentId);
      if (!agent) return state;
      
      const newAgents = new Map(state.agents);
      newAgents.set(agentId, { ...agent, status });
      
      return { agents: newAgents };
    });
  },

  setSelectedAgent: (agentId) => set({ selectedAgentId: agentId }),

  getAgent: (agentId) => get().agents.get(agentId),

  getAgentsByStatus: (status) => {
    return Array.from(get().agents.values()).filter((a) => a.status === status);
  },

  getAgentsByRegion: (region) => {
    return Array.from(get().agents.values()).filter((a) => a.region === region);
  },

  getAllAgents: () => Array.from(get().agents.values()),
}));

