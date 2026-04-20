import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { TIMELINE_CONFIG } from '../data/timeline';

export default function DecisionOverlay() {
  const { state, makeDecision } = useGameState();

  if (!state.isDecisionPending) return null;

  const stage = TIMELINE_CONFIG.stages.find(s => s.id === state.stage);
  if (!stage || !stage.decision) return null;

  const { question, subtitle, optionA, optionB } = stage.decision;
  const afterVisuals = stage.visualsAfterDecision;

  const handleChoice = (option) => {
    const vis = afterVisuals?.[option.id] || {};
    makeDecision(stage.id, option.id, option.effects, {
      color: vis.beanColor,
      glowIntensity: vis.glowIntensity,
      glowColor: vis.glowColor,
      particleColor: vis.particleColor,
      particleSpeed: vis.particleSpeed,
      particleCount: vis.particleCount,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="decision-overlay"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring', damping: 20 }}
        className="decision-container"
      >
        <div className="decision-header">
          <div className="decision-badge">{stage.title}</div>
          <h2 className="decision-question">{question}</h2>
          <p className="decision-subtitle">{subtitle}</p>
        </div>

        <div className="decision-options">
          <OptionCard option={optionA} label="A" onClick={() => handleChoice(optionA)} delay={0.4} />
          <div className="decision-vs">VS</div>
          <OptionCard option={optionB} label="B" onClick={() => handleChoice(optionB)} delay={0.5} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function OptionCard({ option, label, onClick, delay }) {
  return (
    <motion.button
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', damping: 18 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="option-card"
    >
      <div className="option-image-wrap">
        <img src={option.image} alt={option.label} className="option-image" />
        <div className="option-label-badge">Option {label}</div>
      </div>
      <div className="option-body">
        <div className="option-icon">{option.icon}</div>
        <h3 className="option-title">{option.label}</h3>
        <p className="option-desc">{option.description}</p>
        <div className="option-effects">
          <EffectTag label="Chất lượng" value={option.effects.quality} />
          <EffectTag label="Giá trị" value={option.effects.value} />
          <EffectTag label="Lợi nhuận" value={option.effects.profit} />
        </div>
      </div>
    </motion.button>
  );
}

function EffectTag({ label, value }) {
  const isPositive = value > 0;
  return (
    <span className={`effect-tag ${isPositive ? 'positive' : 'negative'}`}>
      {label} {isPositive ? '+' : ''}{value}
    </span>
  );
}
