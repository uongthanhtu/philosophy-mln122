import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TheorySection — 6 slides focusing on CORE THEORY.
 * Maps precisely to req.md:
 *   1. Khái niệm hàng hóa + hai thuộc tính
 *   2. Tính hai mặt lao động (cụ thể/trừu tượng)
 *   3. Lượng giá trị + lao động giản đơn/phức tạp + năng suất
 *   4. Tiền tệ + chức năng
 *   5. Thị trường + quy luật giá trị + cung-cầu + cạnh tranh
 *   6. Thách thức & giải pháp thực tiễn VN
 */

const THEORY_SLIDES = [
  {
    id: 1,
    badge: 'Nền tảng lý luận',
    title: 'Hàng hóa & Hai thuộc tính',
    icon: '📦',
    content: [
      { type: 'def', text: 'Hàng hóa là sản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi, mua bán. Hàng hóa có thể ở dạng vật thể (cà phê) hoặc phi vật thể (dịch vụ).' },
      { type: 'heading', text: 'Hai thuộc tính không thể tách rời' },
      { type: 'card', icon: '🎯', title: 'Giá trị sử dụng',
        desc: 'Công dụng của sản phẩm — thỏa mãn nhu cầu vật chất hoặc tinh thần.\n• Cà phê: uống, pha chế, chế biến thực phẩm.\n• Nền SX càng phát triển → phát hiện nhiều GTSD phong phú hơn.\n• Người SX phải hoàn thiện GTSD để đáp ứng nhu cầu khắt khe, tinh tế hơn của người mua.' },
      { type: 'card', icon: '💎', title: 'Giá trị',
        desc: 'Lao động xã hội trừu tượng kết tinh trong hàng hóa — là cơ sở để trao đổi.\n• Giá trị trao đổi = hình thức biểu hiện bên ngoài của giá trị.\n• Để thu hồi hao phí LĐ, người SX phải bán được hàng → GTSD phải được thị trường chấp nhận.' },
      { type: 'note', text: '→ Trong game: Mỗi lựa chọn của bạn ảnh hưởng đồng thời đến cả GTSD (chất lượng) và GT (giá trị trao đổi) của hạt cà phê.' },
    ],
  },
  {
    id: 2,
    badge: 'Phát kiến của C.Mác',
    title: 'Tính hai mặt của Lao động',
    icon: '⚒️',
    content: [
      { type: 'def', text: 'C.Mác phát hiện: lao động SX hàng hóa có tính hai mặt — mặt cụ thể và mặt trừu tượng. Đây là phát hiện đầu tiên trong lịch sử, là cơ sở phân tích sản xuất giá trị thặng dư.' },
      { type: 'card', icon: '🤲', title: 'Lao động cụ thể → Tạo Giá trị sử dụng',
        desc: 'Lao động có ích dưới hình thức cụ thể của nghề nghiệp chuyên môn.\n• Mỗi loại LĐ cụ thể có mục đích, đối tượng, công cụ, phương pháp riêng.\n• Hái tay: chọn lọc quả chín → GTSD cao.\n• Phản ánh tính chất TƯ NHÂN của lao động.' },
      { type: 'card', icon: '⚙️', title: 'Lao động trừu tượng → Tạo Giá trị',
        desc: 'Hao phí sức lao động nói chung — cơ bắp, thần kinh, trí óc.\n• Là cơ sở so sánh, trao đổi các GTSD khác nhau.\n• Máy hái: năng suất cao, nhiều sản phẩm → tổng giá trị lớn.\n• Phản ánh tính chất XÃ HỘI của lao động.' },
      { type: 'note', text: '→ Mâu thuẫn: Khi sản phẩm không phù hợp nhu cầu XH, hoặc hao phí LĐ cá biệt > mức XH chấp nhận → hàng không bán được → khủng hoảng tiềm ẩn.' },
    ],
  },
  {
    id: 3,
    badge: 'Lượng giá trị',
    title: 'Năng suất & Lao động phức tạp',
    icon: '📊',
    content: [
      { type: 'def', text: 'Lượng giá trị = thời gian lao động xã hội cần thiết (không phải cá biệt). Năng suất LĐ tăng → giá trị mỗi đơn vị giảm. Cường độ LĐ tăng → tổng giá trị tăng nhưng giá trị đơn vị không đổi.' },
      { type: 'card', icon: '☀️', title: 'Lao động giản đơn',
        desc: 'Không đòi hỏi đào tạo chuyên sâu — ai cũng có thể làm.\n• Phơi khô cà phê trên sân: chi phí thấp, giá trị gia tăng ít.\n• Trong cùng thời gian, tạo ít giá trị hơn LĐ phức tạp.' },
      { type: 'card', icon: '☕', title: 'Lao động phức tạp = LĐ giản đơn × N',
        desc: 'Yêu cầu đào tạo kỹ năng, nghiệp vụ chuyên môn.\n• Rang xay espresso, đóng gói, xây dựng thương hiệu.\n• Nhân bội giá trị — đây là cơ sở xác định thù lao phù hợp.\n• 5 công đoạn chế biến sâu = 5 lần nhân bội giá trị.' },
      { type: 'note', text: '→ Trong game: Chặng 2 — Chọn phơi khô (giản đơn) hay chế biến 5 công đoạn (phức tạp). Bạn sẽ thấy giá trị tăng vượt trội khi chọn LĐ phức tạp.' },
    ],
  },
  {
    id: 4,
    badge: 'Tiền tệ',
    title: 'Bản chất & Chức năng của Tiền',
    icon: '💰',
    content: [
      { type: 'def', text: 'Tiền là hàng hóa đặc biệt, vật ngang giá chung cho thế giới hàng hóa. Tiền là kết quả phát triển lâu dài của SX và trao đổi hàng hóa: Giản đơn → Mở rộng → Chung → Tiền.' },
      { type: 'heading', text: '5 chức năng của tiền' },
      { type: 'list', items: [
        '📏 Thước đo giá trị — Giá cà phê = X VND/kg (biểu hiện bằng tiền của giá trị)',
        '🔄 Phương tiện lưu thông — Tiền làm môi giới mua-bán, tách hành vi mua/bán về thời gian & không gian',
        '🏦 Phương tiện cất trữ — Dự trữ giá trị, sẵn sàng tham gia lưu thông',
        '💳 Phương tiện thanh toán — Trả nợ, mua chịu, tiền điện tử, bitcoin',
        '🌍 Tiền tệ thế giới — Thanh toán quốc tế (USD, EUR khi xuất khẩu cà phê)',
      ]},
      { type: 'note', text: '→ Giá cả = biểu hiện bằng tiền của giá trị. Giá cả có thể lên xuống do: (1) giá trị hàng hóa, (2) giá trị của tiền, (3) quan hệ cung-cầu.' },
    ],
  },
  {
    id: 5,
    badge: 'Quy luật kinh tế',
    title: 'Vai trò Thị trường & Quy luật',
    icon: '📈',
    content: [
      { type: 'def', text: 'Thị trường là tổng hòa quan hệ kinh tế: cung, cầu, giá cả; hàng-tiền; giá trị-GTSD; hợp tác-cạnh tranh. Thị trường thực hiện giá trị hàng hóa, kích thích sáng tạo, gắn kết nền kinh tế.' },
      { type: 'card', icon: '⚖️', title: 'Quy luật Giá trị (trọng tâm)',
        desc: 'SX & trao đổi phải dựa trên hao phí LĐ XH cần thiết.\n• Giá cả xoay quanh giá trị — là "mệnh lệnh" của thị trường.\n• Người SX có hao phí cá biệt < hao phí XH → lợi nhuận.\n• Hao phí cá biệt > hao phí XH → thua lỗ, phá sản.\n• Tác động: điều tiết SX, kích thích cải tiến, phân hóa SX.' },
      { type: 'card', icon: '📉', title: 'Quy luật Cung-Cầu',
        desc: 'Cung > Cầu → giá < giá trị. Cung < Cầu → giá > giá trị.\n• Điều tiết sản xuất và lưu thông hàng hóa.\n• Cà phê: khi sản lượng thế giới tăng → giá giảm → nông dân VN bất lợi.' },
      { type: 'card', icon: '🏆', title: 'Quy luật Cạnh tranh',
        desc: 'Ganh đua giữa các chủ thể kinh tế → đổi mới công nghệ, tăng năng suất, hạ giá thành.\n• Kết quả: LLSX phát triển, nhưng cũng phân hóa giàu-nghèo.' },
      { type: 'note', text: '→ Trong game: Chặng 3 — Bạn đối mặt trực tiếp với quy luật giá trị khi quyết định giá bán và chiến lược thị trường.' },
    ],
  },
  {
    id: 6,
    badge: 'Thực tiễn Việt Nam',
    title: 'Thách thức & Giải pháp',
    icon: '🇻🇳',
    content: [
      { type: 'def', text: 'Cà phê Việt Nam đứng thứ 2 thế giới về sản lượng, nhưng giá trị xuất khẩu chưa tương xứng do 90% xuất thô (lao động giản đơn). Vận dụng quy luật thị trường để chuyển đổi.' },
      { type: 'heading', text: 'Thách thức trong lưu thông' },
      { type: 'list', items: [
        '⚠️ 90% xuất thô → giá trị gia tăng thấp (chủ yếu LĐ giản đơn)',
        '⚠️ Phụ thuộc giá thế giới → rủi ro khi cung > cầu',
        '⚠️ EUDR (châu Âu) yêu cầu chứng minh nguồn gốc không phá rừng',
        '⚠️ Cạnh tranh Brazil, Colombia — thương hiệu mạnh, chế biến sâu',
      ]},
      { type: 'heading', text: 'Giải pháp (vận dụng quy luật thị trường)' },
      { type: 'list', items: [
        '✅ Chế biến sâu = LĐ phức tạp → nhân bội giá trị (espresso, specialty coffee)',
        '✅ Xây dựng thương hiệu quốc gia → tăng GTSD cảm nhận, nâng giá cả',
        '✅ Đạt chứng chỉ EUDR / Fair Trade → đáp ứng cầu thị trường quốc tế',
        '✅ Ứng dụng công nghệ → tăng năng suất, giảm hao phí LĐ cá biệt',
      ]},
      { type: 'note', text: '→ Bây giờ hãy trải nghiệm hành trình hạt cà phê — và thấy lý thuyết kinh tế chính trị Mác-Lênin vận hành trong thực tiễn!' },
    ],
  },
];

