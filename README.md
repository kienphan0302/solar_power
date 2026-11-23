# Bản thử bình nóng lạnh đã ngừng hoạt động

Nhánh này chỉ phục vụ chuyển tiếp từ bản thử cũ sang website độc lập.

- Website hiện tại: https://water-heater-e3j.pages.dev/
- Mã nguồn cần cập nhật: https://github.com/kienphan0302/water_heater
- Không merge nhánh này vào `main` của `solar_power`.

Mọi trang GET/HEAD chuyển hướng tạm thời 302, giữ đường dẫn và query. Mọi `/api/*` trả HTTP 410; không chuyển tiếp hoặc lưu lại form từ trang cũ. Cấu hình production và preview không còn D1 binding. Dữ liệu cũ trong database vẫn được giữ nguyên.

Source danh mục còn trong lịch sử để đối chiếu. Không dùng các hướng dẫn triển khai cũ trong nhánh này để tạo thêm website hoặc gắn lại `solar-leads`. Quản lý domain, form, email và GA4/GTM ở repo mới.

Kiểm tra hành vi ngừng hoạt động: `node --import tsx --test tests/retirement.test.ts`.
