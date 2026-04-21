import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseScene from './BaseScene';

const DOCUMENTS = [
  { id: 0, x: 20, label: 'Không phá rừng', icon: '🌳' },
  { id: 1, x: 35, label: 'Không hóa chất', icon: '🧪' },
  { id: 2, x: 50, label: 'Quản lý nước', icon: '💧' },
  { id: 3, x: 65, label: 'Quyền lao động', icon: '👷' },
  { id: 4, x: 80, label: 'Truy xuất nguồn gốc', icon: '📋' },
];

const INSPECTOR_X = 55;

// Quiz for each EUDR document
const DOC_QUIZZES = [
  { q: 'EUDR viết tắt của gì?', opts: ['🇪🇺 EU Deforestation Regulation', '🌍 European Union Drink Rules', '📋 Export Update Document Report'], correct: 0,
    wrong: ['Drink Rules? Cà phê không phải rượu! 🍷', 'Gần đúng nhưng sai! Đây là quy định chống phá rừng'], right: 'EU Deforestation Regulation — chống phá rừng! 🌳' },
  { q: 'Tại sao phải chứng minh không dùng hóa chất?', opts: ['🎨 Cho đẹp', '🏥 Bảo vệ sức khỏe & môi trường', '💰 Cho đắt'], correct: 1,
    wrong: ['Hóa chất mà đẹp gì! ☠️', 'Không phải để tăng giá, mà là trách nhiệm!'], right: 'Bảo vệ người tiêu dùng & hệ sinh thái! 🌿' },
  { q: 'Quản lý nước trong SX cà phê cần bao nhiêu lít/kg?', opts: ['🥤 1 lít', '🚿 140 lít', '🌊 14.000 lít'], correct: 1,
    wrong: ['1 lít thì... pha cà phê còn không đủ! ☕', 'Nhiều quá! 140 lít mới đúng'], right: 'Khoảng 140 lít/kg — nên phải quản lý tiết kiệm! 💧' },
  { q: 'Fair Trade bảo vệ quyền gì của nông dân?', opts: ['🎮 Quyền chơi game', '💰 Được trả giá công bằng', '🏖️ Quyền nghỉ mát'], correct: 1,
    wrong: ['Nông dân chơi game khi nào! 😂🌾', 'Nghỉ mát thì ai trồng cà phê! 🤣'], right: 'Fair Trade = giá công bằng + điều kiện LĐ tốt! ⚖️' },
  { q: 'Truy xuất nguồn gốc giúp gì?', opts: ['🔍 Biết cà phê đến từ đâu', '📸 Chụp ảnh đẹp', '🎁 Tặng quà'], correct: 0,
    wrong: ['Chụp ảnh cà phê thì liên quan gì! 📸😅', 'Tặng quà thì... tặng bằng cà phê à! 🎁☕'], right: 'Minh bạch chuỗi cung ứng → niềm tin người mua! 🔗' },
];

