export interface AnchorData {
  id: string;
  name: string;
  posLabel: string;
  x: number; // meters
  y: number; // meters
  rssi: number; // dBm
  loss: number; // %
  variance: number; // dB²
  nlosProb: number; // %
  weight: number; // [0, 1]
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  residual: number; // dB
  expectedRssi: number; // dBm
  disabled?: boolean;
}

export interface TargetState {
  x: number;
  y: number;
  velocity: number; // m/s
  headingAngle: number; // deg
  covarianceA: number; // major radius in meters
  covarianceB: number; // minor radius in meters
  covarianceTheta: number; // deg
  uncertaintyFormatted: string; // e.g. "±0.48 m"
  updateFreq: number; // Hz
  jitter: number; // ms
  solverState: string;
  gdop: number;
  residualNorm: number;
}

export interface RssiPoint {
  time: string;
  A1: number;
  A2: number;
  A3: number;
  A4: number;
}

export type ScenarioType = 'NORMAL' | 'NLOS' | 'OFFLINE' | 'NOISY';

export const ROOM_WIDTH = 12.0; // meters
export const ROOM_HEIGHT = 8.0; // meters

export const ROOM_OBSTACLES = [
  { id: 'rack-1', label: 'RACK A', x: 3.2, y: 0.6, w: 2.2, h: 1.0 },
  { id: 'rack-2', label: 'RACK B', x: 8.2, y: 0.6, w: 2.2, h: 1.0 },
  { id: 'pillar', label: 'PILLAR', x: 7.0, y: 4.8, w: 1.4, h: 1.2 }
];

export const INITIAL_TRAIL = [
  { x: 1.8, y: 2.2 },
  { x: 2.4, y: 2.4 },
  { x: 3.0, y: 2.8 },
  { x: 3.6, y: 3.0 },
  { x: 4.0, y: 2.9 },
  { x: 4.25, y: 2.80 }
];

export const BASE_ANCHORS: AnchorData[] = [
  {
    id: 'A1',
    name: 'Anchor 01',
    posLabel: 'NW · 1.0m, 1.0m',
    x: 1.0,
    y: 1.0,
    rssi: -48,
    loss: 0.2,
    variance: 1.8,
    nlosProb: 4,
    weight: 1.0,
    status: 'HEALTHY',
    residual: -0.8,
    expectedRssi: -47.2
  },
  {
    id: 'A2',
    name: 'Anchor 02',
    posLabel: 'NE · 11.0m, 1.0m',
    x: 11.0,
    y: 1.0,
    rssi: -56,
    loss: 0.8,
    variance: 2.4,
    nlosProb: 6,
    weight: 1.0,
    status: 'HEALTHY',
    residual: -1.2,
    expectedRssi: -54.8
  },
  {
    id: 'A3',
    name: 'Anchor 03',
    posLabel: 'SE · 11.0m, 7.0m',
    x: 11.0,
    y: 7.0,
    rssi: -74,
    loss: 8.4,
    variance: 11.6,
    nlosProb: 88,
    weight: 0.18,
    status: 'DEGRADED',
    residual: -18.0,
    expectedRssi: -56.0
  },
  {
    id: 'A4',
    name: 'Anchor 04',
    posLabel: 'SW · 1.0m, 7.0m',
    x: 1.0,
    y: 7.0,
    rssi: -61,
    loss: 1.1,
    variance: 3.1,
    nlosProb: 12,
    weight: 0.95,
    status: 'HEALTHY',
    residual: 1.4,
    expectedRssi: -62.4
  }
];

export const BASE_TARGET: TargetState = {
  x: 4.25,
  y: 2.80,
  velocity: 0.42,
  headingAngle: 128,
  covarianceA: 0.48,
  covarianceB: 0.32,
  covarianceTheta: 34,
  uncertaintyFormatted: '±0.48 m',
  updateFreq: 10.2,
  jitter: 4.1,
  solverState: 'EKF MEAS-SUPPORTED',
  gdop: 1.42,
  residualNorm: 0.08
};

// 60-second time series with degradation zone
export const GENERATE_RSSI_SERIES = (scenario: ScenarioType): RssiPoint[] => {
  const times = ['-60s', '-50s', '-40s', '-30s', '-25s', '-20s', '-15s', '-10s', '-5s', 'Now'];
  return times.map((t, idx) => {
    let a1 = -48 + Math.sin(idx * 0.4) * 0.8;
    let a2 = -56 + Math.cos(idx * 0.3) * 0.9;
    let a3 = -58 + Math.sin(idx * 0.5) * 1.0;
    let a4 = -61 + Math.cos(idx * 0.6) * 0.8;

    if (scenario === 'NLOS') {
      // In NLOS, A3 drops severely after -30s
      if (idx >= 4) {
        a3 = -74 - Math.sin(idx * 0.8) * 3.2;
      }
    } else if (scenario === 'NORMAL') {
      a3 = -57 + Math.sin(idx * 0.4) * 1.0;
    } else if (scenario === 'OFFLINE') {
      if (idx >= 5) {
        a2 = -95;
      }
    } else if (scenario === 'NOISY') {
      a1 += (Math.random() - 0.5) * 7.0;
      a2 += (Math.random() - 0.5) * 8.0;
      a3 += (Math.random() - 0.5) * 9.0;
      a4 += (Math.random() - 0.5) * 7.5;
    }

    return {
      time: t,
      A1: Number(a1.toFixed(1)),
      A2: Number(a2.toFixed(1)),
      A3: Number(a3.toFixed(1)),
      A4: Number(a4.toFixed(1))
    };
  });
};
