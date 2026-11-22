# Tự triển khai trang marketing điện mặt trời bằng Astro

Tài liệu và bộ mã mẫu dành cho developer Java muốn tự xây một trang marketing có form tư vấn. Ngày biên soạn: 22/11/2026.

## 1. Kết quả sau khi hoàn thành

- Trang giới thiệu điện mặt trời gia đình, responsive, có giải pháp, quy trình và câu hỏi thường gặp.
- Form gửi yêu cầu đến `POST /api/lead` cùng domain.
- Lead được lưu vào Cloudflare D1 trước khi trả về thành công.
- Chống spam bằng Turnstile, xác minh token phía server.
- Email thông báo tùy chọn qua Resend; lỗi email không làm mất lead đã lưu.
- Các sự kiện `generate_lead`, `click_phone`, `click_zalo` được đẩy vào `dataLayer`.
- Sitemap, canonical, robots.txt, trang 404 và trang bảo mật dự thảo.

Đây là bộ khởi đầu cho website marketing, chưa phải website đã công bố. Bạn cần điền thông tin doanh nghiệp, nội dung thực tế và cấu hình dịch vụ. Việc gửi email thật và tracking thật phải được kiểm thử sau khi bạn cấu hình các tài khoản của mình.

Giữ WordPress ở `https://diennangluongmattroisolar.com`. Đề xuất chạy trang mới tại `https://lp.diennangluongmattroisolar.com` trên Cloudflare Pages. API cũng ở subdomain mới: `https://lp.diennangluongmattroisolar.com/api/lead`.

## 2. Chuẩn bị

1. Cài Node.js 24 LTS được cập nhật, npm và Git.
2. Có tài khoản GitHub và Cloudflare.
3. Có quyền sửa DNS của tên miền hiện tại khi gắn subdomain. Trong giai đoạn local bạn chưa cần sửa DNS.
4. Chuẩn bị một số điện thoại đã xác nhận, link Zalo, tên pháp nhân/đơn vị, địa chỉ, email và khu vực phục vụ.
5. Chuẩn bị ảnh thật, thông số và chính sách kinh doanh đã được xác nhận nếu bổ sung các nội dung này.

Kiểm tra:

```bash
node -v
npm -v
git --version
```

## 3. Chạy bộ mẫu trên máy

Giải nén, mở terminal tại thư mục `solar-marketing-starter` chứa `package.json`.

```bash
npm ci
npm run setup
npm run db:local
npm run build
npm run preview
```

Mở `http://127.0.0.1:8788`. Nếu Wrangler thông báo port khác, dùng địa chỉ mà terminal hiển thị. `npm run preview` dùng Wrangler, chạy được cả trang tĩnh và API.

Gửi một form bằng số điện thoại kiểm thử của bạn. Sau đó mở terminal thứ hai, cùng thư mục dự án, kiểm tra dữ liệu:

```bash
npx wrangler d1 execute solar-leads --local --command "SELECT id, created_at, phone, area, status, notification_status FROM leads ORDER BY created_at DESC LIMIT 10;"
```

Ở local, khóa Turnstile mẫu là khóa kiểm thử chính thức của Cloudflare. Bạn vẫn cần Internet để tải widget và gọi Siteverify. Khóa này chỉ được API chấp nhận trên `localhost`/`127.0.0.1`; API từ chối dùng khóa mẫu trên domain công khai.

Nếu cần phát triển giao diện với hot reload:

```bash
npm run dev
```

Astro thường mở cổng 4321. Chế độ này chỉ phục vụ giao diện; API trong thư mục `functions/` cần chạy qua Wrangler. Sau khi sửa giao diện, dừng Wrangler bằng Ctrl+C rồi chạy lại `npm run build` và `npm run preview` để thử form đầy đủ. Bạn không cần cấu hình Astro SSR adapter cho bộ mẫu static này.

## 4. Các file cần biết

