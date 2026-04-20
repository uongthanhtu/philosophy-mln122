import { motion } from 'framer-motion';

/**
 * Base layout for all interactive scenes.
 * Provides: background image, overlay, header, progress bar, content area, complete button
 */
export default function BaseScene({
  title, subtitle, backgroundImage, progress, maxProgress,
  onComplete, isComplete, children, progressLabel,
}) {
  const pct = Math.min((progress / maxProgress) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="scene-container"
    >
      {/* Background */}
      <div className="scene-bg" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="scene-bg-overlay" />

      {/* Header */}
      <div className="scene-header">
        <div className="scene-badge">{title}</div>
        <p className="scene-subtitle">{subtitle}</p>
      </div>

      {/* Progress bar */}
      <div className="scene-progress-wrap">
        <div className="scene-progress-bg">
          <motion.div
            className="scene-progress-fill"
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>
        <span className="scene-progress-label">
          {progressLabel || `${progress} / ${maxProgress}`}
        </span>
      </div>

      {/* Interactive area */}
      <div className="scene-content">{children}</div>

      {/* Complete button */}
      {isComplete && (
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="scene-complete-btn"
        >
          Tiếp tục hành trình →
        </motion.button>
      )}
    </motion.div>
  );
}
