# TEST PLAN — Football Predictor (FIFA World Cup 2026)

> Ngày: 2026-02-23
> Sản phẩm: Football Predictor SPA
> Stack: Vanilla JS + Supabase (PostgreSQL) + Vercel

---

## 1. Mục tiêu kiểm thử

| Mục tiêu | Mô tả |
|---|---|
| Chức năng | Mọi tính năng hoạt động đúng theo yêu cầu |
| Tính toán điểm | Công thức điểm chính xác, không sai lệch |
| UI/UX | Giao diện đáp ứng, hiển thị đúng trên mobile/desktop |
| Dữ liệu | Integrity giữa match, prediction, player, leaderboard |
| Bảo mật | Không cho phép dự đoán sau giờ trận, không bypass deadline |

---

## 2. Phạm vi kiểm thử

### In scope
- Authentication flow (login / logout)
- Prediction CRUD (tạo, sửa, khóa sau khi trận bắt đầu)
- Scoring engine (exact score, rank, minute)
- Leaderboard aggregation
- Favorite team flow (chọn, deadline, điểm thưởng)
- Admin: quản lý trận, kết quả, status lifecycle
- Bracket rendering (Group Stage + Knockout)
- Realtime subscription (matches, predictions)
- Timezone display (GMT+7)
- Responsive UI (mobile 375px, tablet 768px, desktop 1280px)

### Out of scope
- Server-side security (không có server, app dùng client-side auth)
- Load testing / stress testing (demo app, không cần)
- Cross-browser automation (manual check trên Chrome/Safari)

---

## 3. Phân loại test

```
TEST TYPES
├── Unit Tests          → Các hàm logic thuần túy (validation, calculation)
├── Integration Tests   → Supabase queries qua test.html
├── End-to-End (E2E)    → User flow hoàn chỉnh (thủ công hoặc Playwright)
└── Regression Tests    → Chạy lại sau mỗi thay đổi lớn
```

---

## 4. Môi trường kiểm thử

| Môi trường | Mô tả | Dữ liệu |
|---|---|---|
| **Local** | `npx serve .` hoặc `python3 -m http.server 8080` | Supabase staging DB |
| **Staging (Vercel Preview)** | Deploy từ feature branch | Supabase staging DB |
| **Production** | `main` branch trên Vercel | Supabase production DB |

**Luôn test trên staging trước, không bao giờ chạy test phá dữ liệu trên production.**

---

## 5. Chiến lược tự động hoá vs thủ công

### Khi nào Claude Code có thể tự làm (Autonomous)

Claude Code **không cần human-in-the-loop** trong các trường hợp:

| Loại task | Ví dụ | Lý do |
|---|---|---|
| **Logic thuần JS** | Validate điểm 0-0 → minute=0, kiểm tra score range | Không cần DB, không có side effect |
| **SQL correctness** | Xác minh seed match đúng 72 trận, knockout M73–M104 | Đọc file, đếm, so sánh — deterministic |
| **Static structure** | Bracket có đúng 104 match, cấu trúc rounds đúng | Đọc bracket-render.js, verify |
| **CSS/UI consistency** | Biến CSS được dùng đúng, không hardcode màu | Grep pattern trong file |
| **Code review** | Phát hiện `console.log` còn sót, hàm trùng tên | Phân tích tĩnh |
| **Regression check** | Sau refactor: các hàm window.* vẫn export đủ | Grep + verify |
| **Viết test case mới** | Từ spec → sinh test case dạng markdown/JSON | Không cần chạy thật |
| **Đọc log lỗi** | Supabase error message → gợi ý fix | Phân tích text |

### Khi nào cần Human-in-the-Loop (HITL)

Human **bắt buộc xem xét** trong các trường hợp:

| Loại task | Lý do cần người | Rủi ro nếu bỏ qua |
|---|---|---|
| **Chạy SQL trên production** | Xóa/reset dữ liệu thật của người chơi | Mất dữ liệu không khôi phục được |
| **Thay đổi công thức điểm** | Ảnh hưởng toàn bộ leaderboard của mọi group | Bất công cho người chơi đang dẫn |
| **Lock/Unlock favorite team deadline** | Quyết định gameplay, không chỉ là bug | Thay đổi luật chơi giữa giải |
| **Merge vào `main`** | Deploy thẳng lên production | Người dùng thật bị ảnh hưởng |
| **Kiểm tra UI visual** | Responsive, animation, màu sắc, font | Claude không "nhìn" được browser |
| **Realtime subscription** | Kiểm tra Supabase channel hoạt động live | Cần WebSocket thật |
| **Test với nhiều user đồng thời** | Race condition trên prediction upsert | Cần nhiều browser tab/session |
| **Verify điểm sau khi enter result** | Trigger DB tính điểm → kết quả phải đúng | Cần xác nhận từ người biết luật |
| **Quyết định UX thay đổi** | Button text, flow modal, thứ tự bước | Liên quan đến product judgment |
| **Security review** | Bypass đặt cược sau giờ trận, token abuse | Cần con mắt security chuyên sâu |

---

## 6. Quy trình kiểm thử đề xuất

```
┌─────────────────────────────────────────────────────────┐
│ 1. CLAUDE CODE (Autonomous)                             │
│    - Đọc code, viết test case                           │
│    - Verify static structure (SQL seeds, bracket data)  │
│    - Phân tích logic validation                         │
│    - Tạo test data SQL                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. HUMAN (Review test plan + Run manual tests)          │
│    - Chạy test.html trên staging                        │
│    - Kiểm tra UI visually                               │
│    - Test multi-user scenarios                          │
│    - Verify scoring sau khi enter result                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. CLAUDE CODE (Analyze results + Fix)                  │
│    - Đọc lỗi từ log/console                             │
│    - Đề xuất fix                                        │
│    - Viết code fix                                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 4. HUMAN (Approve + Merge)                              │
│    - Review PR                                          │
│    - Approve merge vào main                             │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Test Coverage Matrix

| Module | Unit | Integration | E2E | Priority |
|---|---|---|---|---|
| loginUser | ✓ | ✓ | ✓ | P0 |
| savePrediction | ✓ | ✓ | ✓ | P0 |
| getLeaderboard | ✓ | ✓ | ✓ | P0 |
| enterMatchResult | - | ✓ | ✓ | P0 |
| Scoring trigger | - | ✓ | ✓ | P0 |
| selectFavoriteTeam | ✓ | ✓ | ✓ | P1 |
| Match status lifecycle | ✓ | ✓ | ✓ | P1 |
| Bracket rendering | - | - | ✓ (manual) | P1 |
| Prediction lock (time) | ✓ | - | ✓ | P0 |
| 0-0 validation | ✓ | - | ✓ | P1 |
| Realtime subscription | - | - | ✓ (manual) | P2 |
| Admin CRUD | - | ✓ | ✓ (manual) | P1 |
| Mobile responsive | - | - | ✓ (manual) | P1 |

**Priority:** P0 = Blocker, P1 = High, P2 = Medium

---

## 8. Exit Criteria

Điều kiện để kết thúc kiểm thử và cho phép deploy:

- [ ] Tất cả P0 test cases: PASS
- [ ] Tất cả P1 test cases: PASS hoặc có plan fix
- [ ] Không có lỗi tính điểm sai
- [ ] Không thể dự đoán sau giờ trận bắt đầu
- [ ] Leaderboard hiển thị đúng sau khi enter result
- [ ] Favorite team deadline hoạt động đúng
- [ ] Không có JavaScript error trong console (production build)
- [ ] UI không bị vỡ trên mobile 375px
