import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* Crossfade slideshow for each slide's image area */
function SlideShow({ frames, caption, interval = 4000 }) {
  const [tick, setTick] = useState(0);
  const idx = tick % frames.length;

  useEffect(() => {
    const t = setInterval(() => setTick(t => t + 1), interval);
    return () => clearInterval(t);
  }, [frames.length, interval]);

  const even = tick % 2 === 0;
  const kenBurns = {
    initial: { scale: 1.08, x: even ? -10 : 10, y: even ? -5 : 5 },
    animate: { scale: 1.0,  x: even ? 10 : -10, y: even ? 5 : -5 },
  };

  return (
    <div className="slide-img-half">
      <div className="slide-img-glow" />
      <div className="slide-img-frame">
        <AnimatePresence initial={false}>
          <motion.img
            key={tick}
            src={frames[idx]}
            alt=""
            initial={{ opacity: 0, ...kenBurns.initial }}
            animate={{ opacity: 1, ...kenBurns.animate }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.8 }, scale: { duration: interval / 1000, ease: 'linear' }, x: { duration: interval / 1000, ease: 'linear' }, y: { duration: interval / 1000, ease: 'linear' } }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
        <div className="slide-img-caption">{caption}</div>
      </div>
    </div>
  );
}

const FRAMES = {
  theory: ['/assets/pres_theory.webp', '/assets/theory_f2.webp', '/assets/theory_f3.webp'],
  hero:   ['/assets/pres_hero.webp', '/assets/hero_f2.webp'],
  money:  ['/assets/pres_money.webp', '/assets/money_f2.webp'],
  market: ['/assets/pres_market.webp', '/assets/market_f2.webp'],
};

