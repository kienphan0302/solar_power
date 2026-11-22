# Kiểm tra bộ mã — 22/11/2026

Môi trường sử dụng: Node.js 24.22.3, Astro 7.4.13, Wrangler 4.166.0.

- `npm run check`: đạt, không có lỗi/cảnh báo/hint khi kiểm tra.
- `npm run build`: đạt, tạo trang chủ, trang bảo mật, trang 404, robots và sitemap.
- `npm run test`: 8/8 kiểm tra API đạt. Phần database và dịch vụ xác minh/email trong unit tests được mô phỏng.
- `npm run db:local`: schema được tạo thành công trên D1 local qua Wrangler.
- `wrangler pages functions build`: bundle Functions thành công.

Các tình huống API đã kiểm tra: hợp lệ, sai số điện thoại/thiếu đồng ý, xác minh bot lỗi, database lỗi, email lỗi sau khi lưu, gửi lặp cùng submission ID, cross-origin, và chặn khóa Turnstile mẫu trên domain công khai.

Chưa triển khai vào tài khoản Cloudflare của bạn; chưa kiểm tra email thật, widget Turnstile thật, tracking GA4/Ads thật hoặc trải nghiệm trình duyệt trên domain production. Các bước kiểm thử trên tài khoản/domain của bạn nằm trong README-VI.md.
