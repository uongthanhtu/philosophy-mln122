import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseScene from './BaseScene';

const REQUIRED_PICKS = 8;

const TREES = [
  { id: 0, x: 12, ripe: 3, unripe: 1 },
  { id: 1, x: 28, ripe: 2, unripe: 2 },
  { id: 2, x: 44, ripe: 4, unripe: 0 },
  { id: 3, x: 60, ripe: 1, unripe: 3 },
  { id: 4, x: 76, ripe: 3, unripe: 1 },
  { id: 5, x: 90, ripe: 2, unripe: 2 },
];

const QUIZZES = [
  { q: 'Quả cà phê chín có màu gì?', opts: ['🟢 Xanh lá', '🔴 Đỏ cherry', '🟡 Vàng'], correct: 1,
    wrong: ['Xanh là chưa chín mà! 🤦', 'Vàng là chuối kìa! 🍌'], right: 'Đỏ cherry = chín mọng! 🍒' },
  { q: 'Hái tay thủ công có ưu điểm gì?', opts: ['⚡ Nhanh nhất', '🎯 Chọn lọc kỹ', '💰 Rẻ nhất'], correct: 1,
    wrong: ['Nhanh thì dùng máy rồi! 🤖', 'Hái tay tốn nhân công lắm! 💸'], right: 'Chọn lọc kỹ = GTSD cao! ✅' },
  { q: 'Nếu hái cả quả xanh thì sao?', opts: ['👍 Không sao', '👎 Vị đắng chát', '🎉 Ngon hơn'], correct: 1,
    wrong: ['Sao không sao được! 😤', 'Bạn thử uống cà phê xanh chưa? 🤢'], right: 'Đúng — quả xanh = vị đắng, chất lượng giảm!' },
  { q: 'Lao động hái tay thuộc loại nào?', opts: ['🏭 Lao động trừu tượng', '🤲 Lao động cụ thể', '🛋️ Lao động... nằm'], correct: 1,
    wrong: ['Trừu tượng là hao phí LĐ nói chung!', 'Nằm thì hái kiểu gì! 😴'], right: 'LĐ cụ thể → tạo GTSD! 📚' },
  { q: 'VN đứng thứ mấy thế giới về cà phê?', opts: ['🥇 Thứ 1', '🥈 Thứ 2', '🥉 Thứ 3'], correct: 1,
    wrong: ['Brazil mới thứ 1 nhé!', 'Ta xếp trên Colombia!'], right: 'Thứ 2 thế giới — sau Brazil! 🇻🇳' },
  { q: 'Arabica và Robusta khác gì?', opts: ['☕ Arabica thơm hơn', '💪 Robusta to hơn', '🤷 Giống nhau'], correct: 0,
    wrong: ['To hơn không phải tiêu chí chính!', 'Khác nhiều lắm bạn ơi!'], right: 'Arabica thơm, Robusta đậm — VN trồng chủ yếu Robusta!' },
];

