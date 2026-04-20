export const TIMELINE_CONFIG = {
  totalDuration: 210,
  stages: [
    {
      id: 'intro',
      title: 'Khởi đầu',
      concept: 'Hàng hóa là gì?',
      startTime: 0,
      decisionTime: null,
      endTime: 25,
      decision: null,
      visuals: {
        beanColor: '#2d5016', beanScale: 0.8, glowIntensity: 0, glowColor: '#4ade80',
        particleMode: 'idle', particleColor: '#4ade80', particleSpeed: 0.3, particleCount: 800,
        cameraDistance: 6, cameraY: 0, background: 'dark',
      },
    },
    {
      id: 'field',
      title: 'Chặng 1: Ruộng đồng',
      concept: 'Lao động cụ thể vs. Lao động trừu tượng',
      startTime: 25, decisionTime: 25, endTime: 80,
      decision: {
        question: 'Bạn chọn phương thức sản xuất nào?',
        subtitle: 'Lao động cụ thể vs. Lao động trừu tượng',
        optionA: {
          id: 'handpick', label: 'Hái tay thủ công', icon: '🤲',
          description: 'Lao động cụ thể — Chất lượng cao, chọn lọc kỹ từng quả chín',
          image: '/assets/hand_picking_coffee.webp',
          effects: { quality: 25, value: 15, profit: -10 },
        },
        optionB: {
          id: 'machine', label: 'Máy hái công nghiệp', icon: '⚙️',
          description: 'Lao động trừu tượng — Năng suất cao, giảm thời gian lao động',
          image: '/assets/machine_harvesting.webp',
          effects: { quality: -10, value: 5, profit: 20 },
        },
      },
      visuals: {
        beanColor: '#3a5a1c', beanScale: 1.0, glowIntensity: 0.2, glowColor: '#4ade80',
        particleMode: 'flowIn', particleColor: '#86efac', particleSpeed: 0.5, particleCount: 1500,
        cameraDistance: 5, cameraY: 0.3, background: 'highland',
      },
      visualsAfterDecision: {
        handpick: { beanColor: '#2d4a12', glowIntensity: 0.3, glowColor: '#22c55e', particleColor: '#86efac', particleSpeed: 0.3, particleCount: 800 },
        machine: { beanColor: '#6b4423', glowIntensity: 0.15, glowColor: '#fbbf24', particleColor: '#fde68a', particleSpeed: 1.2, particleCount: 2500 },
      },
    },
    {
      id: 'factory',
      title: 'Chặng 2: Nhà máy',
      concept: 'Lao động giản đơn vs. Lao động phức tạp',
      startTime: 80, decisionTime: 80, endTime: 145,
      decision: {
        question: 'Bạn chọn cách chế biến nào?',
        subtitle: 'Lao động giản đơn vs. Lao động phức tạp',
        optionA: {
          id: 'raw', label: 'Bán thô (Phơi khô)', icon: '☀️',
          description: 'Lao động giản đơn — Chi phí thấp, giá trị gia tăng ít',
          image: '/assets/raw_processing.webp',
          effects: { quality: 5, value: 5, profit: 5 },
        },
        optionB: {
          id: 'deep', label: 'Chế biến sâu (Espresso)', icon: '☕',
          description: 'Lao động phức tạp — Kỹ thuật cao, nhân bội giá trị',
          image: '/assets/deep_processing.webp',
          effects: { quality: 15, value: 25, profit: 15 },
        },
      },
      visuals: {
        beanColor: '#7c5a3c', beanScale: 1.2, glowIntensity: 0.3, glowColor: '#f59e0b',
        particleMode: 'spiral', particleColor: '#fbbf24', particleSpeed: 0.8, particleCount: 2000,
        cameraDistance: 4.5, cameraY: 0.5, background: 'factory',
      },
      visualsAfterDecision: {
        raw: { beanColor: '#a0845c', glowIntensity: 0.15, glowColor: '#d97706', particleColor: '#fcd34d', particleSpeed: 0.4, particleCount: 1000 },
        deep: { beanColor: '#3c1a00', glowIntensity: 0.8, glowColor: '#f59e0b', particleColor: '#fbbf24', particleSpeed: 1.5, particleCount: 3000 },
      },
    },
    {
      id: 'market',
      title: 'Chặng 3: Thị trường',
      concept: 'Quy luật Giá trị & Giá cả',
      startTime: 145, decisionTime: 145, endTime: 195,
      decision: {
        question: 'Chiến lược thị trường nào bạn chọn?',
        subtitle: 'Quy luật Giá trị & Giá cả thị trường',
        optionA: {
          id: 'discount', label: 'Giảm giá sốc', icon: '📉',
          description: 'Giá cả < Giá trị — Bán nhiều nhưng phá giá thị trường',
          image: '/assets/coffee_market.webp',
          effects: { quality: -15, value: -10, profit: 25 },
        },
        optionB: {
          id: 'green', label: 'Chứng chỉ xanh (EUDR)', icon: '🌿',
          description: 'Giá trị sử dụng đáp ứng tiêu chuẩn quốc tế — Bền vững',
          image: '/assets/green_certificate.webp',
          effects: { quality: 20, value: 20, profit: 10 },
        },
      },
      visuals: {
        beanColor: '#4a2800', beanScale: 1.4, glowIntensity: 0.5, glowColor: '#ef4444',
        particleMode: 'burst', particleColor: '#fca5a5', particleSpeed: 1.0, particleCount: 2500,
        cameraDistance: 4, cameraY: 0, background: 'market',
      },
      visualsAfterDecision: {
        discount: { beanColor: '#6b3a1f', glowIntensity: 0.2, glowColor: '#ef4444', particleColor: '#fca5a5', particleSpeed: 2.0, particleCount: 3500 },
        green: { beanColor: '#2c1810', glowIntensity: 1.0, glowColor: '#22c55e', particleColor: '#86efac', particleSpeed: 0.6, particleCount: 2000 },
      },
    },
    {
      id: 'summary',
      title: 'Tổng kết',
      concept: 'Quy luật Giá trị trong nền kinh tế thị trường',
      startTime: 195, decisionTime: null, endTime: 210,
      decision: null,
      visuals: {
        beanColor: '#1a0a00', beanScale: 1.6, glowIntensity: 1.0, glowColor: '#fbbf24',
        particleMode: 'celebrate', particleColor: '#fbbf24', particleSpeed: 0.8, particleCount: 4000,
        cameraDistance: 5, cameraY: 0, background: 'dark',
      },
    },
  ],
};

export function calculatePrice(stats) {
  const base = 40000;
  const q = 1 + (stats.quality - 50) / 100;
  const v = 1 + (stats.value - 50) / 50;
  const p = 1 + (stats.profit - 50) / 80;
  return Math.round(base * q * v * p);
}

export function getCurrentStage(time, stages) {
  for (let i = stages.length - 1; i >= 0; i--) {
    if (time >= stages[i].startTime) return stages[i];
  }
  return stages[0];
}
