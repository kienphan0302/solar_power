# Triển khai và hoàn tất thông tin

## 1. Thông tin công khai

Điền tên thương hiệu, tên đơn vị, hotline, Zalo, email và địa chỉ tại `src/config/site.ts`. Để trống một kênh liên hệ sẽ ẩn kênh đó khỏi giao diện.

## 2. D1

Bản xem thử dùng D1 `solar-leads` hiện có và bảng `leads`, với nguồn yêu cầu có tiền tố `/binh-nong-lanh/`. Để xem yêu cầu của website mới:

```sql
SELECT created_at, name, phone, area, source_path, status, notification_status
FROM leads
WHERE source_path LIKE '/binh-nong-lanh/%'
ORDER BY created_at DESC;
```

Để dùng cơ sở dữ liệu riêng cho production:

```bash
npx wrangler d1 create water-heater-leads
```

Thay `database_name` và `database_id` tại `wrangler.jsonc` bằng kết quả thực tế. Giữ binding là `DB`. Sau đó chạy:

```bash
npx wrangler d1 execute water-heater-leads --remote --file=schema.sql
```

Chỉ chạy lệnh remote sau khi kiểm tra đúng database trong cấu hình. Schema tạo bảng và chỉ mục nếu chưa tồn tại.

## 3. Biến môi trường

| Tên | Mục đích |
| --- | --- |
| `PUBLIC_WATER_HEATER_SITE_URL` | URL chính thức để tạo canonical và sitemap. Khi chưa đặt, Pages dùng `CF_PAGES_URL`. |
| `PUBLIC_WATER_HEATER_GTM_ID` | Container GTM riêng cho website mới; có thể để trống. |
| `PUBLIC_SITE_READY_TO_INDEX` | Chỉ đặt `true` khi đã chốt tên miền và thông tin công khai. |
| `PUBLIC_WATER_HEATER_TURNSTILE_SITE_KEY` | Site key của Turnstile nếu bật xác minh bổ sung. |
| `WATER_HEATER_TURNSTILE_SECRET_KEY` | Secret tương ứng nếu bật Turnstile; lưu dưới dạng secret. |
| `WATER_HEATER_RESEND_API_KEY` | Khóa Resend nếu muốn nhận thông báo email; lưu dưới dạng secret. |
| `WATER_HEATER_FROM_EMAIL` | Địa chỉ gửi được dịch vụ email xác minh. |
| `WATER_HEATER_NOTIFY_EMAIL` | Email nhận yêu cầu tư vấn. |

Form sử dụng kiểm tra cùng nguồn, đồng ý liên hệ, trường chống gửi tự động và giới hạn ba yêu cầu gần nhau theo số điện thoại. Nếu cấu hình Turnstile, máy chủ yêu cầu token hợp lệ. Không dùng khóa kiểm thử Turnstile trên bản công khai.

Thông báo email là tùy chọn: yêu cầu chỉ báo thành công sau khi đã lưu D1. Nếu email lỗi, yêu cầu vẫn được giữ và `notification_status` được đánh dấu để xử lý. Các biến email dùng tên riêng nên không tự sử dụng địa chỉ nhận email của website điện mặt trời.

## 4. Theo dõi chuyển đổi

Sau khi lưu thành công, trình duyệt phát sự kiện `generate_lead`, kèm `form_name: water_heater_consultation`, mã yêu cầu và đường dẫn trang. Số điện thoại, họ tên và khu vực không được đẩy vào sự kiện Analytics. Các nút liên hệ phát `click_phone` và `click_zalo` khi đã cấu hình các kênh này.

## 5. Kiểm tra sau triển khai

- Mở trang chủ và các trang sản phẩm.
- Thử tìm kiếm có dấu/không dấu, bộ lọc giá và phân trang.
- Mở `/api/health` để kiểm tra trạng thái binding và cấu hình email.
- Kiểm tra form với số điện thoại hợp lệ, kiểm tra dòng mới trong D1 và email nếu đã cấu hình.
- Gắn domain trong Pages → Custom domains, cập nhật URL chính thức và kiểm tra lại form.
