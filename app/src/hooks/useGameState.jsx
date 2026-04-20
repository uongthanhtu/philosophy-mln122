import { createContext, useContext, useReducer, useCallback } from 'react';

const STAGE_ORDER = ['field', 'factory', 'market', 'summary'];

const initialState = {
  stage: 'field',
  stageIndex: 0,
  isDecisionPending: true,
  activeScene: null,
  decisions: { field: null, factory: null, market: null },
  stats: { quality: 50, value: 50, profit: 50 },
  beanVisuals: {
    color: '#2d5016',
    glowIntensity: 0,
    glowColor: '#4ade80',
    scale: 0.8,
    particleMode: 'idle',
    particleColor: '#4ade80',
    particleSpeed: 0.3,
    particleCount: 800,
  },
  cameraTarget: { distance: 6, y: 0 },
  background: 'dark',
};

function reducer(state, action) {
  switch (action.type) {
    case 'MAKE_DECISION': {
      const { stageId, optionId, effects, afterVisuals } = action;
      return {
        ...state,
        isDecisionPending: false,
        activeScene: optionId,
        decisions: { ...state.decisions, [stageId]: optionId },
        stats: {
          quality: Math.min(100, Math.max(0, state.stats.quality + effects.quality)),
          value: Math.min(100, Math.max(0, state.stats.value + effects.value)),
          profit: Math.min(100, Math.max(0, state.stats.profit + effects.profit)),
        },
        beanVisuals: afterVisuals
          ? { ...state.beanVisuals, ...afterVisuals }
          : state.beanVisuals,
      };
    }

    case 'SCENE_COMPLETE': {
      const nextIndex = state.stageIndex + 1;
      const nextStageId = STAGE_ORDER[nextIndex] || 'summary';
      const isSummary = nextStageId === 'summary';

      return {
        ...state,
        activeScene: null,
        stage: nextStageId,
        stageIndex: nextIndex,
        isDecisionPending: !isSummary,
      };
    }

    case 'UPDATE_VISUALS':
      return {
        ...state,
        beanVisuals: { ...state.beanVisuals, ...action.visuals },
        cameraTarget: action.camera || state.cameraTarget,
        background: action.background || state.background,
      };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const makeDecision = useCallback((stageId, optionId, effects, afterVisuals) =>
    dispatch({ type: 'MAKE_DECISION', stageId, optionId, effects, afterVisuals }), []);
  const sceneComplete = useCallback(() => dispatch({ type: 'SCENE_COMPLETE' }), []);
  const updateVisuals = useCallback((visuals, camera, background) =>
    dispatch({ type: 'UPDATE_VISUALS', visuals, camera, background }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <GameContext.Provider value={{
      state, makeDecision, sceneComplete, updateVisuals, reset,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameState must be inside GameProvider');
  return ctx;
}
