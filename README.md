# Web Cuối Kì - Backend

Đây là phần Backend (máy chủ & cơ sở dữ liệu) của ứng dụng chia sẻ ảnh, được xây dựng bằng Node.js, Express và MongoDB.

## Yêu cầu
- Node.js cài đặt sẵn trên máy.
- Một database MongoDB (có thể dùng MongoDB Atlas hoặc cài MongoDB local).

## Hướng dẫn chạy dự án

**Bước 1:** Clone dự án về máy
```bash
git clone https://github.com/RubyScarIet/web-cuoi-kia-back.git
cd web-cuoi-kia-back
```

**Bước 2:** Cài đặt các thư viện phụ thuộc
```bash
npm install
```

**Bước 3:** Cấu hình Cơ sở dữ liệu (Database)
- Đổi tên file `.env.example` thành `.env`
- Mở file `.env` và điền đường dẫn kết nối MongoDB của bạn vào biến `DB_URL`.
Ví dụ: `DB_URL=mongodb+srv://nguyentrungtinb23dcvt416_db_user:000569@cuoiki.ofendqh.mongodb.net/photo_sharing?appName=CuoiKi`

**Bước 4:** Nạp dữ liệu mẫu vào DB (Chỉ cần chạy 1 lần duy nhất)
```bash
npm run load-db
```

**Bước 5:** Khởi động máy chủ
```bash
npm start
```
*(Hoặc dùng lệnh `npm run dev` để tự động khởi động lại server khi sửa code).*

## Lưu ý khi chạy trên CodeSandbox
- Khi import vào CodeSandbox, bạn cần cung cấp thông tin biến môi trường.
- Đi tới mục **Server Control Panel** -> **Secret** và thêm 1 secret item với Name là `DB_URL` và Value là URL MongoDB của bạn.
- Sau đó, CodeSandbox sẽ tự động cài gói và chạy `node index.js`.
