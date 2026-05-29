# Lab 2 - Appserver and Database (Photo Sharing App)

## Cấu trúc dự án

```
WebThucHanh2/
├── index.js              ← Entry point backend (Express server, port 8081)
├── package.json          ← Dependencies backend
├── .env                  ← Biến môi trường (DB_URL - MongoDB Atlas)
├── .env.example          ← Template .env
├── db/
│   ├── dbConnect.js      ← Kết nối MongoDB
│   ├── dbLoad.js         ← Script nạp dữ liệu mẫu (chạy 1 lần)
│   ├── userModel.js      ← Mongoose schema User
│   ├── photoModel.js     ← Mongoose schema Photo + Comment
│   └── schemaInfo.js     ← Mongoose schema SchemaInfo
├── routes/
│   ├── UserRouter.js     ← GET /user/list, GET /user/:id
│   └── PhotoRouter.js    ← GET /photosOfUser/:id
├── modelData/
│   └── models.js         ← Fake data (dùng để seed DB)
└── client/               ← Frontend React app (Lab 1 đã sửa cho Lab 2)
    ├── package.json
    ├── public/
    └── src/
        ├── App.js
        ├── lib/
        │   └── fetchModelData.js   ← Hàm fetchModel gọi backend API
        └── components/
            ├── TopBar/             ← Thanh tiêu đề
            ├── UserList/           ← Danh sách users - fetch từ /user/list
            ├── UserDetail/         ← Chi tiết user - fetch từ /user/:id
            └── UserPhotos/         ← Ảnh user - fetch từ /photosOfUser/:id
```

---

## API Endpoints (Backend)

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/user/list` | Danh sách users (`_id`, `first_name`, `last_name`) |
| GET | `/user/:id` | Chi tiết user (thêm `location`, `description`, `occupation`) |
| GET | `/photosOfUser/:id` | Ảnh + comments của user |

---

## Chạy trên máy LOCAL

### Bước 1: Cài dependencies

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Bước 2: Cấu hình MongoDB

Tạo file `.env` (copy từ `.env.example`):

```bash
cp .env.example .env
```

Điền connection string MongoDB Atlas vào `.env`:
```
DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/photo_sharing?retryWrites=true&w=majority&appName=Cluster0
```

### Bước 3: Nạp dữ liệu mẫu (chỉ cần chạy 1 lần)

```bash
npm run load-db
```

Kết quả thành công:
```
Successfully connected to MongoDB Atlas!
Adding user: Ian Malcolm ...
Adding user: Ellen Ripley ...
SchemaInfo object created with version  1.0
```

### Bước 4: Chạy backend

```bash
npm start
# Server chạy tại http://localhost:8081
```

### Bước 5: Chạy frontend (terminal mới)

```bash
cd client
npm start
# Frontend tại http://localhost:3000
```

---

## Chạy trên CODESANDBOX

> ⚠️ CodeSandbox chỉ chạy được **backend** (Node.js). Frontend cần chạy riêng hoặc deploy lên Vercel/Netlify.

### Bước 1: Import repo vào CodeSandbox

1. Vào [codesandbox.io](https://codesandbox.io)
2. Nhấn **"Import from GitHub"**
3. Dán URL repo GitHub của bạn
4. Chọn **Node.js** template

### Bước 2: Cài đặt biến môi trường DB_URL

⚠️ **QUAN TRỌNG** — KHÔNG commit file `.env` lên GitHub vì chứa mật khẩu!

Trong CodeSandbox:
1. Nhấn vào icon **"🔒 Env Variables"** ở sidebar trái (hoặc vào **Server Control Panel → Env Variables**)
2. Thêm biến:
   - **Key:** `DB_URL`
   - **Value:** `mongodb+srv://tincanhcamxx_db_user:Nono%40123@ac-dcv4fv5-shard-00-00.c19zwms.mongodb.net:27017,ac-dcv4fv5-shard-00-01.c19zwms.mongodb.net:27017,ac-dcv4fv5-shard-00-02.c19zwms.mongodb.net:27017/photo_sharing?ssl=true&replicaSet=atlas-x7361e-shard-0&authSource=admin&appName=Cluster0`
3. Nhấn **Save**

### Bước 3: Nạp dữ liệu (Terminal trong CodeSandbox)

Mở terminal trong CodeSandbox và chạy:
```bash
npm run load-db
```

### Bước 4: Chạy server

```bash
npm start
```

Server sẽ chạy và CodeSandbox sẽ hiện URL preview (dạng `https://xxxx.sse.codesandbox.io`).

### Bước 5: Test API

Thay `YOUR_SANDBOX_URL` bằng URL preview của CodeSandbox:

```
YOUR_SANDBOX_URL/user/list
YOUR_SANDBOX_URL/user/{id}
YOUR_SANDBOX_URL/photosOfUser/{id}
```

---

## Lưu ý khi push lên GitHub

File `.env` chứa thông tin kết nối **đã được thêm vào `.gitignore`** — tuy nhiên nếu bạn cần nộp bài kèm `.env`:

1. Tạm thời xóa `.env` khỏi `.gitignore`
2. Push lên GitHub
3. Sau đó thêm lại `.env` vào `.gitignore`

Hoặc cách an toàn hơn: đặt `DB_URL` làm **Secret** trong CodeSandbox (xem Bước 2 ở trên).
