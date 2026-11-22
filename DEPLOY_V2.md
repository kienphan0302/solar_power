# Triển khai Hướng Dương Solar — bản marketing V2

Bản cập nhật dành cho project `kienphan0302/solar_power` đang chạy trên Cloudflare Pages tại https://solar-power-5w7.pages.dev. Giao diện được dựng lại bằng Astro, sử dụng ảnh, thông tin doanh nghiệp và danh mục sản phẩm từ https://diennangluongmattroisolar.com, đối chiếu ngày 22/11/2026.

## 1. Những gì đã có trong bản này

- Trang chủ: giới thiệu giải pháp, sản phẩm, quy trình và đăng ký tư vấn.
- Danh mục 10 cấu hình: tìm kiếm không phân biệt dấu, lọc hòa lưới/lưu trữ, sắp xếp công suất hoặc giá.
- 10 trang chi tiết sản phẩm, mỗi trang có form tư vấn riêng.
- 2 trang giải pháp: hòa lưới bám tải và hybrid lưu trữ.
- Bảng giá tham khảo, giới thiệu công ty, liên hệ, hình ảnh và quy trình triển khai.
- 3 bài kiến thức viết mới và trang danh sách bài viết.
- Chính sách bảo mật, trang 404, sitemap và canonical URL.
- Nút gọi, Zalo, ảnh WebP được tối ưu khi build, menu responsive.
- Giữ API `/api/lead`, Turnstile và D1 hiện có. Lưu nguồn UTM khi khách chuyển sang trang khác trong cùng phiên truy cập.
- Sự kiện `generate_lead` chỉ được đẩy vào `dataLayer` khi API xác nhận tạo lead mới; có thêm `click_phone` và `click_zalo`.

Tổng cộng 24 trang HTML, bao gồm trang 404. Đây là website marketing và nhận tư vấn: quản lý nội dung bằng code/JSON, chưa có màn hình quản trị như WordPress, giỏ hàng, thanh toán hay đồng bộ WooCommerce tự động.

## 2. Áp dụng vào project trên Mac

Cần Node.js 24 trở lên, theo yêu cầu của project hiện tại. Kiểm tra bằng `node -v`.

Giải nén `solar_marketing_v2_update.zip` vào Downloads. Cấu trúc cần có:

```text
Downloads/solar_marketing_v2_update/apply-upgrade.mjs
Downloads/solar-marketing-starter/package.json
```

Mở Terminal, chạy trong thư mục project đang dùng:

```bash
cd ~/Downloads/solar-marketing-starter
git status --short
node ../solar_marketing_v2_update/apply-upgrade.mjs .
npm ci
npm run check
npm run test
npm run build
```

Nếu project ở vị trí khác, đổi lệnh `cd` tương ứng. Bộ cập nhật chỉ chép các file frontend, một file kiểm thử và tài liệu; các file bị ghi đè được sao lưu tại thư mục `solar-marketing-backups` nằm cạnh project. Không tạo repo mới, không thay `.env`, `.dev.vars`, `wrangler.jsonc`, API, schema hoặc dữ liệu D1.

Xem giao diện trên máy:

```bash
npm run dev
```

Mở http://localhost:4321. Dùng `Control+C` trong Terminal để dừng. Bước này kiểm tra giao diện; kiểm tra form có Turnstile và D1 trên URL Pages sau khi triển khai. Bản xem thử tĩnh không có API hoạt động.

## 3. Kiểm tra nội dung trước khi push

Thông tin hiện tại lấy từ website gốc:

| Nội dung | Giá trị | File chỉnh sửa |
| --- | --- | --- |
| Thương hiệu | Hướng Dương Solar | `src/config/site.ts` |
| Hotline chính | 0794 213 999 | `src/config/site.ts` |
| Zalo/hỗ trợ | 0385 195 555 | `src/config/site.ts` |
| Email | huongduongsolar8386@gmail.com | `src/config/site.ts` |
| Địa chỉ Hà Nội và TP.HCM | Hiển thị tại trang liên hệ | `src/config/site.ts` |
| Tên, công suất, giá 10 cấu hình | Bản đối chiếu ngày 22/11/2026 | `src/data/products.json` |
| Bài viết kiến thức | 3 bài viết mới | `src/data/articles.ts` |

Ảnh gốc nằm trong `src/assets/solar/`; Astro tạo ảnh WebP vào `dist` khi build. Giá được ghi rõ là tham khảo, chưa tự động đồng bộ với WordPress. Khi đổi giá, cập nhật giá và ngày đối chiếu tại các trang có chú thích. Slug sản phẩm giữ theo nguồn; một slug có chữ 6kw nhưng tên trên nguồn là 8 kW, không đổi slug tùy tiện nếu đã dùng trong quảng cáo.

Trang `/du-an/` hiện là thư viện hình ảnh minh họa và quy trình. Chỉ thay bằng hồ sơ công trình khi có ảnh, địa điểm, công suất và thông tin được xác nhận. Không có đánh giá khách hàng hay số liệu dự án được tự đặt thêm.

`readyToIndex: true` trong `src/config/site.ts` cho phép công cụ tìm kiếm lập chỉ mục. Đặt `false` nếu chỉ muốn dùng làm bản staging. Canonical lấy từ `PUBLIC_SITE_URL` tại thời điểm build.

## 4. Đưa bản mới lên Cloudflare Pages

Sau khi các lệnh kiểm tra thành công:

