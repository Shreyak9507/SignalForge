import React from 'react';
import { RotateCcw } from 'lucide-react';
import type { ScenarioType } from '../mockData';

interface TestScenariosPanelProps {
  activeScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
  statusLine: string;
  onReset: () => void;
}

export const TestScenariosPanel: React.FC<TestScenariosPanelProps> = ({
  activeScenario,
  onSelectScenario,
  statusLine,
  onReset
}) => {
  const options: { id: ScenarioType; label: string }[] = [
    { id: 'NORMAL', label: 'Normal' },
    { id: 'NLOS', label: 'NLOS' },
    { id: 'OFFLINE', label: 'Anchor Offline' },
    { id: 'NOISY', label: 'Noisy RSSI' }
  ];

  return (
    <div className="bg-[#0b0e12] border border-[#1a212a] rounded p-2.5 select-none shadow-sm flex flex-col justify-between font-mono">
      {/* Header with Title and Reset Control */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1a212a]">
        <span className="text-xs font-bold text-zinc-100 uppercase tracking-wide">
          Test Scenarios
        </span>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[9px] text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Reset to Normal"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 4 Small Buttons */}
      <div className="grid grid-cols-2 gap-1 py-1.5">
        {options.map((opt) => {
          const isSelected = activeScenario === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectScenario(opt.id)}
              className={`px-1.5 py-1 rounded text-[10px] font-semibold border transition-all text-center truncate ${
                isSelected
                  ? opt.id === 'NORMAL'
                    ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]'
                    : 'bg-amber-950/30 text-amber-300 border-amber-500'
                  : 'bg-[#0e1217] text-zinc-400 border-[#1a212a] hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Short Status Line */}
      <div className="pt-1 border-t border-[#1a212a] text-[9px] text-zinc-400 leading-snug">
        <span className="text-zinc-500 mr-1 font-bold">STATUS:</span>
        <span className={activeScenario === 'NORMAL' ? 'text-zinc-300' : 'text-amber-300/90'}>
          {statusLine}
        </span>
      </div>
    </div>
  );
};
