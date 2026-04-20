import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseScene from './BaseScene';

const TREE_POSITIONS = [10, 22, 34, 46, 58, 70, 82, 94];

// Quiz before every 2 trees
const QUIZZES = [
  { q: 'Máy hái có nhược điểm gì?', opts: ['🐌 Quá chậm', '🥗 Hái cả xanh lẫn chín', '💎 Quá đắt'], correct: 1,
    wrong: ['Máy mà chậm thì mua làm gì! 🤖', 'Đắt thì đúng, nhưng nhược điểm chính là...'], right: 'Máy không phân biệt được xanh/chín! 🎯' },
  { q: 'Dùng máy thì năng suất thay đổi thế nào?', opts: ['📈 Tăng mạnh', '📉 Giảm', '➡️ Không đổi'], correct: 0,
    wrong: ['Giảm thì dùng tay cho rồi! 😅', 'Không đổi thì mua máy chi!'], right: 'Năng suất tăng = nhiều sản phẩm hơn! ⚡' },
  { q: 'Năng suất tăng thì giá trị mỗi đơn vị...?', opts: ['📈 Tăng', '📉 Giảm', '🤷 Tùy'], correct: 1,
    wrong: ['Theo Mác: năng suất tăng → GT đơn vị GIẢM!', 'Không phải tùy đâu — có quy luật!'], right: 'Đúng! Năng suất ↑ → GT mỗi đơn vị ↓ (Mác) 📊' },
  { q: 'Máy hái thuộc loại lao động nào?', opts: ['🤲 Cụ thể', '⚙️ Trừu tượng', '🧠 Phức tạp'], correct: 0,
    wrong: ['Trừu tượng là hao phí LĐ nói chung!', 'Phức tạp ≠ máy móc — mà là kỹ năng đào tạo!'], right: 'Vẫn là LĐ cụ thể — chỉ đổi công cụ! 🔧' },
];

