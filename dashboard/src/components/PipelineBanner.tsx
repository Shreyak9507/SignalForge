import React, { useState } from 'react';

interface StageDetails {
  title: string;
  badge: string;
  description: string;
  metrics: { label: string; value: string }[];
}

export const PipelineBanner: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stages: {
    id: string;
    title: string;
    statusBadge: string;
    badgeColor: string;
    details: StageDetails;
  }[] = [
    {
      id: 'ingestion',
      title: 'BLE RSSI Ingest',
      statusBadge: '4/4',
      badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      details: {
        title: 'BLE RSSI Ingestion Layer',
        badge: '4 OF 4 CHANNELS LOCKED',
        description: 'Synchronous 10 Hz Bluetooth Low Energy packet collector listening across primary advertising channels (37, 38, 39). Continuous packet buffer with sequence-number validation.',
        metrics: [
          { label: 'Sampling Rate', value: '10.2 Hz' },
          { label: 'Packet Drop Rate', value: '0.4%' },
          { label: 'PHY Protocol', value: 'BLE 5.2 Extended' },
          { label: 'Buffer Depth', value: '32 frames' }
        ]
      }
    },
    {
      id: 'median',
      title: 'Median Filter',
      statusBadge: 'OK',
      badgeColor: 'bg-zinc-800/80 text-zinc-400 border-zinc-700',
      details: {
        title: 'Nonlinear Median Pre-Filter',
        badge: 'ACTIVE (WINDOW N=5)',
        description: 'Rejects extreme multi-path fast-fading impulsive spikes before parametric estimators without introducing exponential phase delay or group distortion.',
        metrics: [
          { label: 'Window Size', value: '5 samples' },
          { label: 'Phase Lag', value: '< 98 ms' },
          { label: 'Outlier Rejection', value: '99.2%' },
          { label: 'Noise Floor', value: '-88 dBm' }
        ]
      }
    },
    {
      id: 'nlos',
      title: 'NLOS Classifier',
      statusBadge: '1 Anomaly',
      badgeColor: 'bg-amber-950/70 text-amber-400 border-amber-600/50',
      details: {
        title: 'Deep Feature Reliability & NLOS Estimator',
        badge: 'ALERT: A3 DOWNWEIGHTED',
        description: 'Multi-layer feed-forward classifier computing channel dispersion, RSSI variance, loss rates, and predicted free-space path loss discrepancy to identify non-line-of-sight conditions.',
        metrics: [
          { label: 'Model Architecture', value: 'MLP (3-Layer ANN)' },
          { label: 'Inference Latency', value: '0.42 ms' },
          { label: 'Detected Obstacle', value: 'Concrete Pillar (A3)' },
          { label: 'Confidence Score', value: '98.2%' }
        ]
      }
    },
    {
      id: 'adaptive',
      title: 'Residual Weighting',
      statusBadge: 'Active',
      badgeColor: 'bg-zinc-800/80 text-zinc-400 border-zinc-700',
      details: {
        title: 'M-Estimation Residual Weighting',
        badge: 'HUBER LOSS FUNCTION',
        description: 'Dynamically scales anchor covariance weights in the trilateration objective function. Penalizes anchors exhibiting large negative residuals against the log-distance path loss model.',
        metrics: [
          { label: 'Weight A1, A2, A4', value: '1.00 (Nominal)' },
          { label: 'Weight A3', value: '0.18 (Penalized)' },
          { label: 'Robust Estimator', value: 'Gauss-Newton with M-Est' },
          { label: 'Cost Convergence', value: '4 Iterations' }
        ]
      }
    },
    {
      id: 'ekf',
      title: 'Kalman Filter',
      statusBadge: 'v3.2',
      badgeColor: 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40',
      details: {
        title: '6-State Kinematic Extended Kalman Filter',
        badge: 'CONVERGED (P < 0.25 m²)',
        description: 'Kinematic continuous-time transition model (x, y, vx, vy, ax, ay). Performs cyclic state prediction and Kalman innovation update using AI-weighted measurement matrices.',
        metrics: [
          { label: 'State Vector', value: '[x, y, vx, vy, ax, ay]ᵀ' },
          { label: 'Process Noise Q', value: '0.04 m²/s⁴' },
          { label: 'Covariance Ellipse', value: 'a=0.48m, b=0.32m' },
          { label: 'Innovation Residual', value: '0.14 m' }
        ]
      }
    },
    {
      id: 'covariance',
      title: '2D Covariance',
      statusBadge: 'LOCKED',
      badgeColor: 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40',
      details: {
        title: 'Posterior Error Matrix Validation',
        badge: 'SYSTEM STABLE',
        description: 'Verifies the 2-sigma boundary bounds (95.4% confidence) to guarantee spatial integrity for automated guided vehicles, asset tracking, and safety constraints.',
        metrics: [
          { label: 'Confidence Ellipse', value: '95.4% (2-Sigma)' },
          { label: 'Orientation θ', value: '34°' },
          { label: 'GDOP Factor', value: '1.42 (Optimal)' },
          { label: 'State Health', value: 'HEALTHY' }
        ]
      }
    }
  ];

  const currentDetail = stages.find((s) => s.id === selectedStage)?.details;

  return (
    <div className="bg-[#0b0e12] border border-[#1a212a] rounded px-2.5 py-1.5 select-none shadow-sm shrink-0">
      {/* Stages Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold shrink-0 mr-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>PIPELINE:</span>
        </div>

        <div className="grid grid-cols-6 gap-1.5 flex-1 min-w-[620px]">
          {stages.map((stage) => {
            const isSelected = selectedStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                className={`px-2 py-1 rounded border cursor-pointer transition-all flex items-center justify-between text-[10px] font-mono ${
                  isSelected
                    ? 'bg-[#131c24] border-[#10b981]'
                    : 'bg-[#0e1217] border-[#1a212a] hover:border-zinc-700'
                }`}
              >
                <span className="text-zinc-300 truncate">{stage.title}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded border shrink-0 ml-1 font-semibold ${stage.badgeColor}`}>
                  {stage.statusBadge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Breakdown Drawer if opened */}
      {currentDetail && (
        <div className="p-2 mt-1.5 rounded border border-[#10b981]/40 bg-[#090d11] text-xs font-mono space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1a212a] pb-1">
            <div className="flex items-center gap-2">
              <span className="text-[#10b981] font-bold text-xs uppercase">{currentDetail.title}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 font-semibold">
                {currentDetail.badge}
              </span>
            </div>
            <button
              onClick={() => setSelectedStage(null)}
              className="text-zinc-500 hover:text-zinc-300 text-[10px]"
            >
              [Close]
            </button>
          </div>

          <p className="text-zinc-300 text-[10px] leading-relaxed">
            {currentDetail.description}
          </p>

          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {currentDetail.metrics.map((m) => (
              <div key={m.label} className="p-1 rounded bg-[#0e1319] border border-[#1a212a]">
                <div className="text-[8px] uppercase tracking-wider text-zinc-500">{m.label}</div>
                <div className="text-[10px] font-bold text-zinc-200 mt-0.2">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
