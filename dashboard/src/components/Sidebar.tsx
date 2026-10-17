import React from 'react';
import { 
  Radio, 
  MapPin, 
  Activity, 
  Compass, 
  Settings, 
  PlaySquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  firmware: string;
  ekfModel: string;
  gateway: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  firmware,
  ekfModel,
  gateway
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'live', label: 'Live Localization', icon: MapPin },
    { id: 'anchors', label: 'Anchor Health', icon: Radio },
    { id: 'signals', label: 'Signal Analysis', icon: Activity },
    { id: 'scenarios', label: 'Test Scenarios', icon: PlaySquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`h-screen shrink-0 bg-[#090c0f] border-r border-[#1a212a] flex flex-col justify-between select-none transition-all duration-300 z-20 ${
        isCollapsed ? 'w-14' : 'w-52'
      }`}
    >
      {/* Brand Header + Collapse Button */}
      <div>
        <div className={`h-11 border-b border-[#1a212a] flex items-center justify-between px-2.5 ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded bg-[#10b981]/10 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] shrink-0">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="truncate">
                <div className="font-mono font-bold tracking-wider text-xs text-zinc-100 leading-none">
                  SignalForge
                </div>
                <div className="text-[8px] font-mono tracking-widest text-[#10b981] uppercase leading-tight mt-0.5">
                  AI POSITIONING
                </div>
              </div>
            </div>
          )}

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded flex items-center justify-center bg-[#12171c] hover:bg-[#1a222a] border border-[#1e2733] text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Category */}
        <div className="py-2.5">
          {!isCollapsed && (
            <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-semibold px-3 mb-1">
              TELEMETRY
            </div>
          )}
          <nav className="space-y-0.5 px-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-xs font-mono transition-all text-left group relative ${
                    isSelected
                      ? 'bg-[#12191f] text-[#10b981] font-semibold border-l-2 border-[#10b981]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#12171c]'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#10b981]' : 'text-zinc-500'}`} />
                  {!isCollapsed && <span className="truncate text-[11px]">{item.label}</span>}

                  {/* Tooltip on collapsed hover */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#11171d] text-zinc-200 text-[10px] rounded border border-[#1e2732] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Footprint Telemetry (Bottom Left) */}
      {!isCollapsed ? (
        <div className="p-2.5 border-t border-[#1a212a] bg-[#07090b] text-[9px] font-mono text-zinc-400 space-y-0.5">
          <div className="flex items-center justify-between text-zinc-500 text-[8px] uppercase tracking-wider mb-0.5">
            <span>FOOTPRINT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Firmware:</span>
            <span className="text-zinc-300">{firmware}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">EKF:</span>
            <span className="text-zinc-300">{ekfModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Gateway:</span>
            <span className="text-[#10b981] font-medium">{gateway}</span>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-[#1a212a] flex justify-center">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" title="Gateway Online" />
        </div>
      )}
    </aside>
  );
};