export default function MachineScene({ onComplete }) {
  const fieldRef = useRef(null);
  const [machineX, setMachineX] = useState(2);
  const [isMoving, setIsMoving] = useState(false);
  const [harvestedTrees, setHarvestedTrees] = useState(new Set());
  const [totalBeans, setTotalBeans] = useState(0);
  const [ripeCount, setRipeCount] = useState(0);
  const [unripeCount, setUnripeCount] = useState(0);
  const [fallingBeans, setFallingBeans] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const moveTimeout = useRef(null);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0); // which quiz to show next
  const [showQuiz, setShowQuiz] = useState(null); // quiz object
  const [quizReaction, setQuizReaction] = useState(null);
  const treesBeforeQuiz = useRef(0);

  const doHarvest = useCallback((clickX) => {
    setMachineX(clickX);
    setIsMoving(true);
    const walkTime = Math.max(300, Math.abs(clickX - machineX) * 15);
    clearTimeout(moveTimeout.current);
    moveTimeout.current = setTimeout(() => {
      setIsMoving(false);
      TREE_POSITIONS.forEach((tx, idx) => {
        if (harvestedTrees.has(idx)) return;
        if (Math.abs(clickX - tx) < 8) {
          setHarvestedTrees(prev => new Set([...prev, idx]));
          const ripe = 2 + Math.floor(Math.random() * 3);
          const unripe = 1 + Math.floor(Math.random() * 3);
          setRipeCount(r => r + ripe);
          setUnripeCount(u => u + unripe);
          setTotalBeans(t => t + ripe + unripe);
          treesBeforeQuiz.current += 1;
          for (let i = 0; i < ripe + unripe; i++) {
            setTimeout(() => {
              setFallingBeans(prev => [...prev.slice(-20), {
                id: Date.now() + Math.random(), x: tx + (Math.random() - 0.5) * 10, isRipe: i < ripe,
              }]);
            }, i * 100);
          }
          setFeedback(prev => [...prev.slice(-2), {
            id: Date.now(), text: `+${ripe + unripe} hạt (${unripe} xanh)`, type: unripe > ripe ? 'bad' : 'good', x: tx,
          }]);
          setTimeout(() => setFeedback(fb => fb.slice(1)), 1500);
        }
      });
    }, walkTime);
  }, [machineX, isMoving, harvestedTrees]);

  const handleFieldClick = useCallback((e) => {
    if (isMoving || showQuiz) return;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;

    // Show quiz every 2 trees
    if (treesBeforeQuiz.current >= 2 && quizIdx < QUIZZES.length) {
      setShowQuiz({ ...QUIZZES[quizIdx], pendingClickX: clickX });
      setQuizReaction(null);
      return;
    }
    doHarvest(clickX);
  }, [isMoving, showQuiz, quizIdx, doHarvest]);

  const handleQuizAnswer = useCallback((idx) => {
    const quiz = showQuiz;
    if (idx === quiz.correct) {
      setQuizReaction({ text: quiz.right, type: 'good' });
      setTimeout(() => {
        treesBeforeQuiz.current = 0;
        setQuizIdx(q => q + 1);
        const pendingX = quiz.pendingClickX;
        setShowQuiz(null);
        setQuizReaction(null);
        doHarvest(pendingX);
      }, 1000);
    } else {
      const wrongIdx = idx > quiz.correct ? idx - 1 : idx;
      setQuizReaction({ text: quiz.wrong[Math.min(wrongIdx, quiz.wrong.length - 1)], type: 'bad' });
      setTimeout(() => setQuizReaction(null), 2000);
    }
  }, [showQuiz, doHarvest]);

  const progress = harvestedTrees.size;
  const total = TREE_POSITIONS.length;

  return (
    <BaseScene
      title="Máy hái công nghiệp"
      subtitle="Click gần cây để lái máy — Trả lời quiz mỗi 2 cây!"
      backgroundImage="/assets/game_field_bg.webp"
      progress={progress} maxProgress={total}
      progressLabel={`Cây: ${progress}/${total} | Chín: ${ripeCount} | Xanh: ${unripeCount}`}
      isComplete={progress >= total} onComplete={onComplete}
    >
      <div ref={fieldRef} className="adventure-field" onClick={handleFieldClick}>
        <div className="adv-ground" />
        {TREE_POSITIONS.map((tx, idx) => {
          const harvested = harvestedTrees.has(idx);
          return (
            <div key={idx} className={`adv-tree-wrap ${harvested ? 'picked' : ''}`} style={{ left: `${tx}%` }}>
              <img src="/assets/game_tree.webp" alt="" className="adv-tree-img" />
              {harvested && <div className="adv-tree-done">✓</div>}
              {!harvested && <div className="adv-tree-ring" />}
            </div>
          );
        })}
        <motion.div className={`adv-machine ${isMoving ? 'moving' : ''}`}
          animate={{ left: `${machineX}%` }} transition={{ type: 'spring', damping: 15, stiffness: 60 }}>
          <img src="/assets/game_harvester.webp" alt="" className="adv-machine-img" />
        </motion.div>
        <AnimatePresence>
          {fallingBeans.map(b => (
            <motion.div key={b.id} className={`adv-falling-bean ${b.isRipe ? 'ripe' : 'unripe'}`}
              style={{ left: `${b.x}%` }} initial={{ y: -20, opacity: 1 }}
              animate={{ y: 80, opacity: 0.3 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {feedback.map(fb => (
            <motion.div key={fb.id} className={`adv-feedback ${fb.type}`} style={{ left: `${fb.x}%` }}
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -50 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
              <span>{fb.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {progress === 0 && !isMoving && !showQuiz && (
          <div className="adv-hint">Click gần cây để lái máy hái →</div>
        )}
      </div>

      {/* QUIZ */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div className="quiz-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="quiz-box" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <p className="quiz-question">{showQuiz.q}</p>
              <div className="quiz-options">
                {showQuiz.opts.map((opt, i) => (
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
