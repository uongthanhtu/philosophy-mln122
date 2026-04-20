import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseScene from './BaseScene';

/**
 * StoryScene — Animated visual story for Round 2 & 3.
 * Instead of a mini-game, shows an educational walkthrough of the process
 * with steps that auto-advance, teaching economic theory through visuals.
 */

const STORY_DATA = {
  // Stage 2A: Phơi khô (Lao động giản đơn)
  raw: {
    title: 'Phơi khô truyền thống',
    subtitle: 'Lao động giản đơn — Không đòi hỏi kỹ năng chuyên sâu',
    bg: '/assets/pres_theory.webp',
    concept: 'Lao động giản đơn',
    steps: [
      {
        label: 'Thu gom',
        desc: 'Cà phê được gom lại từ ruộng, không qua sàng lọc kỹ.',
        valueAdd: 2,
        icon: '📦',
      },
      {
        label: 'Phơi nắng',
        desc: 'Trải đều trên sân phơi 2-3 tuần dưới ánh nắng tự nhiên.',
        valueAdd: 3,
        icon: '☀️',
      },
      {
        label: 'Đóng bao',
        desc: 'Đóng bao xuất khẩu dạng nhân thô. Giá trị gia tăng rất thấp.',
        valueAdd: 2,
        icon: '📋',
      },
    ],
    conclusion: {
      text: 'Lao động giản đơn không tạo ra nhiều giá trị gia tăng. Cà phê nhân thô Việt Nam bán 2-3 USD/kg, trong khi cà phê rang xay đạt 15-30 USD/kg.',
      highlight: 'Giá trị gia tăng: chỉ +7%',
      color: '#f59e0b',
    },
  },

  // Stage 2B: Chế biến sâu (Lao động phức tạp)
  deep: {
    title: 'Chế biến sâu — Espresso',
    subtitle: 'Lao động phức tạp — Kỹ thuật cao, nhân bội giá trị',
    bg: '/assets/pres_theory.webp',
    concept: 'Lao động phức tạp',
    steps: [
      {
        label: 'Sàng lọc',
        desc: 'Phân loại hạt theo kích thước, loại bỏ hạt lỗi. Yêu cầu kinh nghiệm.',
        valueAdd: 5,
        icon: '🔍',
      },
      {
        label: 'Rang chuyên nghiệp',
        desc: 'Rang ở 190-230°C, kiểm soát chính xác. Đòi hỏi đào tạo chuyên sâu.',
        valueAdd: 8,
        icon: '🔥',
      },
      {
        label: 'Xay & Pha chế',
        desc: 'Xay theo cỡ phù hợp, pha espresso chuẩn. Lao động phức tạp = giản đơn × n.',
        valueAdd: 7,
        icon: '☕',
      },
      {
        label: 'Đóng gói thương hiệu',
        desc: 'Thiết kế bao bì, xây dựng thương hiệu. Tạo giá trị sử dụng cảm nhận.',
        valueAdd: 8,
        icon: '🎨',
      },
      {
        label: 'Phân phối',
        desc: 'Hệ thống phân phối chuyên nghiệp đến tay người tiêu dùng.',
        valueAdd: 5,
        icon: '🚚',
      },
    ],
    conclusion: {
      text: 'Theo C.Mác: lao động phức tạp = lao động giản đơn được nhân bội. Mỗi công đoạn thêm vào đều tăng giá trị hàng hóa. Cà phê espresso đạt 15-30 USD/kg.',
      highlight: 'Giá trị gia tăng: +33%',
      color: '#22c55e',
    },
  },

  // Stage 3A: Giảm giá sốc
  discount: {
    title: 'Chiến lược Giảm giá sốc',
    subtitle: 'Giá cả < Giá trị — Hậu quả kinh tế',
    bg: '/assets/pres_market.webp',
    concept: 'Quy luật Giá trị',
    steps: [
      {
        label: 'Giá ban đầu: 120k/kg',
        desc: 'Giá phản ánh đúng giá trị hàng hóa dựa trên thời gian lao động xã hội cần thiết.',
        valueAdd: 0,
        icon: '💰',
      },
      {
        label: 'Giảm 30%: 84k/kg',
        desc: 'Giá cả < Giá trị. Lượng cầu tăng mạnh theo quy luật cung-cầu.',
        valueAdd: -8,
        icon: '📉',
      },
      {
        label: 'Đối thủ theo giảm',
        desc: 'Quy luật cạnh tranh: các hãng khác buộc giảm theo. Toàn ngành bị phá giá.',
        valueAdd: -10,
        icon: '⚔️',
      },
      {
        label: 'Lợi nhuận âm',
        desc: 'Bán dưới giá trị lâu dài → thua lỗ → phá sản. Vi phạm quy luật giá trị.',
        valueAdd: -7,
        icon: '💔',
      },
    ],
    conclusion: {
      text: 'Theo quy luật giá trị: giá cả hàng hóa phải xoay quanh giá trị. Bán dưới giá trị chỉ tạo lợi nhuận ngắn hạn nhưng phá hủy thị trường dài hạn.',
      highlight: 'Hậu quả: Phá giá thị trường -25%',
      color: '#ef4444',
    },
  },

  // Stage 3B: Chứng chỉ EUDR
  green: {
    title: 'Chứng chỉ xanh EUDR',
    subtitle: 'Giá trị sử dụng đáp ứng tiêu chuẩn quốc tế',
    bg: '/assets/pres_market.webp',
    concept: 'Giá trị sử dụng',
    steps: [
      {
        label: 'Không phá rừng',
        desc: 'Chứng minh nguồn gốc cà phê không liên quan đến phá rừng.',
        valueAdd: 5,
        icon: '🌳',
      },
      {
        label: 'Sản xuất bền vững',
        desc: 'Không thuốc trừ sâu, quản lý nước — Nâng cao giá trị sử dụng.',
        valueAdd: 5,
        icon: '🌱',
      },
      {
        label: 'Truy xuất nguồn gốc',
        desc: 'Hệ thống theo dõi từ nông trại → tách cà phê. Minh bạch.',
        valueAdd: 5,
        icon: '📋',
      },
      {
        label: 'Đạt chứng chỉ',
        desc: 'EUDR Certified → Tiếp cận thị trường EU cao cấp.',
        valueAdd: 8,
        icon: '🏅',
      },
      {
        label: 'Giá premium',
        desc: 'Giá cả phản ánh đúng giá trị khi thị trường công nhận chất lượng.',
        valueAdd: 7,
        icon: '💎',
      },
    ],
    conclusion: {
      text: 'Hoàn thiện giá trị sử dụng → thị trường sẵn sàng trả giá cao hơn. Giá cả hàng hóa = biểu hiện bằng tiền của giá trị. Chứng chỉ giúp giá cả tiệm cận đúng giá trị.',
      highlight: 'Giá trị tăng +30%, bền vững',
      color: '#22c55e',
    },
  },
};

