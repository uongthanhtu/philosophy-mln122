import { AnimatePresence } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import HandpickScene from './HandpickScene';
import MachineScene from './MachineScene';
import DryingScene from './DryingScene';
import FactoryScene from './FactoryScene';
import DiscountScene from './DiscountScene';
import CertificationScene from './CertificationScene';

/**
 * Routes to the correct interactive scene based on player choice.
 * Round 1: HandpickScene / MachineScene (harvest)
 * Round 2: DryingScene / FactoryScene (processing)
 * Round 3: DiscountScene / CertificationScene (market)
 */
const SCENE_MAP = {
  handpick: HandpickScene,
  machine: MachineScene,
  raw: DryingScene,
  deep: FactoryScene,
  discount: DiscountScene,
  green: CertificationScene,
};

export default function SceneManager({ onSceneComplete }) {
  const { state } = useGameState();

  if (!state.activeScene) return null;

  const SceneComponent = SCENE_MAP[state.activeScene];
  if (!SceneComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <SceneComponent key={state.activeScene} onComplete={onSceneComplete} />
    </AnimatePresence>
  );
}
