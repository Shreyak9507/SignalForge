import React from 'react';
import type { TargetState } from '../mockData';

interface MetricBannerProps {
  target: TargetState;
}

export const MetricBanner: React.FC<MetricBannerProps> = ({ target }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 font-mono select-none shrink-0">
      {/* 1: Estimated X */}
      <div className="px-2 py-1.5 rounded bg-[#0b0e12] border border-[#1a212a] flex items-center justify-between">
        <div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider">ESTIMATED X</div>
          <div className="text-sm font-bold text-zinc-100 leading-tight">
            {target.x.toFixed(2)} <span className="text-[10px] text-zinc-500 font-normal">m</span>
          </div>
        </div>
        <span className="text-[9px] text-zinc-500">±0.28m</span>
      </div>

      {/* 2: Estimated Y */}
      <div className="px-2 py-1.5 rounded bg-[#0b0e12] border border-[#1a212a] flex items-center justify-between">
        <div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider">ESTIMATED Y</div>
          <div className="text-sm font-bold text-zinc-100 leading-tight">
            {target.y.toFixed(2)} <span className="text-[10px] text-zinc-500 font-normal">m</span>
          </div>
        </div>
        <span className="text-[9px] text-zinc-500">±0.34m</span>
      </div>

      {/* 3: Cart Velocity */}
      <div className="px-2 py-1.5 rounded bg-[#0b0e12] border border-[#1a212a] flex items-center justify-between">
        <div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider">VELOCITY</div>
          <div className="text-sm font-bold text-zinc-100 leading-tight">
            {target.velocity.toFixed(2)} <span className="text-[10px] text-zinc-500 font-normal">m/s</span>
          </div>
        </div>
        <span className="text-[9px] text-[#10b981]">∠{target.headingAngle}°</span>
      </div>

      {/* 4: Covariance Ellipse */}
      <div className="px-2 py-1.5 rounded bg-[#0b0e12] border border-[#1a212a] flex items-center justify-between">
        <div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider">COVARIANCE (2σ)</div>
          <div className="text-xs font-semibold text-amber-400 leading-tight truncate">
            a={target.covarianceA.toFixed(2)}m · b={target.covarianceB.toFixed(2)}m
          </div>
        </div>
        <span className="text-[9px] text-zinc-500">θ={target.covarianceTheta}°</span>
      </div>

      {/* 5: Update Frequency */}
      <div className="px-2 py-1.5 rounded bg-[#0b0e12] border border-[#1a212a] flex items-center justify-between">
        <div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider">FREQUENCY</div>
          <div className="text-sm font-bold text-zinc-100 leading-tight">
            {target.updateFreq.toFixed(1)} <span className="text-[10px] text-zinc-500 font-normal">Hz</span>
          </div>
        </div>
        <span className="text-[9px] text-zinc-500">±{target.jitter}ms</span>
      </div>

      {/* 6: Solver State */}
      <div className="px-2 py-1.5 rounded bg-[#0b0e12] border border-[#1a212a] flex items-center justify-between">
        <div>
          <div className="text-[9px] text-zinc-500 uppercase tracking-wider">SOLVER STATE</div>
          <div className="text-xs font-bold text-[#10b981] leading-tight truncate">
            {target.solverState}
          </div>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_4px_#10b981]" />
      </div>
    </div>
  );
};
