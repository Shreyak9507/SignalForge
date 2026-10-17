import React, { useState } from 'react';
import type { AnchorData } from '../mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CompactAnchorListProps {
  anchors: AnchorData[];
}

export const CompactAnchorList: React.FC<CompactAnchorListProps> = ({ anchors }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-[#0b0e12] border border-[#1a212a] rounded p-2.5 select-none shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1a212a]">
        <span className="font-mono text-xs font-bold text-zinc-100 uppercase tracking-wide">
          Anchor Health
        </span>
        <span className="text-[10px] font-mono text-zinc-500">
          {anchors.filter((a) => !a.disabled && a.status !== 'OFFLINE').length} / {anchors.length} Active
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-1 pt-1.5">
        {anchors.map((anchor) => {
          const isDegraded = anchor.status === 'DEGRADED';
          const isOffline = anchor.disabled || anchor.status === 'OFFLINE';
          const isExpanded = expandedId === anchor.id;

          return (
            <div
              key={anchor.id}
              className={`rounded border transition-colors ${
                isDegraded
                  ? 'bg-amber-950/20 border-amber-600/30'
                  : isOffline
                  ? 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                  : 'bg-[#0e1217] border-[#1a212a]'
              }`}
            >
              <div
                onClick={() => toggleExpand(anchor.id)}
                className="px-2 py-1 flex items-center justify-between text-xs font-mono cursor-pointer hover:bg-white/[0.02]"
              >
                {/* ID & Position */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOffline
                        ? 'bg-zinc-600'
                        : isDegraded
                        ? 'bg-amber-400'
                        : 'bg-[#10b981]'
                    }`}
                  />
                  <span className="font-bold text-zinc-200">{anchor.id}</span>
                  <span className="text-[9px] text-zinc-500">{anchor.posLabel}</span>
                </div>

                {/* Status and RSSI */}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold ${isDegraded ? 'text-amber-400' : isOffline ? 'text-zinc-600' : 'text-zinc-300'}`}>
                    {isOffline ? '---' : `${anchor.rssi} dBm`}
                  </span>

                  <span
                    className={`px-1.5 py-0.2 rounded text-[8px] uppercase font-bold tracking-wider border ${
                      isOffline
                        ? 'bg-zinc-900 text-zinc-500 border-zinc-800'
                        : isDegraded
                        ? 'bg-amber-950/80 text-amber-400 border-amber-600/50'
                        : 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
                    }`}
                  >
                    {anchor.status}
                  </span>

                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Click-expanded row details */}
              {isExpanded && !isOffline && (
                <div className="px-2 pb-1.5 pt-0.5 border-t border-[#1a212a]/60 text-[9px] font-mono grid grid-cols-4 gap-1 text-zinc-400 bg-[#080b0e]">
                  <div>Loss: <span className="text-zinc-200">{anchor.loss}%</span></div>
                  <div>Var: <span className="text-zinc-200">{anchor.variance} dB²</span></div>
                  <div>NLOS: <span className={isDegraded ? 'text-amber-400' : 'text-zinc-200'}>{anchor.nlosProb}%</span></div>
                  <div>Weight: <span className={isDegraded ? 'text-amber-400 font-bold' : 'text-[#10b981]'}>{anchor.weight}</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