| File | Vai trò |
|---|---|
| `src/config/site.ts` | Thương hiệu, hotline, Zalo, email, địa chỉ, trạng thái cho phép lập chỉ mục |
| `src/pages/index.astro` | Nội dung và bố cục landing page |
| `src/components/LeadForm.astro` | Form, gửi API, sự kiện dataLayer |
| `src/layouts/BaseLayout.astro` | Metadata, canonical, menu, footer, GTM |
| `src/styles/global.css` | Tailwind và CSS giao diện |
| `src/pages/chinh-sach-bao-mat.astro` | Nội dung bảo mật dự thảo cần chỉnh theo hoạt động thực tế |
| `functions/api/lead.ts` | Entry point API |
| `lib/leads.ts` | Validation, Turnstile, lưu D1, email |
| `schema.sql` | Schema D1/SQLite |
| `wrangler.jsonc` | Tên project Pages và D1 binding `DB` |
| `.env.example` | Biến công khai được Astro dùng lúc build |
| `.dev.vars.example` | Biến server dùng ở local |
| `public/_routes.json` | Giới hạn Functions ở `/api/*` |
| `tests/lead.test.ts` | Các kiểm tra API cho lưu lead và xử lý lỗi |

## 5. Thay nội dung doanh nghiệp

Sửa `src/config/site.ts`:

```ts
export const site = {
  brand: 'Tên thương hiệu đã xác nhận',
  description: 'Mô tả ngắn về dịch vụ và khu vực phục vụ.',
  phone: 'SỐ_ĐIỆN_THOẠI_THẬT',
  zalo: 'https://zalo.me/SO_ZALO_THAT',
  email: 'EMAIL_THẬT',
  address: 'ĐỊA_CHỈ_THẬT',
  serviceArea: 'KHU_VỰC_PHỤC_VỤ',
  readyToIndex: false
};
```

Điền dữ liệu thật, không giữ các chuỗi viết hoa. `phone` và `zalo` đang để trống trong bộ mẫu để tránh chọn nhầm giữa hai số liên hệ khác nhau trên website cũ. Khi có giá trị, nút gọi/Zalo sẽ xuất hiện.

Sửa phần nội dung trong `src/pages/index.astro`: nhóm khách, khu vực phục vụ, giải pháp, quy trình và FAQ. Biến `serviceArea` là cấu hình dự phòng; nội dung hiển thị khu vực trong tiêu đề/mô tả vẫn cần bạn chỉnh ở trang và config.

Thay minh họa mái nhà bằng ảnh công trình thật nếu đã có quyền sử dụng. Ảnh thêm vào `src/assets/` có thể dùng với `Image` của `astro:assets` để xử lý tối ưu; khai báo kích thước phù hợp. Ảnh phía đầu trang cần ưu tiên tải, ảnh phía dưới có thể lazy-load.

Chỉ thêm giá, công suất, mức tiết kiệm, thời gian hoàn vốn và bảo hành khi có thông tin kỹ thuật/kinh doanh đã xác nhận. Bộ mẫu chưa đưa giá, số dự án hay nhận xét khách hàng giả.

Chỉnh trang bảo mật cho đúng đơn vị, thông tin liên hệ, thời hạn lưu giữ, nhà cung cấp xử lý và tracking thực tế. Sau khi nội dung hoàn chỉnh mới đổi `readyToIndex` thành `true` nếu muốn Google lập chỉ mục. Trong giai đoạn chạy thử, `false` tạo meta noindex và robots Disallow. Đây không phải cơ chế bảo mật hoặc hạn chế người truy cập.

## 6. Kiểm tra mã trước khi đưa lên mạng

```bash
npm run check
npm run test
npm run build
```

Kiểm tra thủ công trên điện thoại: chữ, nút bấm, form, liên kết gọi/Zalo và trạng thái sau khi gửi. Bộ mẫu không tự cấu hình tài khoản GA4 hoặc gửi email thật nếu thiếu credentials.

## 7. Tạo database production

Đăng nhập Cloudflare trên máy của bạn:

```bash
npx wrangler login
npx wrangler d1 create solar-leads
```

Nếu được hỏi tự thêm binding, chọn No rồi tự sửa binding hiện có để tránh tạo hai binding. Lấy `database_id` thật từ output và thay UUID toàn số 0 trong `wrangler.jsonc`. Giữ `binding` là `DB` và `database_name` là `solar-leads`.

```json
{
  "name": "solar-marketing",
  "pages_build_output_dir": "./dist",
  "compatibility_date": "2026-11-22",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "solar-leads",
      "database_id": "THAY_BANG_DATABASE_ID_THAT"
    }
  ]
}
```

Giữ `$schema` trong file gốc nếu đang có. Chạy schema trên D1 thật:

```bash
npx wrangler d1 execute solar-leads --remote --file=schema.sql
```

`--local` là database trên máy; `--remote` là database trên Cloudflare. Tạo bảng local không tự tạo bảng remote. `schema.sql` dùng CREATE IF NOT EXISTS, chạy lại không xóa dữ liệu hiện có; khi thay đổi schema sau này nên dùng migrations.

