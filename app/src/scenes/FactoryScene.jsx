import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseScene from './BaseScene';

const STATIONS = [
  { id: 0, x: 12, label: 'Sàng lọc', icon: '🔍', img: '/assets/game_sorter.webp', desc: 'Phân loại hạt theo kích thước', valueAdd: 5 },
  { id: 1, x: 30, label: 'Rang', icon: '🔥', img: '/assets/game_roaster.webp', desc: 'Rang ở 190-230°C chuyên nghiệp', valueAdd: 8 },
  { id: 2, x: 48, label: 'Xay', icon: '⚙️', img: '/assets/game_grinder.webp', desc: 'Xay theo cỡ phù hợp', valueAdd: 7 },
  { id: 3, x: 66, label: 'Đóng gói', icon: '📦', img: '/assets/game_packager.webp', desc: 'Đóng gói chuyên nghiệp', valueAdd: 8 },
  { id: 4, x: 84, label: 'Thương hiệu', icon: '🎨', img: '/assets/game_brander.webp', desc: 'Xây dựng thương hiệu', valueAdd: 5 },
];

// Quiz for each station
const STATION_QUIZZES = [
  { q: 'Sàng lọc loại bỏ hạt nào?', opts: ['🏆 Hạt đẹp nhất', '🐛 Hạt lỗi, sâu, vỡ', '🌈 Tất cả hạt'], correct: 1,
    wrong: ['Bỏ hạt đẹp thì... bán gì? 😂', 'Bỏ hết thì đóng gói không khí à! 🌬️'], right: 'Loại hạt lỗi → chất lượng đồng đều! ✅' },
  { q: 'Nhiệt độ rang espresso khoảng bao nhiêu?', opts: ['❄️ 50°C', '🔥 190-230°C', '☀️ 1000°C'], correct: 1,
    wrong: ['50°C thì mới ấm tay thôi! 🤲', '1000°C thì thành than rồi! 🔥💀'], right: '190-230°C là tiêu chuẩn rang chuyên nghiệp! ☕' },
  { q: 'Cỡ xay ảnh hưởng đến gì?', opts: ['🎨 Màu sắc bao bì', '☕ Hương vị & độ chiết xuất', '📏 Chiều cao ly'], correct: 1,
    wrong: ['Bao bì thì liên quan gì xay! 📦😅', 'Ly cao thấp do ly, không do cà phê! 🤦'], right: 'Cỡ xay quyết định hương vị khi pha! 🎯' },
  { q: 'Đóng gói dùng van 1 chiều để làm gì?', opts: ['🎵 Cho đẹp', '💨 Thoát CO₂, không cho oxy vào', '🔊 Phát nhạc'], correct: 1,
    wrong: ['Valve không phải để làm đẹp! 🎀', 'Phát nhạc thì mua loa! 🔊😂'], right: 'Van 1 chiều giữ cà phê tươi lâu hơn! 💨✅' },
  { q: 'Xây dựng thương hiệu thuộc loại lao động gì?', opts: ['☀️ Giản đơn', '🧠 Phức tạp', '🛋️ Không lao động'], correct: 1,
    wrong: ['Thiết kế thương hiệu cần đào tạo chuyên sâu!', 'Marketing cũng là lao động nhé! 💪'], right: 'LĐ phức tạp = cần đào tạo, sáng tạo → nhân bội giá trị! 🧠' },
];

