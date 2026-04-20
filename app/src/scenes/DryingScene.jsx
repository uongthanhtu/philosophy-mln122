import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseScene from './BaseScene';

/**
 * DryingScene — Round 2A: Phơi khô
 * 
 * Before each pile is processed, a quiz pops up asking about
 * proper drying conditions. Wrong answer = try again (with funny reaction).
 */

const COFFEE_PILES = [
  { id: 0, x: 20, label: 'Đống 1' },
  { id: 1, x: 40, label: 'Đống 2' },
  { id: 2, x: 60, label: 'Đống 3' },
  { id: 3, x: 80, label: 'Đống 4' },
];

const RACK_X = [15, 35, 55, 75];

// Quiz questions about drying — must answer correctly before processing
const QUIZZES = [
  {
    q: 'Phơi cà phê khi nào tốt nhất?',
    options: ['🌧️ Trời mưa', '☀️ Trời nắng', '🌙 Ban đêm'],
    correct: 1,
    wrongReact: ['Ướt hết cà phê rồi! 💦', 'Phơi đêm thì phơi... tâm hồn à? 😴'],
    rightReact: 'Nắng to phơi khô đều! ☀️',
  },
  {
    q: 'Nên phơi cà phê ở đâu?',
    options: ['🪨 Dưới đất', '📐 Trên giàn nâng', '🛏️ Trên giường ngủ'],
    correct: 1,
    wrongReact: ['Dưới đất bẩn lắm, mốc hết! 🦠', 'Giường ngủ thì... ngủ ở đâu? 😂'],
    rightReact: 'Giàn nâng giúp thông gió, khô đều! 👍',
  },
  {
    q: 'Bao lâu phải đảo cà phê 1 lần?',
    options: ['⏰ Mỗi 2 giờ', '📅 Mỗi tuần', '🤷 Không cần đảo'],
    correct: 0,
    wrongReact: ['1 tuần thì cà phê thành phân bón rồi! 🪱', 'Không đảo = khô không đều → mốc 🍄'],
    rightReact: 'Đảo thường xuyên = khô đều, chất lượng cao! ✅',
  },
  {
    q: 'Độ ẩm hạt cà phê phơi xong nên là bao nhiêu?',
    options: ['💧 50%', '💧 12-13%', '💧 0%'],
    correct: 1,
    wrongReact: ['50% thì còn ướt nhẹp! 😰', '0% thì hạt vỡ vụn hết! 💥'],
    rightReact: '12-13% là tiêu chuẩn bảo quản hoàn hảo! 🎯',
  },
];

