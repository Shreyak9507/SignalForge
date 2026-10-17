import React from 'react';
import { Clock, User } from 'lucide-react';

interface TopBarProps {
  labSector: string;
  ekfVersion: string;
  ekfStatus: string;
  targetTag: string;
  latencyUtc: string;
  liveRate: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  labSector,
  ekfVersion,
  ekfStatus,
  targetTag,
  latencyUtc,
  liveRate
}) => {
  return (
    <div className="h-9 shrink-0 bg-[#090c0f] border-b border-[#1a212a] px-3 flex items-center justify-between text-xs font-mono select-none">
      {/* Left: Sector & Target Info */}
      <div className="flex items-center gap-3">
        {/* Lab Sector Badge */}
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-[#11171d] border border-[#1e2732] text-zinc-300 text-[10px]">
          <span className="w-1.5 h-1.5 border border-zinc-500 rounded-sm inline-block" />
          <span className="text-zinc-200 uppercase tracking-wide font-medium">{labSector}</span>
        </div>

        {/* EKF Status */}
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <span className="text-zinc-500">EKF:</span>
          <span className="text-[#10b981] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            {ekfVersion} [{ekfStatus}]
          </span>
        </div>

        {/* Target Tag */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-zinc-400">
          <span className="text-zinc-500">Target:</span>
          <span className="text-zinc-200">{targetTag}</span>
        </div>
      </div>

      {/* Right: Latency, Live Rate, Profile */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span>{latencyUtc}</span>
        </div>

        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] font-semibold text-[10px]">
          <span className="w-1 h-1 rounded-full bg-[#10b981] animate-ping" />
          <span>{liveRate}</span>
        </div>

        <div className="w-5 h-5 rounded border border-[#1e2732] bg-[#11171d] flex items-center justify-center text-zinc-400">
          <User className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
