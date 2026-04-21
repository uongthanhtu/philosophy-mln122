import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseScene from './BaseScene';

/**
 * MarketScene — Round 3A: Giảm giá sốc
 * 
 * To reduce price, player must solve a simple math problem.
 * Click customer to sell. Money bag shrinks visually.
 */

const PRICE_LEVELS = [
  { price: 120, customers: 1, label: 'Giá gốc' },
  { price: 105, customers: 2, label: 'Giảm nhẹ' },
  { price: 90,  customers: 3, label: 'Giảm vừa' },
  { price: 75,  customers: 4, label: 'Giảm mạnh' },
  { price: 60,  customers: 5, label: 'Giảm sốc!' },
];

const CUSTOMERS = [
  { id: 0, walkTo: 55, name: 'Khách 1' },
  { id: 1, walkTo: 45, name: 'Khách 2' },
  { id: 2, walkTo: 60, name: 'Khách 3' },
  { id: 3, walkTo: 50, name: 'Khách 4' },
  { id: 4, walkTo: 65, name: 'Khách 5' },
];

const COST = 60;
const REQUIRED_SALES = 4;

// Simple theory quiz for each price reduction
const REDUCE_QUIZZES = [
  {
    q: 'Khi giảm giá, điều gì xảy ra với lợi nhuận?',
    opts: ['Tăng lên', 'Giảm xuống', 'Không đổi'],
    correct: 1,
    good: 'Đúng! Giá giảm → lợi nhuận giảm 📉',
    bad: ['Sai rồi! Giá giảm thì lợi nhuận cũng giảm 😅'],
  },
  {
    q: 'Giá cả < Giá trị sẽ dẫn đến hệ quả gì?',
    opts: ['Phát triển bền vững', 'Tiềm ẩn khủng hoảng', 'Không ảnh hưởng'],
    correct: 1,
    good: 'Chính xác! Phá giá tiềm ẩn khủng hoảng 💥',
    bad: ['Sai! Bán dưới giá trị sẽ gây bất ổn thị trường 📊'],
  },
  {
    q: 'Cung > Cầu thì giá cả sẽ?',
    opts: ['Cao hơn giá trị', 'Thấp hơn giá trị', 'Bằng giá trị'],
    correct: 1,
    good: 'Đúng! Cung lớn hơn cầu → giá giảm ✅',
    bad: ['Sai rồi! Hàng thừa → giá phải giảm 📉'],
  },
  {
    q: 'Ai là người đầu tiên phát hiện tính hai mặt của lao động?',
    opts: ['Adam Smith', 'C.Mác', 'David Ricardo'],
    correct: 1,
    good: 'Chính xác! C.Mác phát hiện ra điều này 🎓',
    bad: ['Sai! Đó là C.Mác, không phải ai khác 📚'],
  },
];

