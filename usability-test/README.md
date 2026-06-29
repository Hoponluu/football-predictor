# Usability Test — FIFA World Cup 2026 Prediction App

## Mục đích

Mô phỏng toàn bộ giải đấu World Cup trong ~60-90 phút để:
- Test user journey từ đầu đến cuối
- Phát hiện vấn đề UX/hiểu thông tin
- Kiểm tra logic tính điểm ở mọi kịch bản
- Test bracket rendering và favorite team bonus

## Cấu trúc giải đấu rút gọn

| Vòng | Số trận | Edge cases |
|------|---------|------------|
| Group R1 | 6 | 2 trận hòa |
| Group R2 | 6 | 1 trận 0-0 |
| Group R3 | 6 | Bàn phút 90+2 |
| R32 | 16 | 2x penalty, 2x extra time, 2x 0-0 |
| R16 | 8 | 2x penalty, 1x extra time |
| QF | 4 | 1x penalty (0-0), 1x penalty |
| SF | 2 | 1x extra time |
| 3rd + Final | 2 | Final penalty 1-1 |

**Tổng: 49 trận**

## Đội tham gia

### Vòng bảng (12 đội, 3 bảng)
- **Group A**: Brasil, Germany, Japan, Morocco
- **Group B**: Argentina, England, USA, Australia
- **Group C**: France, Spain, Netherlands, South Korea

### Vòng knockout (32 đội)
Top 32 theo FIFA ranking: Argentina, France, Brasil, England, Belgium, Netherlands, Portugal, Spain, Germany, Colombia, Uruguay, Japan, USA, Mexico, Morocco, Croatia, South Korea, Serbia, Denmark, Australia, Turkey, Switzerland, Ecuador, Saudi Arabia, Nigeria, Cameroon, Canada, Senegal, Poland, Egypt, Chile, Ivory Coast

## Kết quả chung cuộc

- 🥇 **Argentina** (Champion)
- 🥈 USA
- 🥉 Spain
- 4th: Japan

## Hướng dẫn chạy test (Admin)

### Chuẩn bị (1 lần)
1. Mở **Supabase SQL Editor**
2. Chạy `00-setup.sql` — Reset data, tạo 49 trận
3. Gửi link app cho users, yêu cầu đăng nhập và **chọn favorite team**

### Vòng bảng (3 rounds × ~15 phút)

Mỗi round:
1. **Chạy** `0X-group-rX-open.sql` → Mở dự đoán (tự đóng sau 10')
2. **Thông báo** users: "Dự đoán 6 trận trong 10 phút!"
3. **Đợi** 10 phút
4. **Chạy** `0X-group-rX-results.sql` → Fill kết quả
5. **Vào Admin** → Chọn từng trận → Bấm **"Tính điểm dự đoán"**
6. **Quan sát** users xem leaderboard, hỏi feedback

### Vòng 32 đội

1. **Chạy** `04-r32-open.sql` → Mở 16 trận + **lock favorite team**
2. **Thông báo** users: "Dự đoán 16 trận vòng 32!"
3. **Đợi** users hoàn thành (không giới hạn thời gian)
4. **Chạy** `04-r32-results.sql`
5. **Vào Admin** → Tính điểm + **Tính favorite team**

### Vòng 16, QF, SF, Final (tương tự)

Lặp lại pattern:
1. **Chạy** `0X-...-open.sql` → Mở + cập nhật teams
2. **Đợi** users dự đoán
3. **Chạy** `0X-...-results.sql`
4. **Vào Admin** → Tính điểm + Tính favorite team

### Sau khi xong
- Chạy `09-cleanup.sql` nếu muốn reset toàn bộ

## Checklist quan sát UX

### Vòng bảng
- [ ] User hiểu cách nhập dự đoán?
- [ ] Countdown 10 phút hiển thị rõ?
- [ ] Sau khi kết quả, user hiểu cách tính điểm?
- [ ] Leaderboard cập nhật realtime?
- [ ] Trận hòa hiển thị đúng?

### Vòng knockout
- [ ] Bracket hiển thị đúng teams sau mỗi vòng?
- [ ] Penalty hiển thị rõ ràng (score + PEN)?
- [ ] Extra time hiển thị đúng?
- [ ] User hiểu 0-0 + penalty là hòa hay thắng?

### Favorite Team
- [ ] User chọn được favorite team trước R32?
- [ ] Sau khi lock, không chọn lại được?
- [ ] Bonus points hiển thị đúng trên leaderboard?
- [ ] User hiểu favorite team tích lũy điểm qua từng vòng?

### Tổng quan
- [ ] Flow từ dự đoán → kết quả → điểm mượt mà?
- [ ] Thông tin trên mobile đọc được rõ?
- [ ] Có confusion nào về cách tính điểm?
- [ ] Có bug/crash nào?

## Lưu ý kỹ thuật

- **match_date** ở open SQL được set = NOW() + 10' cho vòng bảng (frontend hiện countdown)
- **Knockout** không có deadline — admin control bằng tay
- **Favorite team** lock khi chạy `04-r32-open.sql`
- **Bracket render** sử dụng match_number M73-M104 theo `FIFA_BRACKET` object
- **Tính điểm** phải bấm thủ công trong Admin panel sau mỗi batch kết quả