export default function PresentationScreen({ onStartGame }) {
  return (
    <div className="deck">
      {/* ━━━━━━━━ SLIDE 1: HERO ━━━━━━━━ */}
      <section className="slide slide-hero">
        <img className="slide-bg" src="/assets/pres_hero.webp" alt="" />
        <div className="slide-dim" />
        <div className="slide-center">
          <Fade delay={0.3}><span className="slide-badge">Kinh tế Chính trị Mác – Lênin · Chương 2</span></Fade>
          <Fade delay={0.5}><h1>Hành trình của<br /><span className="slide-gold">Hạt Cà Phê</span></h1></Fade>
          <Fade delay={0.8}><p className="slide-sub">Từ Ruộng đồng đến Tay người tiêu dùng —<br />Phân tích dưới góc độ Lý luận Hàng hóa</p></Fade>
          <Fade delay={1.4}><div className="slide-scroll"><div className="slide-scroll-bar" /><span>Cuộn xuống</span></div></Fade>
        </div>
      </section>

      {/* ━━━━━━━━ SLIDE 2: HAI THUỘC TÍNH HÀNG HÓA ━━━━━━━━ */}
      <section className="slide slide-split">
        <SlideShow frames={FRAMES.theory} caption="Cà phê — hàng hóa tiêu biểu của Việt Nam" interval={2500} />
        <div className="slide-text-half">
          <RevealBlock>
            <span className="slide-badge sm">Trọng tâm 1 · Hàng hóa</span>
            <h2>Hai thuộc tính của Hàng hóa</h2>
            <p>
              Theo C.Mác, <strong>hàng hóa</strong> là sản phẩm của lao động, thỏa mãn nhu cầu con người
              thông qua trao đổi, mua bán. Mọi hàng hóa đều có <strong>hai thuộc tính không thể tách rời</strong>:
            </p>
            <div className="slide-card green">
              <h3>Giá trị sử dụng</h3>
              <p>
                Công dụng của sản phẩm — thỏa mãn nhu cầu vật chất hoặc tinh thần.
                <br /><strong>Cà phê:</strong> Dùng để uống, pha chế, chế biến thực phẩm; cung cấp caffein, hương vị đặc trưng.
                <br /><em>→ Người sản xuất phải hoàn thiện GTSD để đáp ứng nhu cầu ngày càng khắt khe của người mua.</em>
              </p>
            </div>
            <div className="slide-card amber">
              <h3>Giá trị</h3>
              <p>
                Lao động xã hội trừu tượng kết tinh trong hàng hóa. Lượng giá trị = thời gian lao động xã hội cần thiết.
                <br /><strong>Cà phê:</strong> Công sức trồng trọt, chăm sóc, thu hoạch, chế biến đều "kết tinh" thành giá trị.
                <br /><em>→ Giá trị trao đổi là hình thức biểu hiện bên ngoài của giá trị.</em>
              </p>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ━━━━━━━━ SLIDE 3: TÍNH HAI MẶT LAO ĐỘNG ━━━━━━━━ */}
      <section className="slide slide-split reverse">
        <div className="slide-text-half">
          <RevealBlock>
            <span className="slide-badge sm">Trọng tâm 2 · Lao động</span>
            <h2>Tính hai mặt của Lao động sản xuất hàng hóa</h2>
            <p>
              C.Mác là người <strong>đầu tiên phát hiện</strong> lao động sản xuất hàng hóa có tính hai mặt —
              đây là cơ sở để phân tích khoa học về sản xuất giá trị thặng dư.
            </p>
            <div className="slide-card green">
              <h3>Lao động cụ thể → Giá trị sử dụng</h3>
              <p>
                Lao động có ích dưới hình thức cụ thể, với mục đích, đối tượng, công cụ, phương pháp riêng.
                <br /><strong>VD:</strong> Hái tay thủ công → chọn từng quả chín, chất lượng cao. Phân công LĐ càng phát triển → càng nhiều GTSD.
              </p>
            </div>
            <div className="slide-card blue">
              <h3>Lao động trừu tượng → Giá trị</h3>
              <p>
                Hao phí sức lao động nói chung — cơ bắp, thần kinh, trí óc — không kể hình thức cụ thể.
                <br /><strong>VD:</strong> Máy hái → năng suất cao, thời gian lao động cá biệt giảm → ưu thế cạnh tranh.
              </p>
            </div>
            <div className="slide-note">
              <strong>Lao động phức tạp = LĐ giản đơn × N</strong>
              <br />Rang xay espresso (phức tạp, cần đào tạo) tạo nhiều giá trị hơn phơi khô (giản đơn, ai cũng làm được).
              <br /><em>→ Đây là cơ sở xác định mức thù lao phù hợp với tính chất lao động.</em>
            </div>
          </RevealBlock>
        </div>
        <SlideShow frames={FRAMES.hero} caption="Ruộng cà phê Tây Nguyên — nơi bắt đầu chuỗi giá trị" interval={3000} />
      </section>

      {/* ━━━━━━━━ SLIDE 4: TIỀN TỆ, GIÁ CẢ & QUY LUẬT THỊ TRƯỜNG ━━━━━━━━ */}
      <section className="slide slide-split">
        <SlideShow frames={FRAMES.money} caption="Tiền tệ — thước đo và phương tiện trao đổi giá trị" interval={2500} />
        <div className="slide-text-half">
          <RevealBlock>
            <span className="slide-badge sm">Trọng tâm 3 · Thị trường</span>
            <h2>Tiền tệ, Giá cả & Quy luật Thị trường</h2>
            <p>
              <strong>Tiền</strong> là hàng hóa đặc biệt, vật ngang giá chung.
              <strong> Giá cả</strong> = biểu hiện bằng tiền của giá trị hàng hóa, dao động xung quanh giá trị do cung-cầu.
            </p>
            <div className="slide-funcs">
              <span>Thước đo giá trị</span>
              <span>PT lưu thông</span>
              <span>PT cất trữ</span>
              <span>PT thanh toán</span>
              <span>Tiền tệ thế giới</span>
            </div>
            <div className="slide-laws">
              <div className="slide-law-item">
                <h4>Quy luật Giá trị</h4>
                <p>SX & trao đổi dựa trên hao phí LĐ xã hội cần thiết. Giá cả xoay quanh giá trị — đây là "mệnh lệnh" của thị trường.</p>
              </div>
              <div className="slide-law-item">
                <h4>Quy luật Cung–Cầu</h4>
                <p>Cung &gt; Cầu → giá giảm dưới giá trị. Cung &lt; Cầu → giá tăng. Điều tiết sản xuất & lưu thông hàng hóa.</p>
              </div>
              <div className="slide-law-item">
                <h4>Quy luật Cạnh tranh</h4>
                <p>Ganh đua giữa các chủ thể → đổi mới công nghệ, tăng năng suất, hạ giá thành → phân hóa người sản xuất.</p>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ━━━━━━━━ SLIDE 5: THÁCH THỨC & GIẢI PHÁP ━━━━━━━━ */}
      <section className="slide slide-split reverse">
        <div className="slide-text-half">
          <RevealBlock>
            <span className="slide-badge sm">Trọng tâm 4 · Thực tiễn</span>
            <h2>Cà phê Việt Nam — Thách thức & Giải pháp</h2>
            <p className="slide-stat">
              Việt Nam đứng thứ <strong className="slide-big">#2</strong> thế giới về sản lượng cà phê,
              nhưng 90% xuất thô — giá trị thấp do chủ yếu lao động giản đơn.
            </p>
            <div className="slide-cols">
              <div className="slide-col bad">
                <h4>Thách thức</h4>
                <ul>
                  <li>90% xuất thô → giá trị gia tăng thấp</li>
                  <li>Phụ thuộc giá thế giới (quy luật cung-cầu)</li>
                  <li>EUDR yêu cầu chứng minh nguồn gốc bền vững</li>
                  <li>Cạnh tranh Brazil, Colombia (thương hiệu mạnh)</li>
                </ul>
              </div>
              <div className="slide-col good">
                <h4>Giải pháp (theo quy luật thị trường)</h4>
                <ul>
                  <li>Chế biến sâu = LĐ phức tạp → nhân bội giá trị</li>
                  <li>Xây dựng thương hiệu quốc gia → tăng GTSD cảm nhận</li>
                  <li>Đạt chứng chỉ EUDR/Fair Trade → đáp ứng cầu quốc tế</li>
                  <li>Ứng dụng công nghệ → tăng năng suất, giảm chi phí</li>
                </ul>
              </div>
            </div>
          </RevealBlock>
        </div>
        <SlideShow frames={FRAMES.market} caption="Xuất khẩu cà phê — thị trường quốc tế" interval={2000} />
      </section>

      {/* ━━━━━━━━ SLIDE 6: CTA — VÀO GAME ━━━━━━━━ */}
      <section className="slide slide-hero slide-cta-bg">
        <img className="slide-bg" src="/assets/pres_hero.webp" alt="" style={{ filter: 'brightness(0.3) blur(2px)' }} />
        <div className="slide-dim" />
        <div className="slide-center">
          <Fade><h2>Trải nghiệm tương tác</h2></Fade>
          <Fade delay={0.2}><p className="slide-sub">Đóng vai nhà sản xuất cà phê — đưa ra 3 quyết định chiến lược, chơi mini-game<br />và thấy lý thuyết kinh tế chính trị vận hành trong thực tiễn.</p></Fade>
          <Fade delay={0.4}>
            <div className="slide-steps">
              <div className="slide-step"><span className="slide-step-n">01</span><strong>Ruộng đồng</strong><span>LĐ cụ thể vs trừu tượng</span></div>
              <span className="slide-arrow">→</span>
              <div className="slide-step"><span className="slide-step-n">02</span><strong>Nhà máy</strong><span>LĐ giản đơn vs phức tạp</span></div>
              <span className="slide-arrow">→</span>
              <div className="slide-step"><span className="slide-step-n">03</span><strong>Thị trường</strong><span>Quy luật giá trị & cung-cầu</span></div>
            </div>
          </Fade>
          <Fade delay={0.7}>
            <motion.button className="slide-btn" onClick={onStartGame}
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(251,191,36,0.45)' }}
              whileTap={{ scale: 0.97 }}>
              Bắt đầu Hành trình
            </motion.button>
          </Fade>
        </div>
      </section>
    </div>
  );
}

function Fade({ children, delay = 0 }) {
  return (
    <motion.div initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay, duration: 0.6 }}>
      {children}
    </motion.div>
  );
}

function RevealBlock({ children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6 }}>
        {children}
      </motion.div>
    </div>
  );
}
