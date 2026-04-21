import { motion } from 'framer-motion';

export default function GameOnboarding({ onReady }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="onb-overlay"
    >
      <motion.div
        className="onb-box"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="onb-lead">Bạn sẽ đóng vai</p>
        <h2 className="onb-heading">Nhà sản xuất Cà phê ☕</h2>
        <p className="onb-body">
          Đưa hạt cà phê qua <strong>3 chặng</strong> — từ ruộng đồng,
          qua nhà máy, đến thị trường. Mỗi lựa chọn thay đổi
          <em> giá trị</em> sản phẩm cuối cùng.
        </p>

        <div className="onb-divider" />

        <ol className="onb-list">
          <li>
            <strong>Ruộng đồng</strong> — Chọn cách thu hoạch, rồi chơi mini-game
            <span className="onb-tag green">Lao động cụ thể / trừu tượng</span>
          </li>
          <li>
            <strong>Nhà máy</strong> — Chọn cách chế biến, vận hành dây chuyền
            <span className="onb-tag amber">Lao động giản đơn / phức tạp</span>
          </li>
          <li>
            <strong>Thị trường</strong> — Chọn chiến lược bán hàng
            <span className="onb-tag red">Quy luật giá trị & cung-cầu</span>
          </li>
        </ol>

        <div className="onb-footer">
          <div className="onb-goal-box">
            🎯 Mục tiêu: Đạt <strong>giá bán cao nhất</strong> (VND/kg)
          </div>
          <p className="onb-tip">💡 Click vào vật thể trong game để tương tác</p>
        </div>

        <button className="onb-next onb-start" onClick={onReady}>
          Bắt đầu chơi
        </button>
      </motion.div>
    </motion.div>
  );
}