export default function StoryScene({ onComplete, storyId }) {
  const story = STORY_DATA[storyId];
  const [currentStep, setCurrentStep] = useState(-1); // -1 = intro
  const [totalValue, setTotalValue] = useState(0);
  const [showConclusion, setShowConclusion] = useState(false);

  // Auto-advance steps
  useEffect(() => {
    if (showConclusion) return;
    const timer = setTimeout(() => {
      const next = currentStep + 1;
      if (next < story.steps.length) {
        setCurrentStep(next);
        setTotalValue(v => v + story.steps[next].valueAdd);
      } else {
        setShowConclusion(true);
      }
    }, currentStep === -1 ? 1500 : 2500);
    return () => clearTimeout(timer);
  }, [currentStep, showConclusion, story]);

  const progress = showConclusion
    ? story.steps.length
    : Math.max(0, currentStep + 1);

  return (
    <BaseScene
      title={story.title}
      subtitle={story.subtitle}
      backgroundImage={story.bg}
      progress={progress}
      maxProgress={story.steps.length}
      progressLabel={`${progress}/${story.steps.length} công đoạn | Giá trị: ${totalValue > 0 ? '+' : ''}${totalValue}%`}
      isComplete={showConclusion}
      onComplete={onComplete}
    >
      <div className="story-container">
        {/* Concept badge */}
        <motion.div
          className="story-concept"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {story.concept}
        </motion.div>

        {/* Steps timeline */}
        <div className="story-timeline">
          {story.steps.map((step, i) => {
            const isActive = i === currentStep;
            const isDone = i < currentStep || showConclusion;
            const isLocked = i > currentStep && !showConclusion;

            return (
              <motion.div
                key={i}
                className={`story-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''} ${isLocked ? 'locked' : ''}`}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: isLocked ? 0.3 : 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="story-step-icon" style={{
                  borderColor: isDone ? story.conclusion.color : 'rgba(255,255,255,0.1)',
                  background: isDone ? story.conclusion.color + '20' : 'rgba(255,255,255,0.03)',
                }}>
                  {isDone ? '✓' : step.icon}
                </div>
                <div className="story-step-content">
                  <div className="story-step-label">{step.label}</div>
                  {(isActive || isDone) && (
                    <motion.p
                      className="story-step-desc"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {step.desc}
                    </motion.p>
                  )}
                </div>
                <div className={`story-step-value ${step.valueAdd >= 0 ? 'positive' : 'negative'}`}>
                  {(isActive || isDone) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                    >
                      {step.valueAdd > 0 ? '+' : ''}{step.valueAdd}%
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Conclusion panel */}
        <AnimatePresence>
          {showConclusion && (
            <motion.div
              className="story-conclusion"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 15 }}
              style={{ borderColor: story.conclusion.color }}
            >
              <div className="story-conclusion-highlight" style={{ color: story.conclusion.color }}>
                {story.conclusion.highlight}
              </div>
              <p className="story-conclusion-text">{story.conclusion.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseScene>
  );
}