export default function MarketScene({ onComplete }) {
  const [priceLevel, setPriceLevel] = useState(0);
  const [visibleCustomers, setVisibleCustomers] = useState(0);
  const [soldTo, setSoldTo] = useState(new Set());
  const [profit, setProfit] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [totalSold, setTotalSold] = useState(0);
  const [isSelling, setIsSelling] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(null);
  const [quizReaction, setQuizReaction] = useState(null);

  const currentPrice = PRICE_LEVELS[priceLevel].price;
  const earning = currentPrice - COST;
  const moneyScale = Math.max(30, 100 - (priceLevel * 15));

  // Click reduce price → show quiz
  const handleReducePrice = useCallback(() => {
    if (priceLevel >= PRICE_LEVELS.length - 1) return;
    setQuizIdx(priceLevel);
    setQuizReaction(null);
  }, [priceLevel]);

  // Answer quiz
  const handleQuizAnswer = useCallback((chosenIdx) => {
    if (quizIdx === null) return;
    const quiz = REDUCE_QUIZZES[quizIdx % REDUCE_QUIZZES.length];
    if (chosenIdx === quiz.correct) {
      setQuizReaction({ text: quiz.good, type: 'good' });
      setTimeout(() => {
        const next = priceLevel + 1;
        setPriceLevel(next);
        setVisibleCustomers(PRICE_LEVELS[next].customers);
        setQuizIdx(null);
        setQuizReaction(null);
      }, 1000);
    } else {
      setQuizReaction({ text: quiz.bad[0], type: 'bad' });
      setTimeout(() => setQuizReaction(null), 1800);
    }
  }, [quizIdx, priceLevel]);

  // Click customer to sell
  const handleCustomerClick = useCallback((customer) => {
    if (soldTo.has(customer.id)) return;
    setSoldTo(prev => new Set([...prev, customer.id]));
    setProfit(p => p + earning);
    setTotalSold(s => s + 1);

    setFeedback(prev => [...prev.slice(-2), {
      id: Date.now(),
      text: earning > 0 ? `+${earning}k lời` : `${earning}k lỗ!`,
      x: customer.walkTo,
      type: earning > 0 ? 'good' : 'bad',
    }]);
    setTimeout(() => setFeedback(fb => fb.slice(1)), 1800);

    setIsSelling(true);
    setTimeout(() => setIsSelling(false), 600);
  }, [soldTo, earning]);

  return (
    <BaseScene
      title="Chiến lược Giảm giá"
      subtitle="Giải toán để giảm giá — Coi chừng lỗ!"
      backgroundImage="/assets/game_market_bg.webp"
      progress={totalSold}
      maxProgress={REQUIRED_SALES}
      progressLabel={`Bán: ${totalSold}/${REQUIRED_SALES} | Lợi nhuận: ${profit}k`}
      isComplete={totalSold >= REQUIRED_SALES}
      onComplete={onComplete}
    >
      <div className="adventure-field">
        <div className="adv-ground" />

        {/* ── PRICE PANEL ── */}
        <div className="mkt-price-panel">
          <div className="mkt-price-header">
            <span className="mkt-price-tag">Giá bán</span>
            <span className="mkt-price-level">{PRICE_LEVELS[priceLevel].label}</span>
          </div>

          <div className="mkt-price-big">{currentPrice}k<span>/kg</span></div>

          <div className="mkt-price-info">
            <div className="mkt-info-row">
              <span>Chi phí SX:</span>
              <span>{COST}k</span>
            </div>
            <div className={`mkt-info-row ${earning <= 0 ? 'loss' : 'profit'}`}>
              <span>Lợi nhuận/kg:</span>
              <span>{earning > 0 ? '+' : ''}{earning}k</span>
            </div>
          </div>

          <button
            className="mkt-reduce-btn-big"
            onClick={handleReducePrice}
            disabled={priceLevel >= PRICE_LEVELS.length - 1}
          >
            <span className="mkt-btn-icon">📉</span>
            <span>Giảm giá thêm</span>
            {priceLevel < PRICE_LEVELS.length - 1 && (
              <span className="mkt-btn-next">→ {PRICE_LEVELS[priceLevel + 1].price}k</span>
            )}
          </button>

          <div className="mkt-price-bar">
            {PRICE_LEVELS.map((lv, i) => (
              <div key={i}
                className={`mkt-price-dot ${i <= priceLevel ? 'active' : ''} ${i === priceLevel ? 'current' : ''}`}
              >
                <span>{lv.price}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FARMER AT STALL ── */}
        <div className={`mkt-farmer-stall ${isSelling ? 'selling' : ''}`}>
          <img src="/assets/game_farmer.webp" alt="" className={`mkt-farmer-img ${isSelling ? 'farmer-selling-anim' : ''}`} />
          <div className="mkt-counter-bar" />
          <motion.div className="mkt-money-display"
            animate={{ scale: moneyScale / 100 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <span className="mkt-money-emoji">💰</span>
            <span className={`mkt-money-amount ${profit < 0 ? 'negative' : ''}`}>{profit}k</span>
          </motion.div>
        </div>

        {/* ── CUSTOMERS ── */}
        {CUSTOMERS.slice(0, visibleCustomers).map((customer, idx) => {
          const sold = soldTo.has(customer.id);
          return (
            <motion.div key={customer.id}
              className={`mkt-customer ${sold ? 'sold' : ''}`}
              initial={{ x: 400, opacity: 0 }}
              animate={{
                x: sold ? -300 : 0,
                opacity: sold ? 0 : 1,
              }}
              transition={{ delay: idx * 0.15, duration: 0.8, type: 'spring', damping: 14 }}
              style={{
                left: `${customer.walkTo}%`,
                bottom: `${8 + idx * 4}%`,
              }}
              onClick={() => handleCustomerClick(customer)}
            >
              <img src="/assets/game_customer.webp" alt={customer.name} className="mkt-cust-img" />
              <span className="mkt-cust-name">{customer.name}</span>
              {!sold && (
                <div className="mkt-cust-click-hint">Click để bán</div>
              )}
            </motion.div>
          );
        })}

        {/* ── FEEDBACK ── */}
        <AnimatePresence>
          {feedback.map(fb => (
            <motion.div key={fb.id} className={`adv-feedback ${fb.type}`}
              style={{ left: `${fb.x}%` }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <span>{fb.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {totalSold === 0 && visibleCustomers === 0 && quizIdx === null && (
          <div className="adv-hint">Nhấn "Giảm giá" để bắt đầu thu hút khách →</div>
        )}
        {visibleCustomers > 0 && totalSold === 0 && (
          <div className="adv-hint">Click vào khách hàng để bán →</div>
        )}
      </div>

      {/* ── QUIZ OVERLAY ── */}
      <AnimatePresence>
        {quizIdx !== null && (() => {
          const quiz = REDUCE_QUIZZES[quizIdx % REDUCE_QUIZZES.length];
          return (
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
                <p className="quiz-label">📉 Trả lời để giảm giá!</p>
                <p className="quiz-question">{quiz.q}</p>
                <div className="quiz-options">
                  {quiz.opts.map((opt, i) => (
                    <button key={i} className="quiz-opt" onClick={() => handleQuizAnswer(i)}>
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
          );
        })()}
      </AnimatePresence>
    </BaseScene>
  );
}
