import { useState, useCallback, memo, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import { useAgents } from '@/hooks/useAgents';
import { useOrders } from '@/hooks/useOrders';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageLoader } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import type { DeliveryAgent } from '@/types';
import { 
  MapPin, 
  Truck, 
  User, 
  Phone, 
  Star, 
  Package,
  Zap,
  List,
  Map as MapIcon
} from 'lucide-react';

// Agent Card Component
const AgentCard = memo(function AgentCard({
  agent,
  isSelected,
  onSelect,
  assignedOrdersCount
}: {
  agent: DeliveryAgent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  assignedOrdersCount: number;
}) {
  const statusColors = {
    available: 'bg-emerald-500',
    on_delivery: 'bg-amber-500',
    offline: 'bg-slate-500',
    break: 'bg-blue-500',
  };

  const vehicleIcons = {
    bike: '🏍️',
    van: '🚐',
    truck: '🚚',
  };

  return (
    <button
      onClick={() => onSelect(agent.id)}
      className={cn(
        'w-full p-4 rounded-xl border text-left transition-all duration-200',
        isSelected
          ? 'border-amber-500 bg-amber-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">
            {vehicleIcons[agent.vehicleType]}
          </div>
          <div className={cn(
            'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-slate-800',
            statusColors[agent.status]
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-200 truncate">{agent.name}</p>
          <p className="text-xs text-slate-500 capitalize">{agent.status.replace('_', ' ')}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Star size={12} fill="currentColor" />
              {agent.rating}
            </span>
            <span className="text-xs text-slate-500">
              {agent.totalDeliveries} deliveries
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-slate-400">{agent.region}</span>
          {agent.status === 'on_delivery' && (
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Package size={12} />
              {assignedOrdersCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
});

// Agent Marker Component
const AgentMarker = memo(function AgentMarker({
  agent,
  isSelected,
  onClick
}: {
  agent: DeliveryAgent;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    available: 'bg-emerald-500 border-emerald-400',
    on_delivery: 'bg-amber-500 border-amber-400',
    offline: 'bg-slate-500 border-slate-400',
    break: 'bg-blue-500 border-blue-400',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative transform transition-all duration-200 cursor-pointer',
        isSelected && 'scale-125 z-50'
      )}
    >
      {/* Pulse animation for selected */}
      {isSelected && (
        <div className="absolute inset-0 -m-2 rounded-full bg-amber-500/30 animate-ping" />
      )}
      
      {/* Marker */}
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-all',
        isSelected 
          ? 'bg-amber-500 border-amber-300 text-slate-900' 
          : statusColors[agent.status] + ' text-white'
      )}>
        <Truck size={18} />
      </div>
      
      {/* Name label */}
      <div className={cn(
        'absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap',
        'px-2 py-0.5 rounded text-xs font-medium shadow-lg',
        isSelected
          ? 'bg-amber-500 text-slate-900'
          : 'bg-slate-800 text-slate-200'
      )}>
        {agent.name.split(' ')[0]}
      </div>
    </button>
  );
});

// Interactive Map Component
function InteractiveMap({ 
  agents, 
  selectedAgent,
  onSelectAgent 
}: { 
  agents: DeliveryAgent[];
  selectedAgent: DeliveryAgent | null;
  onSelectAgent: (id: string) => void;
}) {
  const activeAgents = agents.filter(a => a.status !== 'offline');
  const [popupAgent, setPopupAgent] = useState<DeliveryAgent | null>(null);
  
  // Calculate map center based on agents
  const mapCenter = useMemo(() => {
    if (selectedAgent) {
      return {
        longitude: selectedAgent.currentLocation.lng,
        latitude: selectedAgent.currentLocation.lat,
        zoom: 12
      };
    }
    if (activeAgents.length === 0) {
      return { longitude: -98.5795, latitude: 39.8283, zoom: 4 }; // US center
    }
    const avgLng = activeAgents.reduce((sum, a) => sum + a.currentLocation.lng, 0) / activeAgents.length;
    const avgLat = activeAgents.reduce((sum, a) => sum + a.currentLocation.lat, 0) / activeAgents.length;
    return { longitude: avgLng, latitude: avgLat, zoom: 5 };
  }, [activeAgents, selectedAgent]);

  const handleMarkerClick = useCallback((agent: DeliveryAgent) => {
    onSelectAgent(agent.id);
    setPopupAgent(agent);
  }, [onSelectAgent]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Map
        initialViewState={mapCenter}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        <NavigationControl position="top-right" />
        
        {/* Agent Markers */}
        {activeAgents.map((agent) => (
          <Marker
            key={agent.id}
            longitude={agent.currentLocation.lng}
            latitude={agent.currentLocation.lat}
            anchor="center"
          >
            <AgentMarker
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onClick={() => handleMarkerClick(agent)}
            />
          </Marker>
        ))}
        
        {/* Popup for selected agent */}
        {popupAgent && (
          <Popup
            longitude={popupAgent.currentLocation.lng}
            latitude={popupAgent.currentLocation.lat}
            anchor="top"
            onClose={() => setPopupAgent(null)}
            closeButton={true}
            closeOnClick={false}
            className="agent-popup"
          >
            <div className="p-2 min-w-[180px]">
              <p className="font-semibold text-slate-900">{popupAgent.name}</p>
              <p className="text-xs text-slate-600 capitalize">
                {popupAgent.status.replace('_', ' ')} • {popupAgent.vehicleType}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <MapPin size={12} />
                <span>{popupAgent.region}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <Star size={12} className="text-amber-500" fill="currentColor" />
                <span className="text-slate-700">{popupAgent.rating} rating</span>
              </div>
            </div>
          </Popup>
        )}
      </Map>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
        <p className="text-xs font-medium text-slate-400 mb-2">Delivery Agents</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-300">On Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-300">On Break</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700/50 text-xs text-slate-400">
          {activeAgents.length} agents active
        </div>
      </div>
      
      {/* No agents message */}
      {activeAgents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
          <div className="text-center">
            <MapIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No active deliveries</p>
            <p className="text-sm text-slate-500">Agents will appear here when on delivery</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrackingPage() {
  const { agents, isLoading: agentsLoading, selectedAgentId, setSelectedAgent } = useAgents();
  const { orders, isLoading: ordersLoading } = useOrders();
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  const activeAgents = agents.filter(a => a.status !== 'offline');
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || null;
  
  // Get orders for selected agent
  const agentOrders = orders.filter(
    o => o.assignedDriver === selectedAgentId && 
    ['shipped', 'out_for_delivery'].includes(o.status)
  );

  const handleSelectAgent = useCallback((id: string) => {
    setSelectedAgent(id === selectedAgentId ? null : id);
  }, [selectedAgentId, setSelectedAgent]);

  if (agentsLoading || ordersLoading) {
    return <PageLoader />;
  }

  return (
    <div className="h-[calc(100vh-120px)]">
      <Header 
        title="Live Tracking" 
        subtitle={`${activeAgents.length} active delivery agents`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/50 rounded-lg p-1">
              {[
                { mode: 'split' as const, icon: '◫' },
                { mode: 'map' as const, icon: MapIcon },
                { mode: 'list' as const, icon: List },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-3 py-1.5 rounded text-sm transition-all',
                    viewMode === mode
                      ? 'bg-amber-500 text-slate-900 font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {typeof Icon === 'string' ? Icon : <Icon size={16} />}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div className={cn(
        'grid gap-4 h-[calc(100%-60px)]',
        viewMode === 'split' && 'grid-cols-3',
        viewMode === 'map' && 'grid-cols-1',
        viewMode === 'list' && 'grid-cols-1'
      )}>
        {/* Agent List */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={cn(
            'overflow-auto',
            viewMode === 'split' && 'col-span-1',
            viewMode === 'list' && 'col-span-1'
          )}>
            <Card variant="bordered" padding="sm" className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Delivery Agents
                </CardTitle>
                <span className="text-sm text-slate-400">{activeAgents.length} active</span>
              </CardHeader>
              <div className="space-y-2 overflow-auto max-h-[calc(100%-60px)]">
                {activeAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgentId === agent.id}
                    onSelect={handleSelectAgent}
                    assignedOrdersCount={orders.filter(o => o.assignedDriver === agent.id).length}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Map */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={cn(
            viewMode === 'split' && 'col-span-2',
            viewMode === 'map' && 'col-span-1'
          )}>
            <InteractiveMap 
              agents={agents} 
              selectedAgent={selectedAgent}
              onSelectAgent={handleSelectAgent}
            />
          </div>
        )}
      </div>

      {/* Selected Agent Panel */}
      {selectedAgent && (
        <div className="fixed bottom-4 right-4 w-96 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl animate-slide-up z-20">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">{selectedAgent.name}</p>
                  <p className="text-sm text-slate-400 capitalize">
                    {selectedAgent.status.replace('_', ' ')} • {selectedAgent.vehicleType}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(null)}>
                ×
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Phone size={14} />
                {selectedAgent.phone}
              </span>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <MapPin size={14} />
                {selectedAgent.region}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span>Coordinates:</span>
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">
                {selectedAgent.currentLocation.lat.toFixed(4)}, {selectedAgent.currentLocation.lng.toFixed(4)}
              </code>
            </div>
          </div>
          
          {agentOrders.length > 0 && (
            <div className="p-4">
              <p className="text-sm font-medium text-slate-400 mb-3">
                Assigned Orders ({agentOrders.length})
              </p>
              <div className="space-y-2 max-h-48 overflow-auto">
                {agentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50"
                  >
                    <div>
                      <p className="text-sm font-mono text-amber-400">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">{order.customerName}</p>
                    </div>
                    <StatusBadge status={order.status} size="sm" showIcon={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
