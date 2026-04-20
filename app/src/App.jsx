import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameProvider, useGameState } from './hooks/useGameState';
import PresentationScreen from './components/PresentationScreen';
import GameOnboarding from './components/GameOnboarding';
import CoffeeScene from './three/CoffeeScene';
import DecisionOverlay from './components/DecisionOverlay';
import StatsDashboard from './components/StatsDashboard';
import SceneManager from './scenes/SceneManager';
import SummaryScreen from './components/SummaryScreen';

function AppContent() {
  const [mode, setMode] = useState('presentation'); // 'presentation' | 'onboarding' | 'game'
  const { state, sceneComplete } = useGameState();

  if (mode === 'presentation') {
    return <PresentationScreen onStartGame={() => setMode('onboarding')} />;
  }

  if (mode === 'onboarding') {
    return (
      <AnimatePresence>
        <GameOnboarding onReady={() => setMode('game')} />
      </AnimatePresence>
    );
  }

  return (
    <>
      {/* 3D Scene */}
      <div style={{
        opacity: (state.activeScene || state.isDecisionPending) ? 0.15 : 1,
        transition: 'opacity 0.6s',
      }}>
        <CoffeeScene />
      </div>

      {/* 2D Overlay Layer */}
      <div className="overlay-layer">
        <AnimatePresence>
          {state.isDecisionPending && (
            <DecisionOverlay key={`decision-${state.stage}`} />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {state.activeScene && (
            <SceneManager key="scene" onSceneComplete={sceneComplete} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.stage === 'summary' && !state.activeScene && (
            <SummaryScreen key="summary" />
          )}
        </AnimatePresence>
      </div>

      {/* Stats Dashboard — outside overlay-layer for proper z-index */}
      <StatsDashboard />
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