## 8. Đẩy source lên GitHub

Tạo repository mới `solar-marketing`, có thể để private. Từ thư mục dự án:

```bash
git init
git add .
git commit -m "Initial solar marketing website"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/solar-marketing.git
git push -u origin main
```

Thay `YOUR_ACCOUNT` bằng tài khoản của bạn. Source đã có `.gitignore` để bỏ qua `.env`, `.dev.vars`, build, node_modules và dữ liệu local. Database ID không phải secret; API key và Turnstile secret phải để ngoài source. Tệp `package-lock.json` được giữ để cài lại dependencies bằng `npm ci`.

## 9. Tạo Cloudflare Pages bằng Git integration

1. Mở Cloudflare Dashboard → Workers & Pages → Create application → Pages.
2. Chọn Import existing Git repository / Connect to Git, kết nối repository vừa tạo.
3. Đặt project name `solar-marketing` hoặc một tên còn trống. Nếu chọn tên khác, cập nhật trường `name` trong `wrangler.jsonc` cho thống nhất.
4. Chọn production branch `main`.
5. Build command: `npm run build`.
6. Build output directory: `dist`.
7. Đặt biến build `NODE_VERSION` thành bản Node 24 được cập nhật, ví dụ `24.22.3` là bản đã dùng kiểm tra bộ mẫu.
8. Tạm tắt preview deployments cho các nhánh nếu chưa cấu hình database và khóa riêng cho Preview.
9. Deploy bản thử; lấy chính xác URL `https://TEN_PROJECT.pages.dev` Cloudflare trả về.

Chọn Git integration ngay từ đầu để push lên GitHub sẽ tự build lại. Tên project có thể được Cloudflare thêm hậu tố nếu trùng; không đoán URL. Không dùng drag-and-drop chỉ thư mục dist vì bộ mẫu còn có Pages Functions.

Bản deploy đầu có thể hiển thị giao diện nhưng chưa gửi được form cho đến khi hoàn thành bước cấu hình Turnstile và secrets.

## 10. Cấu hình Turnstile thật

1. Cloudflare Dashboard → Turnstile → Add widget.
2. Chọn Managed widget.
3. Thêm hostname Pages thật, ví dụ `TEN_PROJECT.pages.dev` và hostname dự kiến `lp.diennangluongmattroisolar.com`.
4. Lấy site key và secret key.
5. Trong Pages → Settings → Variables and Secrets, đặt biến công khai ở môi trường Production:

```text
PUBLIC_SITE_URL=https://TEN_PROJECT.pages.dev
PUBLIC_TURNSTILE_SITE_KEY=SITE_KEY_THAT
PUBLIC_GTM_ID=
```

6. Tạo secret `TURNSTILE_SECRET_KEY` bằng secret thật. Giá trị này là runtime secret, không thêm tiền tố PUBLIC.
7. Kiểm tra D1 binding trong cấu hình là `DB`, trỏ tới database production đúng ID trong `wrangler.jsonc`.
8. Redeploy / Retry deployment để biến build được đưa vào HTML và secrets/bindings có hiệu lực.

Nếu đã chọn dùng custom domain ngay, `PUBLIC_SITE_URL` nên là URL custom domain và redeploy sau khi domain hoạt động. API chỉ nhận request cùng origin; hostname Turnstile phải khớp hostname đang dùng. Tạo widget/config riêng cho Preview nếu muốn thử trên các URL preview khác.

## 11. Tùy chọn bật email báo sales

1. Tạo tài khoản Resend.
2. Add domain/subdomain do bạn sở hữu, ví dụ `notify.diennangluongmattroisolar.com`.
3. Thêm bản ghi DNS được Resend cung cấp, đợi trạng thái Verified.
4. Tạo API key phù hợp với việc gửi email.
5. Trong Pages → Production, tạo các runtime secrets:

```text
RESEND_API_KEY=API_KEY_THAT
LEAD_FROM_EMAIL=Solar <lead@notify.diennangluongmattroisolar.com>
LEAD_NOTIFY_EMAIL=EMAIL_NGUOI_PHU_TRACH
```

6. Redeploy rồi gửi một form bằng thông tin của bạn, kiểm tra cả inbox và spam.

Email người nhận phải là người phụ trách được doanh nghiệp cho phép tiếp nhận yêu cầu. Bộ mẫu không tự gửi email khi bạn chưa cấu hình các biến trên.