export default function HandpickScene({ onComplete }) {
  const fieldRef = useRef(null);
  const [farmerX, setFarmerX] = useState(5);
  const [isWalking, setIsWalking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [targetTree, setTargetTree] = useState(null);
  const [isPicking, setIsPicking] = useState(false);
  const [pickedTrees, setPickedTrees] = useState(new Set());
  const [totalPicked, setTotalPicked] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const walkTimeout = useRef(null);

  // Quiz
  const [quizTree, setQuizTree] = useState(null);
  const [quizReaction, setQuizReaction] = useState(null);

  const handleFieldClick = useCallback((e) => {
    if (isPicking || quizTree !== null) return;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    setFacingRight(clickX > farmerX);
    setFarmerX(clickX);
    setIsWalking(true);
    setTargetTree(null);
    clearTimeout(walkTimeout.current);
    walkTimeout.current = setTimeout(() => setIsWalking(false), 800);
  }, [farmerX, isPicking, quizTree]);

  // Click tree → quiz first
  const handleTreeClick = useCallback((tree, e) => {
    e.stopPropagation();
    if (isPicking || pickedTrees.has(tree.id) || quizTree !== null) return;
    setQuizTree(tree.id);
    setQuizReaction(null);
  }, [isPicking, pickedTrees, quizTree]);

  // Answer quiz
  const handleQuizAnswer = useCallback((idx) => {
    const quiz = QUIZZES[quizTree];
    if (idx === quiz.correct) {
      setQuizReaction({ text: quiz.right, type: 'good' });
      setTimeout(() => {
        const tree = TREES[quizTree];
        setQuizTree(null);
        setQuizReaction(null);
        // Now do the picking
        setFacingRight(tree.x > farmerX);
        setFarmerX(tree.x - 3);
        setIsWalking(true);
        setTargetTree(tree.id);
        const dist = Math.abs(tree.x - farmerX);
        clearTimeout(walkTimeout.current);
        walkTimeout.current = setTimeout(() => {
          setIsWalking(false);
          setIsPicking(true);
          setTimeout(() => {
            setPickedTrees(prev => new Set([...prev, tree.id]));
            setTotalPicked(p => p + tree.ripe);
            const bonus = tree.ripe * 10 - tree.unripe * 5;
            setScore(s => Math.max(0, s + bonus));
            setFeedback(prev => [...prev.slice(-3), {
              id: Date.now(), text: `+${tree.ripe} quả chín!`,
              sub: tree.unripe > 0 ? `(-${tree.unripe} xanh)` : '', type: tree.ripe > tree.unripe ? 'good' : 'bad', x: tree.x,
            }]);
            setTimeout(() => setFeedback(fb => fb.slice(1)), 1500);
            setIsPicking(false);
            setTargetTree(null);
          }, 1200);
        }, Math.max(400, dist * 20));
      }, 1000);
    } else {
      const wrongIdx = idx > quiz.correct ? idx - 1 : idx;
      setQuizReaction({ text: quiz.wrong[Math.min(wrongIdx, quiz.wrong.length - 1)], type: 'bad' });
      setTimeout(() => setQuizReaction(null), 2000);
    }
  }, [quizTree, farmerX]);

  return (
    <BaseScene
      title="Thu hoạch thủ công"
      subtitle="Trả lời câu hỏi → Farmer hái cà phê"
      backgroundImage="/assets/game_field_bg.webp"
      progress={totalPicked} maxProgress={REQUIRED_PICKS}
      progressLabel={`Đã hái: ${totalPicked}/${REQUIRED_PICKS} quả chín | Điểm: ${score}`}
      isComplete={totalPicked >= REQUIRED_PICKS} onComplete={onComplete}
    >
      <div ref={fieldRef} className="adventure-field" onClick={handleFieldClick}>
        <div className="adv-ground" />
        {TREES.map(tree => {
          const picked = pickedTrees.has(tree.id);
          const isTarget = targetTree === tree.id;
          return (
            <div key={tree.id} className={`adv-tree-wrap ${picked ? 'picked' : ''} ${isTarget ? 'target' : ''}`}
              style={{ left: `${tree.x}%` }} onClick={(e) => handleTreeClick(tree, e)}>
              <img src="/assets/game_tree.webp" alt="" className="adv-tree-img" />
              {!picked && (<div className="adv-tree-info">
                <span className="adv-cherry-count ripe">{tree.ripe}</span>
                {tree.unripe > 0 && <span className="adv-cherry-count unripe">{tree.unripe}</span>}
              </div>)}
              {picked && <div className="adv-tree-done">✓</div>}
              {!picked && <div className="adv-tree-ring" />}
            </div>
          );
        })}
        <motion.div className={`adv-farmer ${isWalking ? 'walking' : ''} ${isPicking ? 'picking' : ''}`}
          animate={{ left: `${farmerX}%` }} transition={{ type: 'spring', damping: 18, stiffness: 80 }}
          style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}>
          <img src="/assets/game_farmer.webp" alt="" className="adv-farmer-img" />
          {isPicking && (<motion.div className="adv-pick-action" animate={{ rotate: [-10, 20, -10], y: [0, -5, 0] }}
            transition={{ duration: 0.4, repeat: 2 }} />)}
        </motion.div>
        <div className="adv-basket">
          <img src="/assets/game_basket.webp" alt="" className="adv-basket-img" />
          <span className="adv-basket-count">{totalPicked}</span>
        </div>
        <AnimatePresence>
          {feedback.map(fb => (
            <motion.div key={fb.id} className={`adv-feedback ${fb.type}`} style={{ left: `${fb.x}%` }}
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -60 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
              <span>{fb.text}</span>{fb.sub && <small>{fb.sub}</small>}
            </motion.div>
          ))}
        </AnimatePresence>
        {totalPicked === 0 && !isWalking && quizTree === null && (
          <div className="adv-hint">Click vào cây để hái cà phê →</div>
        )}
      </div>

      {/* QUIZ */}
      <AnimatePresence>
        {quizTree !== null && (
          <motion.div className="quiz-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="quiz-box" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <p className="quiz-question">{QUIZZES[quizTree].q}</p>
              <div className="quiz-options">
                {QUIZZES[quizTree].opts.map((opt, i) => (
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