export default function FactoryScene({ onComplete }) {
  const fieldRef = useRef(null);
  const [farmerX, setFarmerX] = useState(3);
  const [isWalking, setIsWalking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [completed, setCompleted] = useState(new Set());
  const [processing, setProcessing] = useState(null);
  const [nextStation, setNextStation] = useState(0);
  const [valueAdded, setValueAdded] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const walkTimeout = useRef(null);

  // Quiz
  const [quizStation, setQuizStation] = useState(null);
  const [quizReaction, setQuizReaction] = useState(null);

  const walkTo = useCallback((targetX, onArrive) => {
    setFacingRight(targetX > farmerX);
    setFarmerX(targetX);
    setIsWalking(true);
    const dist = Math.abs(targetX - farmerX);
    clearTimeout(walkTimeout.current);
    walkTimeout.current = setTimeout(() => {
      setIsWalking(false);
      onArrive?.();
    }, Math.max(400, dist * 18));
  }, [farmerX]);

  // Click station → quiz first
  const handleStationClick = useCallback((station, e) => {
    e.stopPropagation();
    if (completed.has(station.id) || processing !== null || quizStation !== null) return;
    if (station.id !== nextStation) return;
    setQuizStation(station.id);
    setQuizReaction(null);
  }, [completed, processing, nextStation, quizStation]);

  // Answer quiz → process station
  const handleQuizAnswer = useCallback((idx) => {
    const quiz = STATION_QUIZZES[quizStation];
    if (idx === quiz.correct) {
      setQuizReaction({ text: quiz.right, type: 'good' });
      setTimeout(() => {
        const station = STATIONS[quizStation];
        setQuizStation(null);
        setQuizReaction(null);
        walkTo(station.x - 3, () => {
          setProcessing(station.id);
          setTimeout(() => {
            setCompleted(prev => new Set([...prev, station.id]));
            setProcessing(null);
            setNextStation(station.id + 1);
            setValueAdded(v => v + station.valueAdd);
            setFeedback(prev => [...prev.slice(-2), {
              id: Date.now(), text: `+${station.valueAdd}% ${station.label}`, x: station.x, type: 'good'
            }]);
            setTimeout(() => setFeedback(fb => fb.slice(1)), 1500);
          }, 1800);
        });
      }, 1000);
    } else {
      const wrongIdx = idx > quiz.correct ? idx - 1 : idx;
      setQuizReaction({ text: quiz.wrong[Math.min(wrongIdx, quiz.wrong.length - 1)], type: 'bad' });
      setTimeout(() => setQuizReaction(null), 2000);
    }
  }, [quizStation, walkTo]);

  const handleFieldClick = useCallback((e) => {
    if (processing !== null || quizStation !== null) return;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    walkTo(clickX, null);
  }, [processing, quizStation, walkTo]);

  return (
    <BaseScene
      title="Chế biến sâu — Espresso"
      subtitle="Trả lời quiz → Farmer vận hành từng trạm máy"
      backgroundImage="/assets/game_factory_bg.webp"
      progress={completed.size} maxProgress={STATIONS.length}
      progressLabel={`Trạm: ${completed.size}/${STATIONS.length} | Giá trị: +${valueAdded}%`}
      isComplete={completed.size >= STATIONS.length} onComplete={onComplete}
    >
      <div ref={fieldRef} className="adventure-field" onClick={handleFieldClick}>
        <div className="adv-ground" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(50,40,35,0.2) 100%)' }} />
        {STATIONS.map(station => {
          const done = completed.has(station.id);
          const isProcessing = processing === station.id;
          const isNext = station.id === nextStation && !done;
          const isLocked = station.id > nextStation && !done;
          return (
            <div key={station.id}
              className={`factory-station ${done ? 'done' : ''} ${isProcessing ? 'processing' : ''} ${isNext ? 'next' : ''} ${isLocked ? 'locked' : ''}`}
              style={{ left: `${station.x}%` }} onClick={(e) => handleStationClick(station, e)}>
              <div className="factory-station-body">
                {station.img && !done && !isProcessing ? (
                  <img src={station.img} alt={station.label} className="factory-station-img" />
                ) : (
                  <span className="factory-station-icon">{done ? '✓' : isProcessing ? '⏳' : station.icon}</span>
                )}
                <span className="factory-station-label">{station.label}</span>
              </div>
              {isLocked && <span className="factory-station-lock">🔒</span>}
              {isNext && <div className="factory-station-glow" />}
              {isProcessing && (
                <motion.div className="factory-station-progress" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.8 }} />
              )}
            </div>
          );
        })}
        <div className="factory-conveyor" />
        <motion.div className={`adv-farmer ${isWalking ? 'walking' : ''} ${processing !== null ? 'working' : ''}`}
          animate={{ left: `${farmerX}%` }} transition={{ type: 'spring', damping: 18, stiffness: 80 }}
          style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}>
          <img src="/assets/game_farmer.webp" alt="" className="adv-farmer-img" />
        </motion.div>
        <AnimatePresence>
          {feedback.map(fb => (
            <motion.div key={fb.id} className={`adv-feedback ${fb.type}`} style={{ left: `${fb.x}%` }}
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -50 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
              <span>{fb.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {completed.size === 0 && !isWalking && processing === null && quizStation === null && (
          <div className="adv-hint">Click trạm "Sàng lọc" để bắt đầu →</div>
        )}
      </div>

      {/* QUIZ */}
      <AnimatePresence>
        {quizStation !== null && (
          <motion.div className="quiz-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="quiz-box" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <p className="quiz-label">{STATIONS[quizStation].icon} Trạm: {STATIONS[quizStation].label}</p>
              <p className="quiz-question">{STATION_QUIZZES[quizStation].q}</p>
              <div className="quiz-options">
                {STATION_QUIZZES[quizStation].opts.map((opt, i) => (
                  <button key={i} className="quiz-opt" onClick={() => handleQuizAnswer(i)}
                    disabled={quizReaction?.type === 'good'}>{opt}</button>
                ))}
              </div>
              <AnimatePresence>
                {quizReaction && (
                  <motion.div className={`quiz-reaction ${quizReaction.type}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {quizReaction.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BaseScene>
  );
}
