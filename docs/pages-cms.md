# Quản trị nội dung Solar Power

Mở https://app.pagescms.org/kienphan0302/solar_power/main. Save lưu trực tiếp lên main; Cloudflare tự build khi Git integration bật.

- Sản phẩm: sửa giá, tên, công suất, ảnh thay thế. Không đổi ID/slug hay xóa sản phẩm nổi bật. Bỏ trống ảnh thay thế để dùng ảnh gốc.
- Bài viết SEO: tạo bài mới, dùng filename không dấu dạng ten-bai-viet.json. URL là /kien-thuc/<slug>/. Sửa các mục nội dung, meta SEO, ảnh; không đổi tên bài đã xuất bản. Thứ tự nhỏ xuất hiện trước.
- Banner: chỉnh tiêu đề, mô tả, chữ nút, ảnh và SEO trang chủ. Đích nút không đổi. Để trống ảnh để dùng banner cũ.
- Liên hệ: sửa hotline, Zalo, email công khai, địa chỉ và tên công ty. Email nhận lead là cấu hình riêng của Cloudflare.
- Media: tải ảnh WebP đã nén vào thư mục CMS; không xóa ảnh đang dùng. Không tải dữ liệu khách hàng hoặc khóa API.
- Sau Save kiểm tra commit và Cloudflare Deployments. Trước khi sửa code trên máy chạy git pull origin main. Build chạy npm run check:cms trước Astro; chạy thêm npm run check và npm test khi sửa code.