```bash
git diff --stat
git add src astro.config.mjs tests/campaign.test.ts DEPLOY_V2.md
git diff --cached --stat
git commit -m "Build Huong Duong Solar marketing website"
git push origin main
git rev-parse --short HEAD
```

Không cần thay origin SSH alias `github-solar` đang dùng. `git add` ở trên chỉ chọn các đường dẫn của bản cập nhật; xem lại danh sách nếu project đang có chỉnh sửa khác.

Mở Cloudflare → Workers & Pages → chọn **Pages solar-power** có tên miền `solar-power-5w7.pages.dev` → Deployments. Đợi deployment có **đúng mã commit vừa push** hiển thị dấu tích xanh. Deployment xanh cũ không xác nhận bản mới đã chạy.

Cấu hình build cần giữ:

| Mục | Giá trị |
| --- | --- |
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Thư mục gốc repo |
| D1 binding API sử dụng | `DB` → `solar-leads` |

Ba biến Production đã có, không cần tạo lại:

```dotenv
PUBLIC_SITE_URL=https://solar-power-5w7.pages.dev
PUBLIC_TURNSTILE_SITE_KEY=<Site key đã cấu hình>
TURNSTILE_SECRET_KEY=<Secret key đã cấu hình>
```

Không dán các dòng chứa dấu `<...>` vào Cloudflare. Đây chỉ là mô tả tên biến, không phải khóa thật. Không cần chạy lại `schema.sql` cho bản nâng cấp này. Không cần tạo Worker mới hoặc mua gói trả phí.

Nếu push đã thành công nhưng không có deployment mới, kiểm tra automatic deployments của branch `main`, rồi dùng Retry deployment trong Pages. Nếu deployment đỏ, mở Details và lấy dòng lỗi đầu tiên của build log.

## 5. Kiểm tra sau khi deploy

1. Mở https://solar-power-5w7.pages.dev trong cửa sổ riêng tư. Trang chủ phải có ảnh mái nhà và tiêu đề “Năng lượng từ nắng. Giá trị cho mái nhà.”
2. Vào `/san-pham/`, tìm `8kw`, chọn Hybrid lưu trữ: có đúng một cấu hình giá tham khảo 80.000.000 đồng.
3. Mở chi tiết, chọn nhận tư vấn. Form nằm trên chính trang sản phẩm.
4. Thử giao diện trên điện thoại thật: menu, hai nút gọi/Zalo, bộ lọc, form và không cuộn ngang.
5. Để kiểm tra nguồn quảng cáo, mở `/?utm_source=google&utm_medium=cpc&utm_campaign=test_v2`, đi qua danh mục tới sản phẩm rồi tự gửi một yêu cầu thử với thông tin liên hệ của mình. Không cần chèn UTM thủ công vào từng link.
6. Xem kết quả trong D1 bằng lệnh sau; mã ID/phone không được đưa vào repo:

```bash
npx wrangler d1 execute solar-leads --remote --command "SELECT id, created_at, source_path, utm_source, utm_medium, utm_campaign FROM leads ORDER BY created_at DESC LIMIT 5;"
```

Dòng mới phải có đường dẫn sản phẩm và `google / cpc / test_v2`. Biểu mẫu báo thành công khi lưu lead; email thông báo chỉ hoạt động nếu các biến email của API đã được cấu hình riêng. Bản này chưa thêm dịch vụ email hoặc màn hình quản lý lead.

Các kiểm tra đã chạy khi chuẩn bị bản cập nhật: Astro check không lỗi, build 24 trang, 10 kiểm thử tự động đạt; kiểm tra liên kết/ảnh nội bộ không thiếu; kiểm tra trình duyệt desktop cho trang chủ, tìm kiếm, lọc và đường dẫn tới form. Tốc độ thực tế/Core Web Vitals cần đo trên URL đã deploy, chưa có điểm Lighthouse production được xác nhận.

## 6. Bước tiếp theo sau khi xác nhận bản mới chạy ổn

- Bổ sung ảnh công trình và nội dung doanh nghiệp thật theo dữ liệu anh có.
- Thêm `PUBLIC_GTM_ID` nếu cần dùng container GTM của mình; sau đó rebuild. Các sự kiện trong code chưa tự tạo tài khoản GA4/Google Ads hay cấu hình chuyển đổi.
- Chạy PageSpeed Insights trên URL Pages và thử form lại trên điện thoại trước khi đưa link vào chiến dịch.
- Khi chuyển tên miền chính: lập bảng chuyển hướng URL cũ, thêm custom domain trong Pages, cập nhật `PUBLIC_SITE_URL`, hostname của Turnstile và rebuild. Chỉ chuyển DNS sau khi kiểm tra xong bản mới.
- Một số trang WordPress nguồn có lẫn nội dung quảng cáo casino trong lúc đối chiếu. Bản mới chỉ lấy danh mục và ảnh đã chọn, không sao chép HTML/plugin đó. Website WordPress cũ vẫn cần rà soát riêng nguyên nhân trước khi tiếp tục sử dụng.

Nếu cần quay lại giao diện trước: dùng **Rollback to this deployment** ở deployment xanh trước đó trong Pages. Sau đó dùng bản sao lưu mà chương trình cập nhật đã in đường dẫn để khôi phục source tương ứng, hoặc `git revert` commit cập nhật rồi push. Dữ liệu D1 được giữ nguyên khi rollback giao diện.
