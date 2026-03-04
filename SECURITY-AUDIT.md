# Security Audit - Football Predictor App

## Tổng quan lỗ hổng

### 1. RLS (Row Level Security) chưa bật - NGHIÊM TRỌNG
- **Vấn đề**: Tất cả bảng đều có thể đọc/ghi/xóa tự do qua anon key
- **Hậu quả**: Bất kỳ ai mở DevTools đều có thể sửa kết quả trận đấu, dự đoán, điểm số
- **Fix**: Chạy file `security-rls-policies.sql` trên Supabase SQL Editor

### 2. Password lưu plaintext - NGHIÊM TRỌNG
- **File**: `supabase-db.js:25`, `supabase-db.js:427`
- **Vấn đề**: Password lưu và so sánh trực tiếp trong bảng `players`
- **Hậu quả**: Ai đọc được database sẽ thấy tất cả mật khẩu
- **Fix ngắn hạn**: Hash password bằng pgcrypto extension
- **Fix dài hạn**: Chuyển sang Supabase Auth

### 3. Không có Supabase Auth - QUAN TRỌNG
- **File**: `supabase-db.js:18-38`
- **Vấn đề**: Auth tự xây dựng, dựa vào localStorage ID
- **Hậu quả**: User có thể giả mạo bất kỳ ai bằng cách sửa localStorage
- **Fix**: Migrate sang Supabase Auth (`supabase.auth.signUp/signIn`)

### 4. Supabase client exposed trên window - TRUNG BÌNH
- **File**: `supabase-db.js:501`
- **Vấn đề**: `window.supabaseClient = supabase` cho phép truy cập trực tiếp
- **Fix**: Không export supabase client ra window object

### 5. Admin hardcoded credentials - NGHIÊM TRỌNG
- **File**: `admin.html:1559`
- **Vấn đề**: `admin@wc2026.com` / `admin123` hardcode trong source code
- **Fix**: Dùng Supabase Auth + kiểm tra role trong database

### 6. Anon key trong source code - THẤP (by design)
- **File**: `config.js:7`
- **Vấn đề**: Anon key công khai, nhưng đây là thiết kế của Supabase
- **Lưu ý**: Anon key an toàn NẾU có RLS policies đúng

---

## Đã khắc phục (trong `security-rls-policies.sql`)

| Fix | Mô tả |
|-----|--------|
| RLS Enable | Bật RLS trên 5 bảng: matches, predictions, players, groups, scoring_rules |
| matches: Read-only | Anon chỉ đọc, không sửa/xóa được từ frontend |
| predictions: Open-only | Chỉ tạo/sửa dự đoán khi trận đang "open" |
| predictions: No delete | Không ai xóa được dự đoán |
| scoring_rules: Read-only | Chỉ đọc, không sửa được quy tắc tính điểm |
| Trigger: check_open | DB-level check: ngăn dự đoán khi trận không open |
| Trigger: protect_points | Không cho client sửa cột điểm (total_points, etc.) |
| Trigger: protect_results | Không cho sửa kết quả trận đã finished |

## Cần làm thêm (Roadmap)

### Phase 1: Chạy ngay (5 phút)
1. Chạy `security-rls-policies.sql` trên Supabase SQL Editor
2. Test lại app xem có hoạt động bình thường không

### Phase 2: Chuyển Admin sang service_role (1-2 giờ)
1. Tạo Supabase Edge Function cho admin operations
2. Admin panel gọi Edge Function thay vì trực tiếp vào DB
3. Edge Function dùng service_role key (không expose ra frontend)

### Phase 3: Migrate sang Supabase Auth (nửa ngày)
1. Tạo Supabase Auth users từ bảng players hiện tại
2. Sửa login/register flow dùng `supabase.auth.signUp/signIn`
3. Update RLS policies dùng `auth.uid()` thay vì trust client
4. Hash hoặc remove password column trong bảng players

### Phase 4: Hoàn thiện (1 ngày)
1. Remove `window.supabaseClient` export
2. Thêm rate limiting
3. Thêm audit log cho admin actions
4. Thêm CAPTCHA cho đăng ký