Các giá trị `notification_status`: `not_configured` = chưa cấu hình email; `pending` = đang chờ gửi; `sent` = nhà cung cấp chấp nhận gửi; `failed` = gửi thông báo thất bại. `sent` chưa khẳng định người nhận đã đọc hoặc thư đã vào inbox. Đối chiếu dashboard Resend khi cần.

API dùng `waitUntil` cho email, không phải hàng đợi có retry đảm bảo. Lead vẫn nằm trong D1; kiểm tra các dòng failed/pending và xử lý thủ công. Khi lượng khách tăng, có thể bổ sung queue và retry.

## 12. Gắn tên miền phụ cho trang marketing

Đề xuất: `lp.diennangluongmattroisolar.com`.

1. Pages → project → Custom domains → Set up a domain.
2. Nhập hostname phụ trên, làm theo hướng dẫn của Cloudflare.
3. Nếu DNS đang ở nhà cung cấp khác, thêm CNAME `lp` trỏ đến hostname Pages thực tế do project cung cấp. Cần khai báo custom domain ở Pages trước; chỉ tạo CNAME là chưa đủ.
4. Không thay bản ghi tên miền gốc đang phục vụ WordPress và không thay bản ghi email hiện hữu khi chỉ thêm subdomain.
5. Đợi domain và HTTPS hoạt động.
6. Đảm bảo hostname phụ đã được cho phép trong Turnstile.
7. Đặt biến build `PUBLIC_SITE_URL=https://lp.diennangluongmattroisolar.com` và redeploy.
8. Kiểm tra canonical, sitemap, link gọi/Zalo và form trên tên miền thật.

Cloudflare Pages hỗ trợ custom subdomain qua CNAME mà không bắt buộc đổi nameserver của toàn bộ tên miền. Tên miền gốc có quy trình khác; bộ hướng dẫn này sử dụng subdomain.

## 13. Cấu hình GA4 và Google Ads

1. Tận dụng GA4/Google Ads của doanh nghiệp nếu đã có để giữ dữ liệu liên tục.
2. Tạo hoặc dùng GTM container thích hợp. Chỉ cài một bộ tag cho cùng mục đích để tránh đếm trùng.
3. Đặt `PUBLIC_GTM_ID=GTM-XXXXXXX` trong biến build Production, redeploy.
4. Trong GTM, cấu hình Google tag cho measurement ID GA4 của bạn.
5. Tạo Custom Event trigger tên chính xác `generate_lead`.
6. Tạo GA4 Event tag với tên sự kiện `generate_lead`, dùng trigger trên. Có thể gửi `form_name`, `page_path`, `lead_id` từ dataLayer. Không gửi họ tên, số điện thoại hoặc nội dung form vào GA4.
7. Tương tự, tạo sự kiện `click_phone` và `click_zalo` nếu cần báo cáo hành vi bấm nút.
8. Dùng GTM Preview và GA4 DebugView/Realtime để gửi một form thử và kiểm tra một đăng ký được ghi đúng một lần.
9. Trong GA4 đánh dấu `generate_lead` là key event; liên kết Google Ads và tạo/import conversion từ sự kiện phù hợp. Nếu đã có Google Ads conversion tag trực tiếp cho cùng hành động, chọn một cách làm nguồn chuyển đổi chính để tránh đếm trùng.
10. Cấu hình consent/tracking phù hợp với hoạt động thực tế trong GTM và chính sách doanh nghiệp.

Frontend chỉ đẩy `generate_lead` sau khi API báo đã lưu lead mới. Bấm gọi/Zalo là tương tác, chưa xác nhận một cuộc gọi hay cuộc hội thoại đã diễn ra. Bộ mẫu đọc UTM trên URL lúc đăng ký, chưa lưu attribution xuyên phiên. Với landing page một trang, gửi quảng cáo trực tiếp tới URL có UTM.

Ví dụ link để kiểm tra nguồn:

```text
https://lp.diennangluongmattroisolar.com/?utm_source=google&utm_medium=cpc&utm_campaign=solar_family
```

## 14. Xem và xử lý khách hàng

Liệt kê lead thật (chỉ chạy trên máy có quyền Cloudflare):

```bash
npx wrangler d1 execute solar-leads --remote --command "SELECT id, created_at, name, phone, area, utm_source, utm_campaign, status, notification_status FROM leads ORDER BY created_at DESC LIMIT 50;"
```