export default function DryingScene({ onComplete }) {
  const fieldRef = useRef(null);
  const [farmerX, setFarmerX] = useState(5);
  const [isWalking, setIsWalking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [carrying, setCarrying] = useState(false);
  const [processed, setProcessed] = useState(new Set());
  const [activeTarget, setActiveTarget] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [valueAdded, setValueAdded] = useState(0);
  const walkTimeout = useRef(null);

  // Quiz state
  const [quizPile, setQuizPile] = useState(null); // pile id waiting for quiz
  const [quizReaction, setQuizReaction] = useState(null); // wrong answer message

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

  // Click pile → show quiz first
  const handlePileClick = useCallback((pile, e) => {
    e.stopPropagation();
    if (processed.has(pile.id) || carrying || quizPile !== null) return;
    setQuizPile(pile.id);
    setQuizReaction(null);
  }, [processed, carrying, quizPile]);

  // Answer quiz
  const handleQuizAnswer = useCallback((optionIdx) => {
    const quiz = QUIZZES[quizPile];
    if (optionIdx === quiz.correct) {
      // Correct! Start processing
      setQuizReaction({ text: quiz.rightReact, type: 'good' });
      setTimeout(() => {
        const pile = COFFEE_PILES[quizPile];
        setQuizPile(null);
        setQuizReaction(null);
        setActiveTarget(pile.id);
        walkTo(pile.x - 3, () => {
          setCarrying(true);
          setActiveTarget(null);
          setTimeout(() => {
            walkTo(RACK_X[pile.id], () => {
              setCarrying(false);
              setProcessed(prev => new Set([...prev, pile.id]));
              const add = 2;
              setValueAdded(v => v + add);
              setFeedback(prev => [...prev.slice(-2), {
                id: Date.now(), text: `+${add}% giá trị`, x: RACK_X[pile.id], type: 'good'
              }]);
              setTimeout(() => setFeedback(fb => fb.slice(1)), 1500);
            });
          }, 300);
        });
      }, 1200);
    } else {
      // Wrong — show funny reaction
      const wrongIdx = optionIdx > quiz.correct ? optionIdx - 1 : optionIdx;
      const wrongText = quiz.wrongReact[Math.min(wrongIdx, quiz.wrongReact.length - 1)];
      setQuizReaction({ text: wrongText, type: 'bad' });
      setTimeout(() => setQuizReaction(null), 2000);
    }
  }, [quizPile, walkTo]);

  const handleFieldClick = useCallback((e) => {
    if (carrying || quizPile !== null) return;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    walkTo(clickX, null);
  }, [carrying, quizPile, walkTo]);

  return (
    <BaseScene
      title="Phơi khô truyền thống"
      subtitle="Trả lời đúng câu hỏi → Farmer phơi cà phê"
      backgroundImage="/assets/game_drying_bg.webp"
      progress={processed.size}
      maxProgress={COFFEE_PILES.length}
      progressLabel={`Đã phơi: ${processed.size}/${COFFEE_PILES.length} | Giá trị: +${valueAdded}%`}
      isComplete={processed.size >= COFFEE_PILES.length}
      onComplete={onComplete}
    >
      <div ref={fieldRef} className="adventure-field" onClick={handleFieldClick}>
        <div className="adv-ground" />

        {/* Drying racks */}
        {RACK_X.map((rx, i) => (
          <div key={`rack-${i}`} className={`dry-rack-obj ${processed.has(i) ? 'filled' : ''}`}
            style={{ left: `${rx}%` }}
          >
            <img src="/assets/game_drying_rack.webp" alt="" className="dry-rack-img" />
            {processed.has(i) && <div className="dry-rack-beans" />}
            <span className="dry-rack-label">{processed.has(i) ? '☀️ Đang phơi' : 'Giàn phơi'}</span>
          </div>
        ))}

        {/* Coffee piles */}
        {COFFEE_PILES.map(pile => {
          const done = processed.has(pile.id);
          const isTarget = activeTarget === pile.id;
          return (
            <div key={pile.id}
              className={`coffee-pile-obj ${done ? 'done' : ''} ${isTarget ? 'target' : ''}`}
              style={{ left: `${pile.x}%` }}
              onClick={(e) => handlePileClick(pile, e)}
            >
              <img src="/assets/game_coffee_pile.webp" alt="" className="coffee-pile-img" />
              {!done && <span className="coffee-pile-label">{pile.label}</span>}
              {done && <span className="coffee-pile-check">✓</span>}
              {!done && <div className="adv-tree-ring" />}
            </div>
          );
        })}

        {/* Farmer */}
        <motion.div
          className={`adv-farmer ${isWalking ? 'walking' : ''} ${carrying ? 'picking' : ''}`}
          animate={{ left: `${farmerX}%` }}
          transition={{ type: 'spring', damping: 18, stiffness: 80 }}
          style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}
        >
          <img src="/assets/game_farmer.webp" alt="" className="adv-farmer-img" />
          {carrying && <div className="farmer-carry-indicator" />}
        </motion.div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback.map(fb => (
            <motion.div key={fb.id} className={`adv-feedback ${fb.type}`}
              style={{ left: `${fb.x}%` }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -50 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <span>{fb.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {processed.size === 0 && !isWalking && quizPile === null && (
          <div className="adv-hint">Click vào đống cà phê để phơi →</div>
        )}
      </div>

      {/* ── QUIZ OVERLAY ── */}
      <AnimatePresence>
        {quizPile !== null && (
          <motion.div
            className="quiz-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="quiz-box"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <p className="quiz-question">{QUIZZES[quizPile].q}</p>
              <div className="quiz-options">
                {QUIZZES[quizPile].options.map((opt, i) => (
                  <button
                    key={i}
                    className="quiz-opt"
                    onClick={() => handleQuizAnswer(i)}
                    disabled={quizReaction?.type === 'good'}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {quizReaction && (
                  <motion.div
                    className={`quiz-reaction ${quizReaction.type}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
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
