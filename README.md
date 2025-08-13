
## Các API Endpoint chính

- `POST /api/auth/register`: Đăng ký người dùng mới.
- `POST /api/auth/login`: Đăng nhập, trả về user info và JWT.
- `GET /api/navigation`: Lấy danh sách menu (nội dung thay đổi theo vai trò).
- `GET /api/navigation/all`: (Admin) Lấy toàn bộ menu để quản lý.
- `POST /api/navigation`: (Admin) Tạo mục menu mới.
- `PUT /api/navigation/:id`: (Admin) Cập nhật mục menu.
- `DELETE /api/navigation/:id`: (Admin) Xóa mục menu.

## Hướng đi và Mục tiêu tiếp theo

Dự án đã có nền tảng vững chắc. Các bước phát triển tiếp theo sẽ tập trung vào việc xây dựng các tính năng cốt lõi cho người dùng cuối.

### Ưu tiên cao
1.  **Module Cây Gia Phả (Family Tree):**
    - Thiết kế schema cho `Member` (thông tin thành viên: tên, ngày sinh, quan hệ cha/mẹ/vợ/chồng).
    - Xây dựng API CRUD cho các thành viên.
    - Frontend: Sử dụng một thư viện visualization (như D3.js, GoJS, hoặc các thư viện React chuyên dụng) để vẽ cây gia phả tương tác.

2.  **Module Album Ảnh (Shared Albums):**
    - Thiết kế schema cho `Album` và `Photo`.
    - Tích hợp dịch vụ lưu trữ file đám mây (như Cloudinary, AWS S3) để upload ảnh.
    - Xây dựng API cho phép tạo album, upload ảnh, bình luận.
    - Frontend: Tạo giao diện gallery ảnh, cho phép xem, tải lên và quản lý ảnh.

### Ưu tiên trung bình
3.  **Module Sự kiện (Events Calendar):**
    - Schema cho `Event` (tên, ngày, mô tả, loại sự kiện: sinh nhật, kỷ niệm...).
    - API CRUD cho sự kiện.
    - Frontend: Tích hợp component Lịch của AntD (`<Calendar>`) để hiển thị các sự kiện. Tự động hiển thị sinh nhật/kỷ niệm từ dữ liệu cây gia phả.

4.  **Trang hồ sơ cá nhân (User Profile):**
    - Cho phép người dùng cập nhật thông tin cá nhân, đổi mật khẩu, thay đổi ảnh đại diện.

### Cải tiến Kỹ thuật
- **Refresh Token:** Triển khai cơ chế Refresh Token để cải thiện trải nghiệm đăng nhập, giúp người dùng không bị đăng xuất đột ngột.
- **Real-time Notifications:** Sử dụng WebSockets (ví dụ: `Socket.IO`) để gửi thông báo real-time (ví dụ: "A đã thêm một ảnh mới vào album X").
- **Testing:** Viết unit test (dùng Jest, Vitest) và integration test cho cả backend và frontend.
- **CI/CD:** Thiết lập quy trình tích hợp và triển khai liên tục (CI/CD) với GitHub Actions để tự động build và deploy dự án.