import React from 'react';
import type { TargetState, AnchorData } from '../mockData';
import { ROOM_WIDTH, ROOM_HEIGHT, ROOM_OBSTACLES } from '../mockData';

interface CleanLocalizationMapProps {
  target: TargetState;
  anchors: AnchorData[];
  trail: { x: number; y: number }[];
}

export const CleanLocalizationMap: React.FC<CleanLocalizationMapProps> = ({
  target,
  anchors,
  trail
}) => {
  // Convert meters to SVG percentages
  const toSvgX = (x: number) => (x / ROOM_WIDTH) * 100;
  const toSvgY = (y: number) => (y / ROOM_HEIGHT) * 100;

  const targetX = toSvgX(target.x);
  const targetY = toSvgY(target.y);

  const rx = (target.covarianceA / ROOM_WIDTH) * 100;
  const ry = (target.covarianceB / ROOM_HEIGHT) * 100;

  // Heading vector tip
  const headingRad = (target.headingAngle * Math.PI) / 180;
  const arrowLen = 2.4; // %
  const dirX = targetX + Math.cos(headingRad) * arrowLen;
  const dirY = targetY - Math.sin(headingRad) * arrowLen;

  return (
    <div className="bg-[#0b0e12] border border-[#1a212a] rounded p-2 select-none flex flex-col justify-between shadow-sm shrink-0">
      {/* Header with Title and Minimal Legend */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1a212a]">
        <div>
          <span className="font-mono text-xs font-bold text-zinc-100 uppercase tracking-wide">
            2D Localization Map
          </span>
          <span className="text-[10px] font-mono text-zinc-500 ml-1.5">
            12.0m × 8.0m Floor Plan
          </span>
        </div>

        {/* Small clean legend */}
        <div className="flex items-center gap-2.5 font-mono text-[9px] text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>Target</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-[#121b22] border border-[#10b981]" />
            <span>Anchor (LOS)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-[#22160d] border border-amber-500" />
            <span className="text-amber-400/90">Degraded (NLOS)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-1 rounded border border-dashed border-[#10b981]/70" />
            <span>Uncertainty</span>
          </div>
        </div>
      </div>

      {/* Map Drawing Canvas: Strict height container (~270-300px) */}
      <div className="relative w-full h-[270px] lg:h-[285px] my-1 bg-[#080a0d] border border-[#161d26] rounded overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="cleanGrid" width="8.33" height="12.5" patternUnits="userSpaceOnUse">
              <path d="M 8.33 0 L 0 0 0 12.5" fill="none" stroke="#161e27" strokeWidth="0.35" />
            </pattern>
            <radialGradient id="targetCovGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          <rect width="100" height="100" fill="url(#cleanGrid)" />

          {/* Obstacles: Clean neutral grey rectangles */}
          {ROOM_OBSTACLES.map((obs) => {
            const ox = toSvgX(obs.x);
            const oy = toSvgY(obs.y);
            const ow = toSvgX(obs.w);
            const oh = toSvgY(obs.h);
            const isPillar = obs.id === 'pillar';

            return (
              <g key={obs.id}>
                <rect
                  x={ox}
                  y={oy}
                  width={ow}
                  height={oh}
                  fill="#11161d"
                  stroke={isPillar ? '#2c3540' : '#1e2632'}
                  strokeWidth="0.4"
                  rx="0.4"
                />
                <text
                  x={ox + ow / 2}
                  y={oy + oh / 2 + 0.6}
                  fill="#475569"
                  fontSize="1.6"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {obs.label}
                </text>
              </g>
            );
          })}

          {/* Measurement Vector Lines: Muted green for healthy, amber for degraded */}
          {anchors.map((anchor) => {
            if (anchor.disabled || anchor.status === 'OFFLINE') return null;
            const ax = toSvgX(anchor.x);
            const ay = toSvgY(anchor.y);
            const isDegraded = anchor.status === 'DEGRADED';

            return (
              <line
                key={`line-${anchor.id}`}
                x1={ax}
                y1={ay}
                x2={targetX}
                y2={targetY}
                stroke={isDegraded ? '#f59e0b' : '#10b981'}
                strokeWidth={isDegraded ? '0.45' : '0.35'}
                strokeDasharray={isDegraded ? '1.5,1.5' : undefined}
                opacity={isDegraded ? 0.75 : 0.4}
              />
            );
          })}

          {/* Recent Trajectory: Thin subtle green line */}
          {trail.length > 1 && (
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="0.5"
              strokeDasharray="1,1"
              opacity="0.65"
              points={trail.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ')}
            />
          )}

          {/* Uncertainty Ellipse */}
          <g transform={`rotate(${target.covarianceTheta} ${targetX} ${targetY})`}>
            <ellipse
              cx={targetX}
              cy={targetY}
              rx={rx}
              ry={ry}
              fill="url(#targetCovGlow)"
              stroke="#10b981"
              strokeWidth="0.45"
              strokeDasharray="1.5,1"
              opacity="0.8"
            />
          </g>

          {/* Target: Clearly visible green dot with heading direction indicator */}
          <g>
            {/* Direction pointer line */}
            <line
              x1={targetX}
              y1={targetY}
              x2={dirX}
              y2={dirY}
              stroke="#10b981"
              strokeWidth="0.6"
              strokeLinecap="round"
            />
            {/* Center target circle */}
            <circle cx={targetX} cy={targetY} r="1.3" fill="#10b981" />
            <circle cx={targetX} cy={targetY} r="0.5" fill="#ffffff" />
            <text
              x={targetX + 2.2}
              y={targetY + 0.8}
              fill="#e2e8f0"
              fontSize="2.0"
              fontFamily="monospace"
              fontWeight="bold"
            >
              TARGET
            </text>
          </g>

          {/* Fixed Anchors: A1, A2, A3, A4 */}
          {anchors.map((anchor) => {
            const ax = toSvgX(anchor.x);
            const ay = toSvgY(anchor.y);
            const isDegraded = anchor.status === 'DEGRADED';
            const isOffline = anchor.disabled || anchor.status === 'OFFLINE';

            return (
              <g key={anchor.id}>
                {/* Clean Anchor Square */}
                <rect
                  x={ax - 1.5}
                  y={ay - 1.5}
                  width="3.0"
                  height="3.0"
                  rx="0.4"
                  fill={isOffline ? '#181d24' : isDegraded ? '#26170d' : '#0c1a16'}
                  stroke={isOffline ? '#374151' : isDegraded ? '#f59e0b' : '#10b981'}
                  strokeWidth="0.5"
                />
                <circle
                  cx={ax}
                  cy={ay}
                  r="0.45"
                  fill={isOffline ? '#6b7280' : isDegraded ? '#fbbf24' : '#10b981'}
                />
                <text
                  x={ax > 50 ? ax - 2.8 : ax + 2.8}
                  y={ay + 0.8}
                  fill={isOffline ? '#6b7280' : isDegraded ? '#f59e0b' : '#cbd5e1'}
                  fontSize="2.2"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor={ax > 50 ? 'end' : 'start'}
                >
                  {anchor.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Compact Coordinate Overlay (Top-Right) */}
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#090c0f]/90 border border-[#1a212a] rounded font-mono text-[9px] text-zinc-300">
          <span>X: <strong className="text-[#10b981]">{target.x.toFixed(2)}m</strong></span>
          <span className="mx-1 text-zinc-600">|</span>
          <span>Y: <strong className="text-[#10b981]">{target.y.toFixed(2)}m</strong></span>
        </div>

        {/* Subtle Scale Indicator (Bottom-Right) */}
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1 py-0.5 bg-[#090c0f]/80 border border-[#1a212a] rounded font-mono text-[8px] text-zinc-500">
          <span>0</span>
          <span className="w-4 h-[1px] bg-zinc-600 inline-block" />
          <span>2.0 m</span>
        </div>
      </div>
    </div>
  );
};
