# FamilySite - MERN Stack Web Application

`FamilySite` là một ứng dụng web full-stack được xây dựng bằng MERN Stack (MongoDB, Express, React, Node.js) với mục tiêu tạo ra một không gian riêng tư và an toàn cho các thành viên trong gia đình để kết nối, chia sẻ kỷ niệm và quản lý các sự kiện chung.

Dự án được xây dựng với kiến trúc hiện đại, tập trung vào khả năng mở rộng, bảo mật và trải nghiệm người dùng chuyên nghiệp thông qua việc tích hợp sâu với Ant Design.

## Mục lục

- [Tổng quan Kiến trúc & Công nghệ](#tổng-quan-kiến-trúc--công-nghệ)
- [Các chức năng đã hoàn thành (v1.0)](#các-chức-năng-đã-hoàn-thành-v10)
- [Hướng dẫn Cài đặt và Chạy dự án](#hướng-dẫn-cài-đặt-và-chạy-dự-án)
- [Cấu trúc Thư mục](#cấu-trúc-thư-mục)
- [Các API Endpoint chính](#các-api-endpoint-chính)
- [Hướng đi và Mục tiêu tiếp theo](#hướng-đi-và-mục-tiêu-tiếp-theo)

## Tổng quan Kiến trúc & Công nghệ

Dự án được chia thành hai phần riêng biệt: `frontend` và `backend`, có thể được phát triển và triển khai độc lập.

**Backend:**
- **Nền tảng:** Node.js, Express.js (sử dụng TypeScript)
- **Cơ sở dữ liệu:** MongoDB (kết nối qua MongoDB Atlas)
- **Tương tác DB:** Mongoose ODM
- **Xác thực:** JSON Web Tokens (JWT) với thời gian hết hạn.
- **Bảo mật:** Hashing mật khẩu với `bcryptjs`, middleware bảo vệ và phân quyền route.

**Frontend:**
- **Thư viện:** React (sử dụng TypeScript, Vite làm công cụ build)
- **UI Framework:** Ant Design (AntD) - được tích hợp sâu cho toàn bộ giao diện.
- **Quản lý State & API:** React Hooks, Axios (với interceptor để tự động quản lý token).
- **Routing:** React Router DOM
- **Styling:** SCSS (SASS) cho styling có cấu trúc và dễ bảo trì.

## Các chức năng đã hoàn thành (v1.0)

Tính đến thời điểm hiện tại, dự án đã hoàn thành các chức năng cốt lõi sau:

### 1. Hệ thống Xác thực & Phân quyền (Authentication & Authorization)
- **Đăng ký:** Người dùng có thể tạo tài khoản mới với `username`, `email` (đảm bảo duy nhất) và `password`.
- **Đăng nhập linh hoạt:** Người dùng có thể đăng nhập bằng `username` HOẶC `email`.
- **Phân quyền 3 cấp độ:**
    - `user`: Vai trò mặc định, có quyền xem các trang công khai và các tính năng cơ bản.
    - `moderator`: Có quyền truy cập trang quản trị (`/dashboard`).
    - `admin`: Có toàn quyền truy cập hệ thống, bao gồm cả các trang cài đặt nâng cao.
- **Bảo mật Token:** Sử dụng JWT với thời gian hết hạn (`expiresIn`) được cấu hình ở backend, tự động đăng xuất người dùng khi token hết hạn.
- **Phân luồng sau đăng nhập:** `admin`/`moderator` được chuyển hướng đến `/dashboard`, trong khi `user` được chuyển hướng về trang chủ (`/`).

### 2. Giao diện Người dùng (UI)
- **Trang chủ (Public):** Một trang landing page giới thiệu về ứng dụng, sử dụng layout riêng (`MainLayout`) với Navbar và Footer.
- **Trang Quản trị (Admin):** Một layout riêng (`AdminLayout`) với Sidebar có thể thu gọn.
- **Giao diện responsive:** Các layout và component được xây dựng với AntD để tương thích tốt trên các thiết bị khác nhau.

### 3. Hệ thống Menu Động (Dynamic Navigation)
- **Nguồn dữ liệu từ Database:** Các mục menu (cả Navbar và Sidebar) không được viết cứng trong code mà được lấy động từ cơ sở dữ liệu MongoDB.
- **Quản lý Menu qua Giao diện:** Trang `/dashboard/settings/navigation` cho phép `admin` thực hiện đầy đủ các thao tác **CRUD (Tạo, Xem, Sửa, Xóa)** đối với các mục menu.
- **Phân quyền Menu:**
    - API tự động lọc và chỉ trả về các mục menu mà vai trò của người dùng được phép xem.
    - Giao diện (ví dụ: dropdown avatar) cũng ẩn/hiện các liên kết (như "Go to Dashboard") dựa trên vai trò người dùng.

## Hướng dẫn Cài đặt và Chạy dự án

### Yêu cầu
- Node.js (v16 trở lên)
- npm hoặc yarn
- Một tài khoản MongoDB Atlas (có thể dùng gói miễn phí)

### Các bước thiết lập
1.  **Clone dự án:**
    ```bash
    git clone https://github.com/LongHoang77/FamilySite.git
    cd FamilySite
    ```

2.  **Thiết lập Backend:**
    - Tạo một file tên là `.env` trong thư mục gốc `FamilySite`.
    - Sao chép nội dung từ file `.env.example` (nếu có) và điền các giá trị của bạn:
      ```env
      MONGO_URI=<Your_MongoDB_Atlas_Connection_String>
      PORT=5001
      JWT_SECRET=<Your_Strong_JWT_Secret>
      
      # Dùng để tạo tài khoản admin đầu tiên
      ADMIN_USERNAME=admin
      ADMIN_EMAIL=admin@familysite.com
      ADMIN_PASSWORD=<Your_Strong_Admin_Password>
      ```

3.  **Cài đặt & Khởi tạo (Lần đầu tiên):**
    Từ thư mục gốc `FamilySite`, chạy lệnh `setup` đặc biệt. Lệnh này sẽ cài đặt tất cả dependencies và tạo tài khoản admin đầu tiên.
    ```bash
    npm run setup
    ```

4.  **Chạy dự án (Hàng ngày):**
    Để khởi động cả server backend và frontend cùng lúc, chạy lệnh sau từ thư mục gốc `FamilySite`:
    ```bash
    npm start
    ```
    - Frontend sẽ chạy tại `http://localhost:5173`.
    - Backend sẽ chạy tại `http://localhost:5001`.



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