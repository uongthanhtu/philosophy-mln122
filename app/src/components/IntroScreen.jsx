import { motion } from 'framer-motion';

export default function IntroScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="intro-screen"
    >
      <div className="intro-content">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="intro-badge"
        >
          Kinh tế Chính trị Mác – Lênin • Chương 2
        </motion.div>

        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="intro-title"
        >
          Hành trình<br />
          <span className="intro-highlight">Hạt Cà Phê</span>
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="intro-subtitle"
        >
          Từ Ruộng đồng đến Tiêu dùng —<br />
          Phân tích dưới góc độ Lý luận Hàng hóa
        </motion.p>

        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(251,191,36,0.4)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="intro-btn"
        >
          <span className="intro-btn-icon">☕</span>
          Bắt đầu Hành trình
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="intro-hint"
        >
          Nhấn để bắt đầu trải nghiệm tương tác
        </motion.div>
      </div>
    </motion.div>
  );
}
