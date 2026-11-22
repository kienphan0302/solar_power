# Mục “Khách hàng nói về chúng tôi”

Mục mới nằm ngay trước form tư vấn trên trang chủ, dùng màu và phông chữ của website. Giao diện tự xếp các thẻ theo chiều rộng màn hình, có tên khách hàng, nhận xét và thông tin công trình nếu được cung cấp.

## Bổ sung phản hồi

Sửa `src/data/testimonials.ts`. Mỗi phản hồi có cấu trúc:

```ts
{
  id: 'phan-hoi-01',
  name: '[Tên hiển thị đã được khách hàng đồng ý]',
  quote: '[Nội dung phản hồi thực tế đã xác nhận]',
  project: '[Giải pháp hoặc công suất đã lắp, nếu có]',
  location: '[Khu vực muốn công khai, nếu có]',
  approvedForPublication: false,
}
```

Thay các nội dung trong ngoặc vuông bằng thông tin thực tế. Chỉ đổi `approvedForPublication` thành `true` khi nội dung đã sẵn sàng đăng. Hai trường `project` và `location` có thể bỏ qua.

## Xem và xuất bản

- Chạy `npm run dev`: nếu chưa có phản hồi được duyệt, giao diện hiển thị ba vị trí mẫu, kèm thông báo rõ đây là bản xem trước bố cục.
- Chạy `npm run build`: chỉ phản hồi có `approvedForPublication: true`, tên và nhận xét không để trống mới được hiển thị.
- Nếu chưa có phản hồi được duyệt, bản xuất bản ẩn toàn bộ mục này.
- Mục mới không thêm thư viện, JavaScript chạy ở trình duyệt hoặc dữ liệu đánh giá SEO.

Kiểm tra `npm run check` và `npm run build` trước khi đưa lên website.