`created_at` lưu theo UTC. Việt Nam là UTC+7; khi đọc bằng công cụ riêng cần đổi múi giờ hiển thị. Dữ liệu đầu ra có thông tin khách nên chỉ chia sẻ với người phụ trách.

Cập nhật trạng thái một lead cụ thể sau khi thay ID thật:

```bash
npx wrangler d1 execute solar-leads --remote --command "UPDATE leads SET status='contacted' WHERE id='THAY_BANG_ID_LEAD';"
```

Các trạng thái bạn có thể thống nhất: new, contacted, surveyed, quoted, won, lost. Giai đoạn đầu sales dùng email và bảng theo dõi nội bộ; bộ mẫu chưa có giao diện CRM. D1 là nơi giữ bản gốc. Sao lưu/xuất dữ liệu định kỳ theo quy trình của bạn.

## 15. Điều kiện trước khi chạy quảng cáo

- Nội dung và thông tin doanh nghiệp đã thay bằng dữ liệu thật; hotline/Zalo hoạt động.
- Chính sách bảo mật phản ánh đúng cách bạn xử lý thông tin.
- Khóa Turnstile thật, domain HTTPS đúng, binding D1 đúng.
- Gửi một form thật lưu được vào database remote; email thông báo hoạt động nếu sử dụng.
- Form sai dữ liệu hoặc API lỗi không hiển thị thành công.
- GA4/Ads ghi nhận đúng sự kiện; không tính nhiều lần cùng một đăng ký.
- Kiểm tra giao diện trên điện thoại, PageSpeed Insights và lỗi console.
- Nếu muốn SEO: đổi `readyToIndex=true`, build lại, kiểm tra robots/meta robots và gửi sitemap trong Search Console. Với trang chỉ chạy quảng cáo có thể giữ noindex nếu đó là chủ ý.
- Thử một nhóm khách, một khu vực, một thông điệp trước; theo dõi cả chất lượng lead và tiến độ chốt hợp đồng.

## 16. Lỗi thường gặp

| Hiện tượng | Cách kiểm tra |
|---|---|
| Form không có token | Kiểm tra site key, widget đã tải, hostname được phép và trình chặn script |
| Form trả 503 ngay trên public domain | Kiểm tra secret thật, binding DB; khóa Turnstile mẫu bị chặn ngoài localhost |
| Form ở `astro dev` không gọi được API | Dùng `npm run build` rồi `npm run preview` qua Wrangler |
| API báo chưa lưu được | Kiểm tra schema đã chạy với `--remote`, database ID và binding DB |
| API trả 403 | Frontend phải gửi `/api/lead` trên cùng origin, không trỏ sang domain WordPress |
| Có lead nhưng không có email | Xem notification_status, ba biến email, domain Verified, dashboard Resend |
| Đã sửa PUBLIC_ nhưng giao diện chưa đổi | Các biến PUBLIC_ được đưa vào lúc build; phải redeploy |
| Subdomain lỗi 522/không active | Khai báo Custom domain trong Pages trước, kiểm tra CNAME và HTTPS |
| Chưa xuất hiện trên Google | Kiểm tra readyToIndex, robots, noindex, sitemap; trang mới cần thời gian thu thập dữ liệu |

## 17. Nguồn chính thức để tham khảo

- Astro: https://docs.astro.build/en/install-and-setup/
- Tailwind trong Astro: https://docs.astro.build/en/guides/styling/
- Pages Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Wrangler configuration: https://developers.cloudflare.com/pages/functions/wrangler-configuration/
- Pages local development: https://developers.cloudflare.com/pages/functions/local-development/
- Pages Functions routing: https://developers.cloudflare.com/pages/functions/routing/
- D1: https://developers.cloudflare.com/d1/get-started/
- Turnstile server validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Turnstile test keys: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Resend domain verification: https://resend.com/docs/dashboard/domains/introduction
- GA4 recommended events: https://support.google.com/analytics/answer/9267735?hl=vi
- Core Web Vitals: https://web.dev/articles/vitals

## 18. Phạm vi kiểm tra của bộ mã

Các kiểm tra tự động bao phủ đầu vào không hợp lệ, xác minh bot thất bại, lỗi lưu database, lỗi email sau khi lưu, chống lặp submission ID, cross-origin và chặn khóa mẫu trên public domain. Cần cấu hình tài khoản và thực hiện kiểm thử thủ công trên domain thật trước khi nhận khách. Những kiểm tra tự động này không thay thế việc kiểm tra inbox, GA4, Google Ads hoặc hiệu năng người dùng thực tế.
