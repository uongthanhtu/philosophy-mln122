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

// Generate simple math problem for each price level
function generateMathProblem(fromPrice, toPrice) {
  const diff = fromPrice - toPrice;
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    // Addition: X + ? = fromPrice, find ?
    const a = Math.floor(Math.random() * (toPrice - 10)) + 10;
    return { q: `${a} + X = ${fromPrice}. Tìm X?`, answer: fromPrice - a, hint: `X = ${fromPrice} - ${a}` };
  } else if (type === 1) {
    // Subtraction: fromPrice - X = toPrice
    return { q: `${fromPrice} - X = ${toPrice}. X = ?`, answer: diff, hint: `Giảm bao nhiêu?` };
  } else {
    // Multiplication: X × ? = diff
    const divisor = diff <= 5 ? 1 : [3, 5].find(d => diff % d === 0) || 1;
    if (divisor === 1) {
      return { q: `${fromPrice} - X = ${toPrice}. X = ?`, answer: diff, hint: `Giảm bao nhiêu?` };
    }
    return { q: `X × ${divisor} = ${diff}. X = ?`, answer: diff / divisor, hint: `${diff} ÷ ${divisor}` };
  }
}

export default function MarketScene({ onComplete }) {
  const [priceLevel, setPriceLevel] = useState(0);
  const [visibleCustomers, setVisibleCustomers] = useState(0);
  const [soldTo, setSoldTo] = useState(new Set());
  const [profit, setProfit] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [totalSold, setTotalSold] = useState(0);
  const [isSelling, setIsSelling] = useState(false);

  // Math quiz state
  const [mathProblem, setMathProblem] = useState(null);
  const [mathInput, setMathInput] = useState('');
  const [mathReaction, setMathReaction] = useState(null);

  const currentPrice = PRICE_LEVELS[priceLevel].price;
  const earning = currentPrice - COST;
  const moneyScale = Math.max(30, 100 - (priceLevel * 15));

  // Click reduce price → show math problem
  const handleReducePrice = useCallback(() => {
    if (priceLevel >= PRICE_LEVELS.length - 1) return;
    const from = PRICE_LEVELS[priceLevel].price;
    const to = PRICE_LEVELS[priceLevel + 1].price;
    setMathProblem(generateMathProblem(from, to));
    setMathInput('');
    setMathReaction(null);
  }, [priceLevel]);

  // Submit math answer
  const handleMathSubmit = useCallback(() => {
    if (!mathProblem) return;
    const userAnswer = parseInt(mathInput, 10);
    if (isNaN(userAnswer)) {
      setMathReaction({ text: 'Nhập số đi bạn ơi! 🤦', type: 'bad' });
      return;
    }
    if (userAnswer === mathProblem.answer) {
      setMathReaction({ text: 'Đúng rồi! Giảm giá thành công 📉', type: 'good' });
      setTimeout(() => {
        const next = priceLevel + 1;
        setPriceLevel(next);
        setVisibleCustomers(PRICE_LEVELS[next].customers);
        setMathProblem(null);
        setMathReaction(null);
        setMathInput('');
      }, 1000);
    } else {
      const diff = Math.abs(userAnswer - mathProblem.answer);
      const jokes = [
        'Sai rồi! Tính lại nào 😂',
        'Gần đúng... mà chưa đúng! 🧮',
        'Toán lớp 3 mà bạn ơi! 📚',
        'Đáp án này thì phá sản luôn! 💸',
      ];
      setMathReaction({ text: jokes[Math.floor(Math.random() * jokes.length)], type: 'bad' });
      setMathInput('');
      setTimeout(() => setMathReaction(null), 1800);
    }
  }, [mathProblem, mathInput, priceLevel]);

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

        {totalSold === 0 && visibleCustomers === 0 && !mathProblem && (
          <div className="adv-hint">Nhấn "Giảm giá" để bắt đầu thu hút khách →</div>
        )}
        {visibleCustomers > 0 && totalSold === 0 && (
          <div className="adv-hint">Click vào khách hàng để bán →</div>
        )}
      </div>

      {/* ── MATH QUIZ OVERLAY ── */}
      <AnimatePresence>
        {mathProblem && (
          <motion.div
            className="quiz-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="quiz-box quiz-math"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <p className="quiz-label">🧮 Giải bài toán để giảm giá!</p>
              <p className="quiz-question">{mathProblem.q}</p>
              <div className="quiz-math-input">
                <input
                  type="number"
                  value={mathInput}
                  onChange={(e) => setMathInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMathSubmit()}
                  placeholder="Nhập đáp án..."
                  autoFocus
                  className="quiz-input"
                />
                <button className="quiz-submit" onClick={handleMathSubmit}>
                  Trả lời
                </button>
              </div>
              <AnimatePresence>
                {mathReaction && (
                  <motion.div
                    className={`quiz-reaction ${mathReaction.type}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {mathReaction.text}
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
