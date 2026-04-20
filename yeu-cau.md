# ĐẶC TẢ YÊU CẦU DỰ ÁN: COFFEE VALUE JOURNEY

## 1. TECH STACK YÊU CẦU

- Framework: React (Vite)
- Styling: Tailwind CSS
- Animation: GSAP + Framer Motion
- 3D: React Three Fiber (Three.js)

## 2. CÁC COMPONENT CHÍNH CẦN CODE

1. **AudioController.jsx**: Quản lý file âm thanh từ NotebookLM, phát ra sự kiện dựa trên `currentTime`.
2. **CoffeeScene.jsx**: Hiển thị hạt cà phê 3D. Sử dụng Shader để làm hạt cà phê phát sáng khi nhắc đến "Giá trị".
3. **DecisionOverlay.jsx**: Hiện 2 nút Option A/B khi audio bị pause ở các mốc timestamp.
4. **StatsDashboard.jsx**: Hiển thị các chỉ số (Chất lượng, Giá trị, Lợi nhuận) cập nhật realtime theo lựa chọn.

## 3. BỘ PROMPTS ĐỂ GEN ASSETS

### A. Prompt cho AI Image (Gen ảnh nền/Texture)

- **Texture hạt cà phê:** "Macro shot of a single roasted coffee bean, studio lighting, isolated on dark background, photorealistic, 8k."
- **Background Tây Nguyên:** "Cinematic landscape of coffee plantations in Vietnam, sunrise, morning mist, 8k resolution, wide angle."

### B. Master Prompt cho Antigravity IDE (Copy đoạn này gửi cho AI)

"Hãy xây dựng một ứng dụng React thuyết trình tương tác.
Sử dụng Three.js để hiển thị 1 hạt cà phê 3D ở giữa màn hình.
Cần một hệ thống quản lý Timeline đồng bộ với thuộc tính currentTime của thẻ Audio.
Tại mỗi mốc giây cụ thể (ví dụ 15s, 45s, 90s), hãy tạm dừng audio và hiển thị Overlay UI để người dùng chọn Option A hoặc B.
Dựa vào lựa chọn, hãy thay đổi các biến state: 'quality', 'value', 'profit' và cập nhật visual của hạt cà phê 3D (ví dụ: đổi màu, phát sáng).
Yêu cầu code sạch, sử dụng Tailwind CSS cho UI."

## 4. KỊCH BẢN CHI TIẾT (TIMELINE)

- **00s - 15s:** Intro. Hạt cà phê xoay nhẹ.
- **15s:** STOP. Khán giả chọn phương thức sản xuất.
- **16s - 45s:** Giải thích về Lao động cụ thể/trừu tượng. Visual: Particle chảy vào hạt 3D.
- **45s:** STOP. Chọn Chế biến thô hay Chế biến sâu.
- **46s - End:** Tổng kết lợi nhuận và giải thích Quy luật giá trị.
