# Website Bình Nóng Lạnh

Website Astro dành cho giới thiệu sản phẩm và nhận yêu cầu tư vấn, sử dụng Cloudflare Pages + D1 như dự án điện mặt trời.

## Dữ liệu và trang

- 61 sản phẩm từ `https://tana-daithanh.com/`, kiểm tra đủ qua sitemap và từng trang chi tiết.
- 7 nhóm chính, giữ quan hệ của 13 danh mục nguồn trong dữ liệu.
- 32 ảnh WebP cục bộ, tổng dung lượng khoảng 1,76 MB.
- 56 sản phẩm có giá; 5 mẫu sen vòi không công bố giá được giữ là “Liên hệ”.
- Trang chủ, danh mục, tìm kiếm, bộ lọc/sắp xếp/phân trang, 61 trang sản phẩm, giới thiệu, liên hệ, cẩm nang, bảo hành, giao nhận, bảo mật và trang 404.
- Form theo từng sản phẩm, lưu D1, xử lý gửi trùng, giới hạn gửi gần nhau và sự kiện `generate_lead` sau khi lưu thành công.

Tên thương hiệu mặc định là “Bình Nóng Lạnh”. Số điện thoại, Zalo, email và thông tin đơn vị vận hành đang để trống để điền theo thông tin được xác nhận. Không dùng thông tin liên hệ của cửa hàng nguồn.

## Chạy trên máy

Yêu cầu Node.js 24 trở lên.

```bash
npm ci
npm run setup
npm run check
npm test
npm run dev
```

`npm run dev` phục vụ giao diện Astro. Để thử cả API và D1 local:

```bash
npm run build
npm run db:local
npm run preview
```

Wrangler tạo dữ liệu local trong thư mục riêng của dự án; `db:local` không ghi vào D1 trên Cloudflare.

## Cá nhân hóa

- Thương hiệu, số điện thoại, Zalo, email, địa chỉ: `src/config/site.ts`.
- Dữ liệu sản phẩm: `src/data/products.json`.
- Danh mục: `src/data/categories.json` và `src/data/source-categories.json`.
- Màu sắc và bố cục: `src/styles/global.css`.
- Nội dung cẩm nang: `src/data/articles.ts`.

Giá là thông tin tham khảo từ danh mục nguồn tại ngày thu thập. Kiểm tra chính sách giá, lắp đặt và bảo hành của đơn vị vận hành trước khi mở chiến dịch.

## Cloudflare Pages

Tạo dự án Pages riêng với nhánh chứa website này:

| Mục | Giá trị |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `24` |
| D1 binding | `DB` |

Danh sách biến môi trường và cấu hình form ở `docs/deploy.md`.

## Cập nhật lại danh mục nguồn

Python cần `lxml` và `Pillow`:

```bash
python3 -m pip install lxml Pillow
npm run catalog:refresh
npm test
npm run build
```

Bộ nhập ghi lại nguồn, thời điểm, giá, thông số và ảnh. Nội dung mô tả ngắn được biên soạn từ dữ kiện; không nhập các đoạn quảng cáo dài, đánh giá hoặc thông tin liên hệ của cửa hàng nguồn. HTML nghiên cứu trong `ingestion/raw_cache/` không được đưa lên website hay bản phát hành.

## Kết cấu dữ liệu tư vấn

`wrangler.jsonc` hiện trỏ đến D1 `solar-leads` đã có của tài khoản để dùng cho bản chạy thử. Dữ liệu mới vẫn dùng bảng `leads`, và có `source_path` bắt đầu bằng `/binh-nong-lanh/` để phân biệt website. Các bản ghi cũ không bị sửa.

Khi tách hạ tầng production riêng, tạo D1 mới, thay `database_name`/`database_id` theo kết quả tạo và chạy `schema.sql` một lần. Hướng dẫn chi tiết trong `docs/deploy.md`.
