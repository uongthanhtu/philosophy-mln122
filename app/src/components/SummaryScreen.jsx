import { motion } from 'framer-motion';
import { useGameState } from '../hooks/useGameState';
import { calculatePrice } from '../data/timeline';

const CHOICES = {
  handpick: {
    label: 'Hái tay thủ công', icon: '🤲', theory: 'Lao động cụ thể', color: '#22c55e',
    short: 'Chọn lọc kỹ → chất lượng cao → giá trị sử dụng vượt trội.',
  },
  machine: {
    label: 'Máy hái công nghiệp', icon: '⚙️', theory: 'Năng suất lao động', color: '#f59e0b',
    short: 'Năng suất cao nhưng không chọn lọc → giá trị sử dụng giảm.',
  },
  raw: {
    label: 'Phơi khô (Bán thô)', icon: '☀️', theory: 'Lao động giản đơn', color: '#f59e0b',
    short: 'Lao động giản đơn → ít giá trị gia tăng → giá thấp.',
  },
  deep: {
    label: 'Chế biến sâu', icon: '☕', theory: 'Lao động phức tạp', color: '#22c55e',
    short: 'Lao động phức tạp = giản đơn × n → nhân bội giá trị.',
  },
  discount: {
    label: 'Giảm giá sốc', icon: '📉', theory: 'Giá cả < Giá trị', color: '#ef4444',
    short: 'Phá giá → lợi nhuận mỏng → tiềm ẩn khủng hoảng.',
  },
  green: {
    label: 'Chứng chỉ EUDR', icon: '🌿', theory: 'Giá trị sử dụng QT', color: '#22c55e',
    short: 'Đáp ứng tiêu chuẩn quốc tế → giá cả phản ánh đúng giá trị.',
  },
};

const STAGES = [
  { key: 'field', name: 'Sản xuất', num: '01' },
  { key: 'factory', name: 'Chế biến', num: '02' },
  { key: 'market', name: 'Thị trường', num: '03' },
];

function getResult(decisions) {
  const d = [decisions.field, decisions.factory, decisions.market];
  const good = d.filter(c => ['handpick', 'deep', 'green'].includes(c)).length;
  if (good === 3) return { title: 'Phát triển bền vững', emoji: '🏆', color: '#fbbf24', text: 'Tối ưu cả giá trị sử dụng lẫn giá trị — giá cả phản ánh đúng giá trị, lợi nhuận bền vững.' };
  if (good === 2) return { title: 'Khá tốt, còn thiếu sót', emoji: '⭐', color: '#22c55e', text: 'Hầu hết lựa chọn hợp lý, nhưng 1 khâu yếu có thể ảnh hưởng vị thế cạnh tranh dài hạn.' };
  if (good === 1) return { title: 'Cần cải thiện', emoji: '📊', color: '#60a5fa', text: 'Hao phí cá biệt cao + giá trị sử dụng chưa đáp ứng thị trường → lợi nhuận bị ảnh hưởng.' };
  return { title: 'Bài học đắt giá', emoji: '📉', color: '#f87171', text: 'Năng suất cao nhưng chất lượng thấp → chế biến thô → phá giá. Nguy cơ khủng hoảng tiềm ẩn.' };
}

export default function SummaryScreen() {
  const { state, reset } = useGameState();
  const { stats, decisions } = state;
  const price = calculatePrice(stats);
  const result = getResult(decisions);
  const totalScore = Math.round((stats.quality + stats.value + stats.profit) / 3);
  const grade = totalScore >= 80 ? 'S' : totalScore >= 65 ? 'A' : totalScore >= 50 ? 'B' : 'C';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="end-screen"
    >
      {/* ── TOP ROW: Grade + Price ── */}
      <motion.div
        className="end-top"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 15 }}
      >
        <motion.div
          className="end-grade"
          style={{ color: result.color, borderColor: result.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', damping: 8 }}
        >
          {grade}
        </motion.div>
        <div className="end-top-info">
          <div className="end-result-title">{result.emoji} {result.title}</div>
          <div className="end-price">
            {price.toLocaleString('vi-VN')} <span>VND/kg</span>
          </div>
        </div>
      </motion.div>

      {/* ── MIDDLE: 3 Journey Cards ── */}
      <div className="end-cards">
        {STAGES.map((stage, i) => {
          const choice = decisions[stage.key];
          const info = CHOICES[choice];
          if (!info) return null;
          return (
            <motion.div
              key={stage.key}
              className="end-card"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.15, type: 'spring', damping: 14 }}
            >
              <div className="end-card-head">
                <span className="end-card-num" style={{ background: info.color }}>{stage.num}</span>
                <span className="end-card-stage">{stage.name}</span>
              </div>
              <div className="end-card-choice">
                <span>{info.icon}</span> {info.label}
              </div>
              <div className="end-card-theory" style={{ color: info.color }}>{info.theory}</div>
              <p className="end-card-text">{info.short}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── BOTTOM: Conclusion + CTA ── */}
      <motion.div
        className="end-bottom"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="end-conclusion" style={{ borderColor: `${result.color}33` }}>
          <p className="end-conclusion-text">{result.text}</p>
          <div className="end-key">
            <strong>Quy luật cốt lõi:</strong> Giá trị = lao động xã hội kết tinh. Giá cả xoay quanh giá trị, chịu tác động cung - cầu.
          </div>
        </div>

        <motion.button
          className="end-restart"
          onClick={reset}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Thử lại với lựa chọn khác
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
