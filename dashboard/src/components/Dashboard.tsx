import React, { useState } from 'react';
import type { AnchorData, TargetState, ScenarioType } from '../mockData';
import {
  BASE_ANCHORS,
  BASE_TARGET,
  INITIAL_TRAIL,
  GENERATE_RSSI_SERIES
} from '../mockData';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { PipelineBanner } from './PipelineBanner';
import { MetricBanner } from './MetricBanner';
import { CleanLocalizationMap } from './CleanLocalizationMap';
import { SignalStrengthGraph } from './SignalStrengthGraph';
import { CompactAnchorList } from './CompactAnchorList';
import { PositionConfidencePanel } from './PositionConfidencePanel';
import { TestScenariosPanel } from './TestScenariosPanel';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('live');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('NLOS');

  // Derive dynamic state based on active scenario
  let currentAnchors: AnchorData[] = BASE_ANCHORS.map((a) => ({ ...a }));
  let currentTarget: TargetState = { ...BASE_TARGET };
  let confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
  let shortExplanation = 'Anchor A3 downweighted due to inconsistent RSSI measurements.';
  let statusLine = 'NLOS simulated at A3 · Weight reduced';
  let hasObstructionZone = true;

  if (activeScenario === 'NORMAL') {
    currentAnchors = currentAnchors.map((a) => {
      if (a.id === 'A3') {
        return {
          ...a,
          rssi: -57,
          loss: 0.6,
          variance: 1.9,
          nlosProb: 6,
          weight: 1.0,
          status: 'HEALTHY' as const,
          residual: -0.4,
          expectedRssi: -56.6
        };
      }
      return a;
    });
    currentTarget = {
      ...currentTarget,
      covarianceA: 0.28,
      covarianceB: 0.20,
      covarianceTheta: 15,
      uncertaintyFormatted: '±0.28 m',
      solverState: 'EKF NOMINAL-LOCK',
      residualNorm: 0.03
    };
    confidenceLevel = 'HIGH';
    shortExplanation = 'All 4 anchors reporting consistent line-of-sight signal profiles.';
    statusLine = 'Nominal tracking active · All 4 anchors contributing at full weight';
    hasObstructionZone = false;
  } else if (activeScenario === 'NLOS') {
    currentTarget = {
      ...currentTarget,
      covarianceA: 0.48,
      covarianceB: 0.32,
      covarianceTheta: 34,
      uncertaintyFormatted: '±0.48 m',
      solverState: 'EKF MEAS-SUPPORTED',
      residualNorm: 0.08
    };
    confidenceLevel = 'MODERATE';
    shortExplanation = 'Anchor A3 downweighted due to inconsistent RSSI measurements.';
    statusLine = 'NLOS obstruction simulated at A3 · Measurement weight reduced';
    hasObstructionZone = true;
  } else if (activeScenario === 'OFFLINE') {
    currentAnchors = currentAnchors.map((a) => {
      if (a.id === 'A2') {
        return {
          ...a,
          rssi: -95,
          loss: 100,
          variance: 0,
          nlosProb: 0,
          weight: 0,
          status: 'OFFLINE' as const,
          disabled: true
        };
      }
      return a;
    });
    currentTarget = {
      ...currentTarget,
      covarianceA: 0.82,
      covarianceB: 0.52,
      covarianceTheta: 45,
      uncertaintyFormatted: '±0.78 m',
      solverState: '3-ANCHOR DEGRADED SOLVE',
      residualNorm: 0.19
    };
    confidenceLevel = 'MODERATE';
    shortExplanation = 'Anchor A2 offline. System operating on 3-anchor minimum solve.';
    statusLine = 'Anchor A2 simulated offline · Covariance bounds expanded';
    hasObstructionZone = false;
  } else if (activeScenario === 'NOISY') {
    currentAnchors = currentAnchors.map((a) => ({
      ...a,
      variance: Number((a.variance * 2.5).toFixed(1)),
      loss: Number((a.loss + 3.2).toFixed(1))
    }));
    currentTarget = {
      ...currentTarget,
      covarianceA: 0.65,
      covarianceB: 0.45,
      uncertaintyFormatted: '±0.62 m',
      solverState: 'MEDIAN FILTER STRESSED',
      residualNorm: 0.16
    };
    confidenceLevel = 'LOW';
    shortExplanation = 'High variance detected across channels. Non-linear median filter rejecting spikes.';
    statusLine = 'Gaussian noise injected · Outlier rejection active';
    hasObstructionZone = false;
  }

  const activeAnchorsCount = currentAnchors.filter(
    (a) => !a.disabled && a.status !== 'OFFLINE' && a.weight > 0.3
  ).length;

  const rssiSeries = GENERATE_RSSI_SERIES(activeScenario);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07090b] text-zinc-200 antialiased font-sans">
      {/* 1. Left Collapsible Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        firmware="v2.4.1-rc3"
        ekfModel="Const-Vel 2D"
        gateway="GW-LAB-01 [OK]"
      />

      {/* 2. Main Dashboard (Strict viewport height, no global scrolling at 1440x900) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Status Bar (h-9) */}
        <TopBar
          labSector="LAB / WAREHOUSE DEMO - SECTOR 4"
          ekfVersion="EKF v3.2"
          ekfStatus="CONVERGED"
          targetTag="Target-01 (BLE 5.2 @ 10Hz)"
          latencyUtc="0.04s ago (14:32:08.412 UTC)"
          liveRate="LIVE 10Hz"
        />

        {/* Dashboard Content Container with tight spacing (p-2.5 space-y-2) */}
        <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between overflow-y-auto lg:overflow-hidden max-w-[1920px] w-full mx-auto">
          {/* Top Section A: Localization Pipeline Status */}
          <PipelineBanner />

          {/* Top Section B: Position and Velocity Metric Cards */}
          <MetricBanner target={currentTarget} />

          {/* Lower Two-Column Layout (fits directly on screen) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 flex-1 min-h-0">
            {/* LEFT COLUMN: ~64% width */}
            <div className="lg:col-span-8 flex flex-col gap-2 justify-between min-h-0">
              {/* 1. Compact 2D Localization Map */}
              <CleanLocalizationMap
                target={currentTarget}
                anchors={currentAnchors}
                trail={INITIAL_TRAIL}
              />

              {/* 2. Signal Strength Graph (always visible directly beneath map) */}
              <SignalStrengthGraph
                data={rssiSeries}
                anchors={currentAnchors}
                hasObstructionZone={hasObstructionZone}
              />
            </div>

            {/* RIGHT COLUMN: ~36% width */}
            <div className="lg:col-span-4 flex flex-col gap-2 justify-between min-h-0">
              {/* 1. Compact Anchor Health */}
              <CompactAnchorList anchors={currentAnchors} />

              {/* 2. Position Confidence */}
              <PositionConfidencePanel
                confidenceLevel={confidenceLevel}
                activeCount={activeAnchorsCount}
                totalCount={4}
                shortExplanation={shortExplanation}
                uncertaintyFormatted={currentTarget.uncertaintyFormatted}
                details={{
                  gdop: currentTarget.gdop,
                  weightedResid: `${currentTarget.residualNorm} m`,
                  filterMode: currentTarget.solverState,
                  modelNotes: 'Weights dynamically computed via M-estimation to prevent error propagation into the Extended Kalman Filter.'
                }}
              />

              {/* 3. Test Scenarios Panel */}
              <TestScenariosPanel
                activeScenario={activeScenario}
                onSelectScenario={setActiveScenario}
                statusLine={statusLine}
                onReset={() => setActiveScenario('NORMAL')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