export default function CertificationScene({ onComplete }) {
  const fieldRef = useRef(null);
  const [farmerX, setFarmerX] = useState(10);
  const [isWalking, setIsWalking] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [submitted, setSubmitted] = useState(new Set());
  const [carrying, setCarrying] = useState(null);
  const [inspecting, setInspecting] = useState(false);
  const [certified, setCertified] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const walkTimeout = useRef(null);

  // Quiz
  const [quizDoc, setQuizDoc] = useState(null);
  const [quizReaction, setQuizReaction] = useState(null);

  const walkTo = useCallback((targetX, onArrive) => {
    setFacingRight(targetX > farmerX);
    setFarmerX(targetX);
    setIsWalking(true);
    clearTimeout(walkTimeout.current);
    walkTimeout.current = setTimeout(() => {
      setIsWalking(false);
      onArrive?.();
    }, Math.max(400, Math.abs(targetX - farmerX) * 18));
  }, [farmerX]);

  // Click doc → quiz first
  const handleDocClick = useCallback((doc, e) => {
    e.stopPropagation();
    if (submitted.has(doc.id) || carrying !== null || inspecting || quizDoc !== null) return;
    setQuizDoc(doc.id);
    setQuizReaction(null);
  }, [submitted, carrying, inspecting, quizDoc]);

  // Answer quiz → deliver doc
  const handleQuizAnswer = useCallback((idx) => {
    const quiz = DOC_QUIZZES[quizDoc];
    if (idx === quiz.correct) {
      setQuizReaction({ text: quiz.right, type: 'good' });
      setTimeout(() => {
        const doc = DOCUMENTS[quizDoc];
        setQuizDoc(null);
        setQuizReaction(null);
        walkTo(doc.x - 2, () => {
          setCarrying(doc.id);
          setTimeout(() => {
            walkTo(INSPECTOR_X - 5, () => {
              setInspecting(true);
              setTimeout(() => {
                setCarrying(null);
                setInspecting(false);
                setSubmitted(prev => new Set([...prev, doc.id]));
                setFeedback(prev => [...prev.slice(-2), {
                  id: Date.now(), text: `✓ ${doc.label}`, x: INSPECTOR_X, type: 'good'
                }]);
                setTimeout(() => setFeedback(fb => fb.slice(1)), 1500);
                if (submitted.size + 1 >= DOCUMENTS.length) {
                  setTimeout(() => setCertified(true), 500);
                }
              }, 1500);
            });
          }, 300);
        });
      }, 1000);
    } else {
      const wrongIdx = idx > quiz.correct ? idx - 1 : idx;
      setQuizReaction({ text: quiz.wrong[Math.min(wrongIdx, quiz.wrong.length - 1)], type: 'bad' });
      setTimeout(() => setQuizReaction(null), 2000);
    }
  }, [quizDoc, submitted, walkTo]);

  const handleFieldClick = useCallback((e) => {
    if (carrying !== null || inspecting || quizDoc !== null) return;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    walkTo(clickX, null);
  }, [carrying, inspecting, quizDoc, walkTo]);

  return (
    <BaseScene
      title="Chứng chỉ EUDR"
      subtitle="Trả lời quiz → Farmer mang tài liệu cho Thanh tra"
      backgroundImage="/assets/game_office_bg.webp"
      progress={submitted.size} maxProgress={DOCUMENTS.length}
      progressLabel={`Tài liệu: ${submitted.size}/${DOCUMENTS.length} ${certified ? '| ✅ CERTIFIED!' : ''}`}
      isComplete={certified} onComplete={onComplete}
    >
      <div ref={fieldRef} className="adventure-field" onClick={handleFieldClick}>
        <div className="adv-ground" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(40,35,30,0.15) 100%)' }} />
        {DOCUMENTS.map(doc => {
          const done = submitted.has(doc.id);
          const isCarried = carrying === doc.id;
          return (
            <div key={doc.id} className={`cert-doc ${done ? 'done' : ''} ${isCarried ? 'carried' : ''}`}
              style={{ left: `${doc.x}%` }} onClick={(e) => handleDocClick(doc, e)}>
              <div className="cert-doc-paper"><span>{done ? '✓' : doc.icon}</span><span className="cert-doc-label">{doc.label}</span></div>
              {!done && !isCarried && <div className="adv-tree-ring" style={{ width: 50, height: 14 }} />}
            </div>
          );
        })}
        <div className="cert-inspector" style={{ left: `${INSPECTOR_X}%` }}>
          <img src="/assets/game_inspector.webp" alt="Thanh tra" className="cert-inspector-img" />
          <span className="inspector-label">Thanh tra</span>
          {inspecting && (
            <motion.div className="inspector-checking" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
              🔍
            </motion.div>
          )}
        </div>
        <motion.div className={`adv-farmer ${isWalking ? 'walking' : ''} ${carrying !== null ? 'picking' : ''} ${inspecting ? 'handing' : ''}`}
          animate={{ left: `${farmerX}%` }} transition={{ type: 'spring', damping: 18, stiffness: 80 }}
          style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}>
          <img src="/assets/game_farmer.webp" alt="" className="adv-farmer-img" />
          {carrying !== null && <div className="farmer-carry-indicator" />}
        </motion.div>
        {certified && (
          <motion.div className="cert-stamp-final"
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 8 }}>
            <span>EUDR</span><span>CERTIFIED ✅</span>
          </motion.div>
        )}
        <AnimatePresence>
          {feedback.map(fb => (
            <motion.div key={fb.id} className={`adv-feedback ${fb.type}`} style={{ left: `${fb.x}%` }}
              initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -50 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
              <span>{fb.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {submitted.size === 0 && !isWalking && quizDoc === null && (
          <div className="adv-hint">Click tài liệu để bắt đầu →</div>
        )}
      </div>

      {/* QUIZ */}
      <AnimatePresence>
        {quizDoc !== null && (
          <motion.div className="quiz-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="quiz-box" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <p className="quiz-label">{DOCUMENTS[quizDoc].icon} {DOCUMENTS[quizDoc].label}</p>
              <p className="quiz-question">{DOC_QUIZZES[quizDoc].q}</p>
              <div className="quiz-options">
                {DOC_QUIZZES[quizDoc].opts.map((opt, i) => (
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
