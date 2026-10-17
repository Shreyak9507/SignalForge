import React from 'react';
import type { RssiPoint, AnchorData } from '../mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

interface SignalStrengthGraphProps {
  data: RssiPoint[];
  anchors: AnchorData[];
  hasObstructionZone: boolean;
}

export const SignalStrengthGraph: React.FC<SignalStrengthGraphProps> = ({
  data,
  anchors,
  hasObstructionZone
}) => {
  const colors: Record<string, string> = {
    A1: '#10b981',
    A2: '#38bdf8',
    A3: '#f59e0b',
    A4: '#94a3b8'
  };

  const getRssi = (id: string) => {
    const a = anchors.find((anc) => anc.id === id);
    if (!a || a.disabled) return '---';
    return `${a.rssi} dBm`;
  };

  return (
    <div className="bg-[#0b0e12] border border-[#1a212a] rounded p-2 select-none flex flex-col justify-between shadow-sm shrink-0">
      {/* Header with Title and Current RSSI Readings */}
      <div className="flex items-center justify-between pb-1 border-b border-[#1a212a]">
        <div>
          <span className="font-mono text-xs font-bold text-zinc-100 uppercase tracking-wide">
            Signal Strength · Last 60 Seconds
          </span>
          <span className="text-[10px] font-mono text-zinc-500 ml-1.5">
            Multi-Anchor RSSI (dBm)
          </span>
        </div>

        {/* Compact Legend with Live Values */}
        <div className="flex items-center gap-2.5 font-mono text-[9px]">
          {(['A1', 'A2', 'A3', 'A4'] as const).map((id) => (
            <div key={id} className="flex items-center gap-1">
              <span
                className="w-2 h-0.5 inline-block"
                style={{ backgroundColor: colors[id] }}
              />
              <span className="text-zinc-400 font-semibold">{id}:</span>
              <span style={{ color: colors[id] }}>{getRssi(id)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target height ~155px to fit 1440x900 viewport without scrolling */}
      <div className="relative w-full h-[155px] pt-1">
        {hasObstructionZone && (
          <div className="absolute top-1.5 right-6 z-10 text-[8px] font-mono text-amber-400/90 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-600/30 pointer-events-none">
            Obstruction Region
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 10, left: -22, bottom: 0 }}>
            <XAxis
              dataKey="time"
              stroke="#475569"
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: '#1a212a' }}
              fontFamily="monospace"
            />
            <YAxis
              domain={[-90, -40]}
              stroke="#475569"
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: '#1a212a' }}
              fontFamily="monospace"
              unit="dBm"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#090c0f] border border-[#1a212a] p-1.5 rounded text-xs font-mono shadow-md">
                      <div className="text-zinc-400 border-b border-[#1a212a] pb-0.5 mb-1 font-semibold text-[10px]">
                        Offset: {label}
                      </div>
                      {payload.map((entry: any) => (
                        <div
                          key={entry.dataKey}
                          className="flex justify-between gap-2.5 text-[9px]"
                          style={{ color: entry.color }}
                        >
                          <span>{entry.dataKey}:</span>
                          <span className="font-semibold">{entry.value} dBm</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Subtle shaded obstruction zone where applicable */}
            {hasObstructionZone && (
              <ReferenceArea
                x1="-30s"
                x2="Now"
                fill="#f59e0b"
                fillOpacity={0.06}
                strokeOpacity={0.2}
              />
            )}

            {/* Anchor traces */}
            <Line
              type="monotone"
              dataKey="A1"
              stroke={colors.A1}
              strokeWidth={1.3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="A2"
              stroke={colors.A2}
              strokeWidth={1.3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="A3"
              stroke={colors.A3}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="A4"
              stroke={colors.A4}
              strokeWidth={1.3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
