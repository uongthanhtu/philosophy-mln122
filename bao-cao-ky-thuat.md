# BÁO CÁO KỸ THUẬT DỰ ÁN: COFFEE VALUE JOURNEY

> **Chủ đề:** Hành trình Hạt cà phê: Từ Ruộng đồng đến Tiêu dùng - Phân tích dưới góc độ Lý luận Hàng hóa (Chương 2 - Kinh tế chính trị Mác - Lênin)

---

## 1. TỔNG QUAN DỰ ÁN

Dự án là một ứng dụng web thuyết trình tương tác (**Interactive Storytelling Web-app**) được thiết kế dành riêng cho sinh viên ngành IT/Hệ thống. Ứng dụng kết hợp giữa nội dung học thuật sâu sắc và công nghệ đồ họa hiện đại để trực quan hóa các quy luật kinh tế trừu tượng.

- **Mục tiêu:** Giải thích hai thuộc tính của hàng hóa, tính hai mặt của lao động và quy luật giá trị.
- **Hình thức:** Web client-side duy nhất, tích hợp Audio Podcast từ NotebookLM và mô hình 3D/2D tương tác.

---

## 2. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Dự án được xây dựng dựa trên tư duy **System Design** để đảm bảo tính mượt mà và khả năng mở rộng:

- **Core Engine:** React.js (Quản lý trạng thái và UI).
- **Graphics Layer:** Three.js & React Three Fiber (Xử lý mô hình 3D hạt cà phê và hiệu ứng Shader).
- **Animation Engine:** GSAP (Đồng bộ hóa các chuyển động phức tạp với Timeline âm thanh).
- **Audio Engine:** HTML5 Audio API kết hợp với hệ thống **Event Listener** dựa trên `currentTime`.
- **Styling:** Tailwind CSS (Modern & Responsive).

---

## 3. KỊCH BẢN PHÂN NHÁNH (LOGIC FLOW)

Hệ thống vận hành theo cơ chế **State-driven**. Khán giả không chỉ xem mà còn trực tiếp tham gia vào quá trình hình thành giá trị của hạt cà phê.

| Chặng             | Khái niệm Triết học                     | Hình ảnh (Visuals)                                 | Hành động tương tác                                     |
| :---------------- | :-------------------------------------- | :------------------------------------------------- | :------------------------------------------------------ |
| **0. Mở đầu**     | Hàng hóa là gì?                         | Hạt cà phê 3D xoay giữa màn hình.                  | Nhấn "Bắt đầu" để kích hoạt Audio.                      |
| **1. Ruộng đồng** | Lao động cụ thể vs. Lao động trừu tượng | Hiệu ứng hạt (Particles) chảy vào nhân hạt cà phê. | **Chọn:** Hái tay (Chất lượng) vs. Máy hái (Năng suất). |
| **2. Nhà máy**    | Lao động giản đơn vs. Lao động phức tạp | Quy trình rang xay, đóng gói hiện đại.             | **Chọn:** Bán thô vs. Chế biến sâu (Espresso).          |
| **3. Thị trường** | Quy luật Giá trị & Giá cả               | Biểu đồ giá biến động quanh trục giá trị.          | **Chọn:** Giảm giá sốc vs. Chứng chỉ xanh (EUDR).       |

---

## 4. QUY TRÌNH PHỐI HỢP NOTEBOOKLM

Quy trình tạo ra "linh hồn" cho bài thuyết trình thông qua AI:

1.  **Nạp dữ liệu:** Upload tài liệu lý thuyết Chương 2 và mô tả nông sản cà phê Việt Nam vào NotebookLM.
2.  **Sinh âm thanh:** Sử dụng tính năng "Deep Dive Audio" để tạo cuộc hội thoại podcast giữa 2 chuyên gia (host).
3.  **Lấy dấu thời gian (Timestamps):** Xác định các giây cụ thể mà AI nhắc đến từ khóa (ví dụ: giây thứ 45 nhắc đến "Abstract Labor") để kích hoạt hiệu ứng hình ảnh tương ứng trong code.

---

## 5. GIẢI PHÁP VÀ KẾT LUẬN

Dựa trên hiểu biết về **Quy luật thị trường**, dự án đề xuất các giải pháp cho nông sản Việt:

- **Tăng năng suất:** Giảm thời gian lao động cá biệt xuống dưới mức xã hội nhờ công nghệ (Tối ưu giá trị).
- **Chế biến sâu:** Chuyển dịch từ lao động giản đơn sang lao động phức tạp để nhân bội giá trị hàng hóa.
- **Chứng chỉ bền vững:** Đảm bảo giá trị sử dụng đáp ứng các tiêu chuẩn quốc tế khắt khe.

---

**Footer:** _Sản phẩm sáng tạo được thiết kế bởi [Tên của bạn] - 2026._
