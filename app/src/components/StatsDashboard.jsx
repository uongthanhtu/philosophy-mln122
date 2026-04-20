import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { calculatePrice, TIMELINE_CONFIG } from '../data/timeline';

export default function StatsDashboard() {
  const { state } = useGameState();
  const { stats, stage } = state;

  // Hide during: intro, summary, and decision overlays
  if (state.showIntro || state.stage === 'summary' || state.isDecisionPending) return null;

  const currentStage = TIMELINE_CONFIG.stages.find(s => s.id === stage);
  const price = calculatePrice(stats);

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
      className="stats-dashboard"
    >
      {/* Stage indicator */}
      <div className="stats-stage">
        <div className="stats-stage-label">{currentStage?.title || stage}</div>
        <div className="stats-stage-concept">{currentStage?.concept}</div>
      </div>

      {/* Stat bars */}
      <div className="stats-bars">
        <StatBar label="Chất lượng" value={stats.quality} color="#22c55e" icon="🌿" />
        <StatBar label="Giá trị" value={stats.value} color="#f59e0b" icon="💎" />
        <StatBar label="Lợi nhuận" value={stats.profit} color="#ef4444" icon="💰" />
      </div>

      {/* Price display */}
      <div className="stats-price">
        <div className="stats-price-label">Giá trị hàng hóa</div>
        <motion.div
          className="stats-price-value"
          key={price}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
        >
          {price.toLocaleString('vi-VN')} <span className="stats-price-unit">VND/kg</span>
        </motion.div>
      </div>

      {/* Decisions made */}
      <div className="stats-decisions">
        <DecisionBadge label="Sản xuất" value={state.decisions.field} />
        <DecisionBadge label="Chế biến" value={state.decisions.factory} />
        <DecisionBadge label="Thị trường" value={state.decisions.market} />
      </div>
    </motion.div>
  );
}

function StatBar({ label, value, color, icon }) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-header">
        <span className="stat-bar-icon">{icon}</span>
        <span className="stat-bar-label">{label}</span>
        <motion.span
          className="stat-bar-value"
          key={value}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 8 }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="stat-bar-bg">
        <motion.div
          className="stat-bar-fill"
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, type: 'spring', damping: 15 }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function DecisionBadge({ label, value }) {
  const names = {
    handpick: 'Hái tay', machine: 'Máy hái',
    raw: 'Bán thô', deep: 'Chế biến sâu',
    discount: 'Giảm giá', green: 'Chứng chỉ xanh',
  };

  return (
    <div className={`decision-badge-mini ${value ? 'decided' : ''}`}>
      <span className="badge-label">{label}</span>
      <span className="badge-value">{value ? names[value] : '—'}</span>
    </div>
  );
}