export default function TheorySection({ onComplete }) {
  const [slide, setSlide] = useState(0);
  const current = THEORY_SLIDES[slide];
  const isLast = slide === THEORY_SLIDES.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="theory-screen"
    >
      <div className="theory-card">
        {/* Progress dots */}
        <div className="theory-dots">
          {THEORY_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`theory-dot ${i === slide ? 'active' : ''} ${i < slide ? 'done' : ''}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="theory-slide"
          >
            <div className="theory-slide-badge">{current.badge}</div>
            <h2 className="theory-slide-title">
              <span className="theory-slide-icon">{current.icon}</span>
              {current.title}
            </h2>

            <div className="theory-content">
              {current.content.map((block, i) => (
                <TheoryBlock key={i} block={block} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="theory-nav">
          <button
            className="theory-nav-btn"
            onClick={() => setSlide(s => s - 1)}
            disabled={slide === 0}
            style={{ opacity: slide === 0 ? 0.3 : 1 }}
          >
            ← Trước
          </button>
          <span className="theory-nav-counter">{slide + 1} / {THEORY_SLIDES.length}</span>
          {isLast ? (
            <button className="theory-nav-btn theory-nav-start" onClick={onComplete}>
              🎮 Vào Game →
            </button>
          ) : (
            <button className="theory-nav-btn" onClick={() => setSlide(s => s + 1)}>
              Tiếp →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TheoryBlock({ block, index }) {
  const delay = 0.05 * index;

  if (block.type === 'def') {
    return (
      <motion.div className="theory-def" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}>
        {block.text}
      </motion.div>
    );
  }
  if (block.type === 'heading') {
    return (
      <motion.h3 className="theory-heading" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}>
        {block.text}
      </motion.h3>
    );
  }
  if (block.type === 'card') {
    return (
      <motion.div className="theory-info-card" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}>
        <span className="theory-info-icon">{block.icon}</span>
        <div>
          <strong>{block.title}</strong>
          <p style={{ whiteSpace: 'pre-line' }}>{block.desc}</p>
        </div>
      </motion.div>
    );
  }
  if (block.type === 'list') {
    return (
      <motion.ul className="theory-list" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}>
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </motion.ul>
    );
  }
  if (block.type === 'note') {
    return (
      <motion.div className="theory-note" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}>
        {block.text}
      </motion.div>
    );
  }
  return null;
}
