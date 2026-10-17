import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const LocalizationPipeline: React.FC = () => {
  const steps = [
    { label: 'RSSI INPUT', desc: 'Raw BLE Packets', status: 'active' },
    { label: 'FILTERING', desc: 'Moving Median / KF', status: 'active' },
    { label: 'NLOS MODEL', desc: 'ANN Reliability Scorer', status: 'highlight' },
    { label: 'LOCALIZATION', desc: 'Weighted Trilateration', status: 'active' },
    { label: 'FUSION', desc: 'Covariance Weighting', status: 'active' },
    { label: 'EKF TRACK', desc: 'Kinematic Predict & Update', status: 'active' },
  ];

  return (
    <div className="bg-[#0e1116] border border-zinc-800/80 rounded-md px-4 py-2.5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 select-none">
      <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold shrink-0 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        LOCALIZATION PIPELINE:
      </div>

      <div className="flex-1 w-full overflow-x-auto flex items-center justify-between gap-2 py-0.5">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded border font-mono shrink-0 transition-all ${
                step.status === 'highlight'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                  : 'bg-zinc-900/60 border-zinc-800/70 text-zinc-300'
              }`}
            >
              <CheckCircle2
                className={`w-3 h-3 ${
                  step.status === 'highlight' ? 'text-emerald-400' : 'text-emerald-500/80'
                }`}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold leading-tight tracking-wider">
                  {step.label}
                </span>
                <span className="text-[9px] text-zinc-500 leading-tight">
                  {step.desc}
                </span>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
