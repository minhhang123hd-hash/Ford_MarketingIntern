# [Tên bạn] × Ford — Interactive Internship Portfolio

Một trang portfolio cuộn-điện-ảnh (scroll-cinematic) một trang, dựng bằng HTML/CSS/JS
thuần (không cần build tool, không cần framework) — mở ra ngay trên GitHub Pages.

**Hành trình cuộn:**
1. **Video mở màn** — video reveal Ford Territory được "scrub" (tua) theo đúng
   vị trí cuộn chuột/touch, y như video mẫu bạn gửi.
2. **Cửa mở** — màn hình tách làm đôi như nóc xe mở ra, dẫn vào khoang lái.
3. **Vô lăng CV** — bạn cuộn để xoay vô lăng; mỗi vòng dừng lại ở một "trạm"
   (Profile → Education → Experience → Skills → Achievements), nội dung hiện
   lên kính lái với hiệu ứng kính mờ (glassmorphism).
4. **The End** — màn hình kết, lời kêu gọi hợp tác + cam kết 12 tháng thực tập.

## 1. Xem thử ngay trên máy

Không cần cài gì thêm, chỉ cần một static server (mở trực tiếp bằng `file://`
sẽ bị chặn video/fetch bởi trình duyệt):

```bash
cd ford-portfolio
python3 -m http.server 8080
# rồi mở http://localhost:8080
```

Hoặc dùng VS Code + extension "Live Server".

## 2. Việc bạn cần làm trước khi nộp (checklist tài sản)

Mọi chỗ cần bạn cung cấp đều đã được đánh dấu `[...]` trong code. Cụ thể:

| Việc cần làm | Ở đâu |
|---|---|
| Điền tên thật, SĐT, email, LinkedIn | `js/content.js` → object `CANDIDATE` (đầu file) |
| Đổi tiêu đề tab & meta mô tả | `index.html` → thẻ `<title>` và `<meta name="description">` |
| Đổi email nhận liên hệ ở nút "Get in touch" | tự động lấy từ `CANDIDATE.email` |
| **Thêm file CV bản PDF thật** | lưu vào `assets/CV.pdf` (nút "Tải CV" đang trỏ tới đây) |
| (Tuỳ chọn) Ảnh chân dung của bạn | lưu `assets/profile.jpg` (vuông, ≥600×600px), rồi có thể tự thêm `<img>` vào panel "Profile" trong `js/content.js` nếu muốn |
| (Tuỳ chọn) Ảnh/video minh chứng chiến dịch (TEDx, Sky Pacific...) | thêm vào `assets/` rồi chèn `<img>`/`<a>` vào phần `body` của panel "Experience" trong `js/content.js` |
| Video Ford Territory | ✅ đã có sẵn ở `assets/ford-territory-reveal.mp4` (đã nén lại từ video bạn gửi để tải nhanh hơn) |
| Logo Ford | ✅ đã có sẵn ở `assets/ford-logo.png` |

Toàn bộ **nội dung chữ** (Profile, Education, Experience, Skills, Achievements,
đoạn kêu gọi cuối trang) đã được soạn sẵn từ CV bạn gửi, nằm hết trong
`js/content.js` — sửa ở đó, không cần đụng vào HTML/CSS/JS logic.

## 3. Đưa lên GitHub (miễn phí, có link public qua GitHub Pages)

```bash
cd ford-portfolio
git init
git add .
git commit -m "Ford internship portfolio — first cut"

# Tạo repo mới trên github.com trước (ví dụ: ford-internship-portfolio),
# KHÔNG tick "Initialize with README", rồi:
git branch -M main
git remote add origin https://github.com/<username>/ford-internship-portfolio.git
git push -u origin main
```

Sau đó bật GitHub Pages:
1. Vào repo trên GitHub → **Settings → Pages**
2. Ở "Build and deployment" → Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)** → Save
4. Đợi 1–2 phút, link sẽ có dạng:
   `https://<username>.github.io/ford-internship-portfolio/`

Đây chính là link bạn gửi cho Ford.

## 4. Ghi chú kỹ thuật (nếu bạn muốn tinh chỉnh thêm)

- **Không dùng thư viện ngoài** (không GSAP, không Three.js) — toàn bộ hiệu ứng
  chạy bằng CSS `position: sticky` + một vòng lặp `requestAnimationFrame` đọc
  `window.scrollY`, nên rất nhẹ và mượt trên cả mobile.
- Muốn đổi **độ dài mỗi cảnh cuộn** (video, cửa mở, vô lăng): sửa biến
  `--scene-vh` trong `index.html` (inline style trên mỗi `<section class="scene">`)
  — số càng lớn, cảnh càng "dài hơi" khi cuộn.
- Muốn đổi **tốc độ xoay vô lăng**: sửa số `210` (độ mỗi trạm) trong
  `js/main.js`, dòng `const rotation = pCockpit * stops * 210;`.
- Trang tôn trọng `prefers-reduced-motion`: nếu người dùng bật giảm hiệu ứng
  trong hệ điều hành, các animation chuyển tiếp sẽ tắt bớt.
- Đã tối ưu để chạy tốt trên Chrome/Edge/Safari mới; video đã được chuyển từ
  AV1 sang H.264 để tương thích rộng hơn.

Chúc bạn đậu vòng phỏng vấn 🏁
