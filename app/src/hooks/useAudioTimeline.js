import { useRef, useCallback, useEffect } from 'react';
import { TIMELINE_CONFIG, getCurrentStage } from '../data/timeline';
import { useGameState } from './useGameState';

/**
 * Hook quản lý audio timeline + mock timer
 * Khi chưa có file audio thật, dùng setInterval đếm giây
 * Khi có audio, chỉ cần set audioSrc
 */
export function useAudioTimeline(audioSrc = null) {
  const { state, setTime, setStage, pauseForDecision, updateVisuals } = useGameState();
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const lastStageRef = useRef('intro');
  const decisionTriggeredRef = useRef(new Set());

  const tick = useCallback((currentTime) => {
    setTime(currentTime);
    const stage = getCurrentStage(currentTime, TIMELINE_CONFIG.stages);

    if (stage.id !== lastStageRef.current) {
      lastStageRef.current = stage.id;
      setStage(stage.id);
      updateVisuals(
        {
          color: stage.visuals.beanColor,
          glowIntensity: stage.visuals.glowIntensity,
          glowColor: stage.visuals.glowColor,
          scale: stage.visuals.beanScale,
          particleMode: stage.visuals.particleMode,
          particleColor: stage.visuals.particleColor,
          particleSpeed: stage.visuals.particleSpeed,
          particleCount: stage.visuals.particleCount,
        },
        { distance: stage.visuals.cameraDistance, y: stage.visuals.cameraY },
        stage.visuals.background
      );
    }

    // Check decision points
    if (stage.decisionTime !== null && !decisionTriggeredRef.current.has(stage.id)) {
      if (currentTime >= stage.decisionTime) {
        decisionTriggeredRef.current.add(stage.id);
        pauseForDecision();
        // Pause audio or timer
        if (audioRef.current) {
          audioRef.current.pause();
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  }, [setTime, setStage, pauseForDecision, updateVisuals]);

  // Start playback (mock timer or real audio)
  const play = useCallback(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play();
    } else {
      // Mock timer: increment every 100ms
      if (timerRef.current) return;
      const startOffset = state.currentTime;
      const startMs = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startMs) / 1000;
        const t = startOffset + elapsed;
        if (t >= TIMELINE_CONFIG.totalDuration) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          tick(TIMELINE_CONFIG.totalDuration);
          return;
        }
        tick(t);
      }, 100);
    }
  }, [audioSrc, state.currentTime, tick]);

  // Resume after decision
  const resume = useCallback(() => {
    play();
  }, [play]);

  // Pause
  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Audio timeupdate listener
  useEffect(() => {
    if (!audioSrc || !audioRef.current) return;
    const audio = audioRef.current;
    const onTimeUpdate = () => tick(audio.currentTime);
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [audioSrc, tick]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Watch isPlaying state changes
  useEffect(() => {
    if (state.isPlaying && !state.isDecisionPending) {
      play();
    } else {
      pause();
    }
  }, [state.isPlaying, state.isDecisionPending]);

  return { audioRef, play, pause, resume };
}
