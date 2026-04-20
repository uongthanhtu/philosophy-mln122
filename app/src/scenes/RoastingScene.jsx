import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import BaseScene from './BaseScene';

const REQUIRED_TIME = 15; // seconds in optimal zone
const OPTIMAL_MIN = 190;
const OPTIMAL_MAX = 230;
const BURN_TEMP = 245;

export default function RoastingScene({ onComplete }) {
  const containerRef = useRef(null);
  const [mouseY, setMouseY] = useState(0.5); // 0=top=hot, 1=bottom=cold
  const [temp, setTemp] = useState(150);
  const [optimalTime, setOptimalTime] = useState(0);
  const [beanColor, setBeanColor] = useState('#8B7355');
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);

  // Mouse Y tracking
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relY = (e.clientY - rect.top) / rect.height;
    setMouseY(Math.max(0, Math.min(1, relY)));
  }, []);

  const handleTouchMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relY = (e.touches[0].clientY - rect.top) / rect.height;
    setMouseY(Math.max(0, Math.min(1, relY)));
  }, []);

  // Game loop
  useEffect(() => {
    if (optimalTime >= REQUIRED_TIME) return;
    timerRef.current = setInterval(() => {
      // Temperature = inverse of mouseY (top = hot, bottom = cold)
      const targetTemp = 100 + (1 - mouseY) * 200; // 100-300°C range
      setTemp(prev => {
        const next = prev + (targetTemp - prev) * 0.08;
        const t = Math.round(next);

        // Update bean color
        if (t < 180) setBeanColor('#8B7355');
        else if (t < 200) setBeanColor('#6B4226');
        else if (t < 220) setBeanColor('#4A2C17');
        else if (t < 240) setBeanColor('#2C1810');
        else setBeanColor('#1a0a00');

        // Check optimal zone
        if (t >= OPTIMAL_MIN && t <= OPTIMAL_MAX) {
          setOptimalTime(prev => Math.min(REQUIRED_TIME, prev + 0.1));
        }

        // Smoke particles
        if (t > 170 && Math.random() < 0.25) {
          setParticles(p => [...p.slice(-6), {
            id: Date.now() + Math.random(),
            x: 40 + Math.random() * 20,
            size: 8 + Math.random() * 16,
          }]);
        }

        return t;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [mouseY, optimalTime]);

  const isOptimal = temp >= OPTIMAL_MIN && temp <= OPTIMAL_MAX;
  const isBurning = temp > BURN_TEMP;
  const tempPct = Math.min(((temp - 100) / 200) * 100, 100);

  // Zones for the thermometer bar
  const optZoneStart = ((OPTIMAL_MIN - 100) / 200) * 100;
  const optZoneH = ((OPTIMAL_MAX - OPTIMAL_MIN) / 200) * 100;

  return (
    <BaseScene
      title="Rang Cà phê"
      subtitle="Di chuyển chuột lên/xuống để điều chỉnh nhiệt — Giữ trong vùng xanh!"
      backgroundImage="/assets/pres_theory.webp"
      progress={optimalTime}
      maxProgress={REQUIRED_TIME}
      progressLabel={`Thời gian rang tối ưu: ${Math.round(optimalTime)}/${REQUIRED_TIME}s | ${temp}°C`}
      isComplete={optimalTime >= REQUIRED_TIME}
      onComplete={onComplete}
    >
      <div
        ref={containerRef}
        className="roast-field"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Fire indicator at bottom — intensity follows mouse */}
        <div className="roast-fire-zone">
          <motion.div
            className="roast-fire"
            animate={{
              height: `${(1 - mouseY) * 100}%`,
              opacity: 0.3 + (1 - mouseY) * 0.7,
            }}
            transition={{ type: 'spring', damping: 20 }}
          />
        </div>

        {/* Roaster drum center */}
        <div className="roast-drum-wrap">
          <motion.div
            className="roast-drum"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="roast-beans" style={{ backgroundColor: beanColor }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="roast-bean-dot" style={{
                  backgroundColor: beanColor,
                  transform: `rotate(${i * 60}deg) translateY(-18px)`,
                }} />
              ))}
            </div>
          </motion.div>

          {/* Smoke particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="roast-smoke"
              style={{ left: `${p.x}%` }}
              initial={{ opacity: 0.5, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -80, scale: 2 }}
              transition={{ duration: 1.5 }}
            />
          ))}
        </div>

        {/* Thermometer bar (vertical, left side) */}
        <div className="roast-thermo">
          <div className="roast-thermo-track">
            {/* Optimal zone highlight */}
            <div className="roast-thermo-zone" style={{
              bottom: `${optZoneStart}%`,
              height: `${optZoneH}%`,
            }} />
            {/* Fill */}
            <motion.div
              className={`roast-thermo-fill ${isOptimal ? 'optimal' : isBurning ? 'burning' : ''}`}
              animate={{ height: `${tempPct}%` }}
              transition={{ type: 'spring', damping: 20 }}
            />
          </div>
          <div className="roast-thermo-label">{temp}°C</div>
          <div className="roast-thermo-range">
            <span>300°</span>
            <span>100°</span>
          </div>
        </div>

        {/* Mouse guide line */}
        <motion.div
          className="roast-cursor-line"
          animate={{ top: `${mouseY * 100}%` }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        />

        {/* Status */}
        <div className={`roast-status ${isOptimal ? 'optimal' : isBurning ? 'burning' : 'cold'}`}>
          {isOptimal ? 'Đang rang tối ưu!' : isBurning ? 'Quá nóng! Hạ chuột xuống!' : 'Chưa đủ nhiệt — đưa chuột lên!'}
        </div>
      </div>
    </BaseScene>
  );
}
