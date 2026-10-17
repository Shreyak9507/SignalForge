import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PositionConfidencePanelProps {
  confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW';
  activeCount: number;
  totalCount: number;
  shortExplanation: string;
  uncertaintyFormatted: string;
  details?: {
    gdop: number;
    weightedResid: string;
    filterMode: string;
    modelNotes: string;
  };
}

export const PositionConfidencePanel: React.FC<PositionConfidencePanelProps> = ({
  confidenceLevel,
  activeCount,
  totalCount,
  shortExplanation,
  uncertaintyFormatted,
  details
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getStatusStyles = () => {
    switch (confidenceLevel) {
      case 'HIGH':
        return {
          pillBg: 'bg-[#10b981]/15',
          pillText: 'text-[#10b981]',
          pillBorder: 'border-[#10b981]/40'
        };
      case 'MODERATE':
        return {
          pillBg: 'bg-amber-950/50',
          pillText: 'text-amber-400',
          pillBorder: 'border-amber-600/40'
        };
      case 'LOW':
      default:
        return {
          pillBg: 'bg-rose-950/50',
          pillText: 'text-rose-400',
          pillBorder: 'border-rose-600/40'
        };
    }
  };

  const status = getStatusStyles();

  return (
    <div className="bg-[#0b0e12] border border-[#1a212a] rounded p-2.5 select-none shadow-sm flex flex-col justify-between font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1a212a]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
            Position Confidence
          </span>
          <span className="text-zinc-600">—</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${status.pillBg} ${status.pillText} ${status.pillBorder}`}>
            {confidenceLevel}
          </span>
        </div>

        <span className="text-[10px] text-zinc-400 font-medium">
          {activeCount}/{totalCount} contributing
        </span>
      </div>

      {/* Main explanation & uncertainty indicator */}
      <div className="py-1.5 space-y-1">
        <p className="text-[10px] text-zinc-300 leading-snug">
          {shortExplanation}
        </p>

        <div className="flex items-center justify-between text-[10px] pt-0.5">
          <span className="text-zinc-400">Position uncertainty:</span>
          <span className="text-zinc-100 font-bold bg-[#11171e] px-1.5 py-0.2 rounded border border-[#1e2733]">
            {uncertaintyFormatted}
          </span>
        </div>
      </div>

      {/* Expandable Why / Diagnostics toggle */}
      <div className="pt-1 border-t border-[#1a212a] flex flex-col gap-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between text-[9px] text-zinc-400 hover:text-zinc-200 transition-colors w-full"
        >
          <span>{isExpanded ? 'Hide diagnostics' : 'Why? View diagnostics'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {isExpanded && details && (
          <div className="p-1.5 rounded bg-[#080b0e] border border-[#18212b] text-[9px] space-y-1 animate-fadeIn">
            <div className="grid grid-cols-3 gap-1 text-center">
              <div className="p-1 rounded bg-[#0f141a] border border-[#1a222c]">
                <div className="text-zinc-500 uppercase text-[8px]">GDOP</div>
                <div className="font-bold text-zinc-200">{details.gdop}</div>
              </div>
              <div className="p-1 rounded bg-[#0f141a] border border-[#1a222c]">
                <div className="text-zinc-500 uppercase text-[8px]">Residual</div>
                <div className="font-bold text-[#10b981]">{details.weightedResid}</div>
              </div>
              <div className="p-1 rounded bg-[#0f141a] border border-[#1a222c]">
                <div className="text-zinc-500 uppercase text-[8px]">Mode</div>
                <div className="font-bold text-zinc-200">{details.filterMode}</div>
              </div>
            </div>

            <p className="text-zinc-400 text-[8px] leading-normal pt-0.5 border-t border-[#151d26]">
              {details.modelNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
