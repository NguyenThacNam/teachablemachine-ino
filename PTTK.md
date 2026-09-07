# PHÂN TÍCH THIẾT KẾ — PHÒNG LAB AI

**Sản phẩm:** Web tĩnh cho học sinh trải nghiệm mô hình AI dựng sẵn
**Thiết bị:** Máy tính bảng do INOHUB cấp, xoay vòng giữa các lớp
**Căn cứ nội dung:** [KhungPhanPhoi_THCS_V4.md](KhungPhanPhoi_THCS_V4.md) · QĐ 2422/QĐ-BGDĐT
**Ngày lập:** 04/09/2026 · Phiên bản 1.1 — bổ sung cơ chế hai nguồn mô hình

---

## 1. TÓM TẮT

Phòng Lab AI là **một web tĩnh** gồm các trạm thí nghiệm và trò chơi, chạy trên trình duyệt máy tính bảng, **không cần tài khoản, không cần máy chủ**.

Giáo viên huấn luyện mô hình trước bằng máy tính. Học sinh vào lab để **thử, phá, so sánh và hiểu vì sao** — thay vì mất cả tiết loay hoay huấn luyện.

| | |
|---|---|
| **Thay thế** | Teachable Machine ở 15 bài không cần tự huấn luyện |
| **Không thay thế** | 7 bài mà hành động huấn luyện chính là nội dung bài — vẫn dùng LearningML |
| **Quy mô** | 6 trạm chức năng + 5 trò chơi |
| **Kỹ thuật** | HTML + JavaScript + TensorFlow.js, không backend, không build |

---

## 2. VÌ SAO LÀM

### 2.1. Vấn đề

Teachable Machine **chặn thiết bị di động**. 22 bài thực hành đang phụ thuộc vào nó. Cho học sinh tự huấn luyện trên máy tính bảng thì gặp ba trở ngại:

- Mỗi nhóm ra một mô hình khác nhau — **bài học xảy ra hên xui**, có nhóm không thấy hiện tượng cần thấy
- Một tiết chỉ **22 phút**, huấn luyện xong là hết giờ, không còn thời gian phân tích
- Phụ thuộc dịch vụ ngoài — nhà cung cấp đổi chính sách là hỏng cả chương trình

### 2.2. Căn cứ: Bộ KHÔNG bắt học sinh phải tự huấn luyện

Rà động từ trong yêu cầu cần đạt Khối 6–8:

| Mã | Nguyên văn | Đòi hành động gì |
|---|---|---|
| 6.C1.1 | *"**Giải thích được** hai thành phần chính để huấn luyện AI"* | Giải thích |
| 6.C3.1 | *"**Kể được tên** một số công nghệ AI quen thuộc"* | Kể tên |
| 6.A3.2 | *"**Sử dụng được** một công cụ AI phù hợp lứa tuổi"* | Dùng |
| 7.C5.1 | *"**Mô tả được** các bước huấn luyện AI **qua một ví dụ cụ thể**"* | Mô tả qua ví dụ |
| 8.C1.1 | *"**Mô tả được** cách AI thực hiện chức năng đọc, nghe, nhìn"* | Mô tả |
| 8.C5.1 | *"**Nêu được** cách AI nhận diện cảm xúc"* | Nêu |

**Không yêu cầu cốt lõi nào ở Khối 6–8 bắt học sinh tự huấn luyện mô hình.** Việc đó là lựa chọn thiết kế của INOHUB, không phải quy định.

Ngược lại, QĐ mục VI.1 còn ghi: *"việc đánh giá **không tập trung vào mức độ thành thạo một phần mềm**"*.

### 2.3. Mô hình dựng sẵn làm được thứ lớp học không tự làm nổi

Đây là lập luận mạnh nhất — không phải "đành chấp nhận" mà là **nâng cấp**:

| Thí nghiệm | Vì sao lớp không tự làm được |
|---|---|
| Hai mô hình **5 ảnh vs 50 ảnh** đặt cạnh nhau | Huấn luyện hai mô hình trong 22 phút là không kịp |
| Mô hình **cố tình lệch** | Học sinh tự huấn luyện hay vô tình ra mô hình chạy tốt — không thấy thiên lệch đâu |
| Mô hình **rác** cùng đề với mô hình sạch | Phải chuẩn bị hai bộ dữ liệu, quá sức một tiết |

Mô hình dựng sẵn khiến **bài học luôn xảy ra đúng như thiết kế**.

---

## 3. PHẠM VI

### 3.1. Bài dùng Phòng Lab

| Khối | Tuần | Dùng trạm nào |
|---|---|---|
| 6 | 11 · 12 · 19 · 20 · 21 · 29 · 31 · 32 · 35 | 1 · 2 · 3 · 4 · 6 |
| 7 | 7 · 8 · 9 · 23 · 31 · 32 | 1 · 2 · 5 · 6 |
| 8 | 12 · 13 · 16 | 1 · 3 · 4 · 6 |

### 3.2. Bài KHÔNG dùng — vẫn tự huấn luyện bằng LearningML

| Khối | Tuần | Vì sao |
|---|---|---|
| 6 | 12 · 20 | Tên bài là *"Em dạy máy…"*, hành động huấn luyện chính là nội dung |
| 7 | 7 · 10 · 11 · 31 | Huấn luyện tư thế và văn bản — LearningML làm được |

> Hai công cụ **bổ sung cho nhau**, không thay thế nhau. Lab lo phần *hiểu*, LearningML lo phần *làm*.

---

## 4. NGUYÊN TẮC THIẾT KẾ

| # | Nguyên tắc | Hệ quả kỹ thuật |
|---|---|---|
| 1 | **Tĩnh hoàn toàn** | Không backend, không cơ sở dữ liệu, không build. Thả lên GitHub Pages là chạy |
| 2 | **Không tài khoản** | Đúng QĐ mục VI.4. Không thu thập gì của học sinh |
| 3 | **Không gọi mạng ngoài** | Thư viện và mô hình để ngay trong thư mục. 30 máy tính bảng cùng mở không nghẽn wifi trường |
| 4 | **Máy tính bảng trước** | Nút to tối thiểu 44px, chạm được bằng ngón tay, chạy cả ngang lẫn dọc |
| 5 | **Tiếng Việt toàn bộ** | Kể cả thông báo lỗi |
| 6 | **Mỗi trạm vừa một tiết** | Tối đa 15 phút thao tác, chừa chỗ cho thảo luận và ghi phiếu |
| 7 | **Ảnh không rời khỏi máy** | Ảnh chụp chỉ nằm trong RAM, huỷ ngay sau khi dùng. Hiện thông báo cho học sinh thấy |

---

## 5. KIẾN TRÚC

### 5.1. Cây thư mục

```
PhongLabAI/
├── index.html                  Trang chủ — chọn trạm
│
├── tram/
│   ├── 1-thu-mo-hinh.html      Trạm 1 · Thử mô hình
│   ├── 2-danh-lua.html         Trạm 2 · Làm máy đoán sai
│   ├── 3-so-sanh.html          Trạm 3 · So sánh hai mô hình
│   ├── 4-thien-lech.html       Trạm 4 · Phòng thiên lệch
│   ├── 5-nguong.html           Trạm 5 · Ngưỡng tin cậy
│   └── 6-vi-sao.html           Trạm 6 · Vì sao máy nói vậy
│
├── tro-choi/
│   ├── 1-danh-lua.html         Đánh lừa máy
│   ├── 2-doan-truoc.html       Đoán trước máy
│   ├── 3-nguoi-vs-may.html     Người nhanh hay máy nhanh
│   ├── 4-tham-tu.html          Thám tử thiên lệch
│   └── 5-khoa-cua.html         Khoá cửa thông minh
│
├── models.js                   ⭐ DANH SÁCH MÔ HÌNH — giáo viên chỉ sửa file này
│
├── models/                     Mô hình chuẩn để sẵn trong máy
│   ├── do-vat-day-du/          model.json · weights.bin · metadata.json
│   ├── do-vat-thieu/
│   ├── do-vat-lech-mau/
│   ├── do-vat-lech-nen/
│   ├── do-vat-lech-goc/
│   └── cam-xuc/
│
├── lib/                        Thư viện để LOCAL, không CDN
│   ├── tf.min.js
│   └── teachablemachine-image.min.js
│
├── js/lab.js                   Mã dùng chung: nạp mô hình, camera, thanh %
├── css/lab.css                 Giao diện dùng chung
└── GV_HuongDan.html            Hướng dẫn giáo viên chuẩn bị mô hình
```

### 5.2. Hai nguồn mô hình

Lab nhận mô hình từ **hai nguồn**, dùng chung một cơ chế nạp:

| Nguồn | Cách làm | Dùng cho |
|---|---|---|
| **File trong thư mục** | Tải 3 file từ Teachable Machine, bỏ vào `models/` | **6 mô hình chuẩn** của chương trình |
| **Link Teachable Machine** | Bấm *Export Model → Upload my model*, lấy link, dán vào `models.js` | Mô hình giáo viên tự thêm cho lớp mình |

Cùng khai báo trong một file, lab không phân biệt:

```js
// models.js — giáo viên chỉ sửa file này
const MO_HINH = [
  { ten: "Đồ vật — đầy đủ",        nguon: "models/do-vat-day-du/" },
  { ten: "Đồ vật — thiếu dữ liệu",  nguon: "models/do-vat-thieu/" },
  { ten: "Đồ vật — lệch màu",       nguon: "models/do-vat-lech-mau/" },
  { ten: "Chủ đề riêng lớp 6A1",    nguon: "https://teachablemachine.withgoogle.com/models/AbCd123/" }
];
```

**Vì sao 6 mô hình chuẩn phải để file, không dùng link:**

| Lý do | Chi tiết |
|---|---|
| **Mạng** | Mỗi mô hình ~5MB. 30 máy cùng vào một trạm là **150MB** kéo từ máy chủ Google mỗi tiết. Wifi trường yếu là cả lớp ngồi chờ |
| **Phụ thuộc** | Google đóng cửa sản phẩm không phải chuyện hiếm. Mô hình chết thì 15 bài chết theo |
| **Ngoại tuyến** | Để file thì mất mạng vẫn dạy được |

Mô hình giáo viên tự nghĩ thêm thì **dùng link cho nhanh** — không cần đụng vào thư mục.

### 5.3. Luồng dữ liệu trong tiết

```
GIÁO VIÊN (một lần, trên máy tính)
   Huấn luyện bằng Teachable Machine
        ↓
   Tải 3 file về  ─────→  bỏ vào models/     (mô hình chuẩn)
   hoặc Upload my model ─→  lấy link         (mô hình thêm)
        ↓
   Khai báo một dòng trong models.js
        ↓
HỌC SINH (trong tiết, trên máy tính bảng)
   Mở trạm → chọn mô hình từ danh sách thả xuống
        ↓
   Bật camera → ảnh vào RAM
        ↓
   Mô hình đoán → hiện thanh phần trăm
        ↓
   Ảnh HUỶ ngay, không lưu, không gửi đi đâu
```

**Không có dữ liệu nào của học sinh rời khỏi máy tính bảng.**

---

## 6. SÁU TRẠM CHỨC NĂNG

### Trạm 1 · Thử mô hình

| | |
|---|---|
| **Mục tiêu** | Học sinh thấy máy phân loại theo thời gian thực và đọc được độ tin cậy |
| **Yêu cầu cần đạt** | 6.C3.1 · 7.C5.1 · 8.C1.1 |
| **Bài dùng** | K6 T11·12·19 · K7 T7·8·23 · K8 T16 |
| **Nền có sẵn** | `index.html` hiện tại |

**Thao tác:**
1. Chọn mô hình từ **danh sách thả xuống** — danh sách lấy từ `models.js`, gồm cả mô hình để trong máy lẫn mô hình dùng link *(học sinh không phải gõ link — lớp 6 gõ rất chậm và hay sai)*
2. Bấm **Bật camera**
3. Đưa vật vào khung → thanh phần trăm chạy theo thời gian thực
4. Bấm **Chụp lại** để giữ một kết quả cho cả nhóm cùng nhìn và ghi phiếu

**Cần có:**
- Thanh phần trăm **to, màu phân biệt rõ**, nhãn tiếng Việt
- Nhãn cao nhất được **làm nổi bật**
- Nút **đổi camera trước/sau** — chụp đồ vật phải dùng camera sau
- Dòng nhắc: *"Ảnh chỉ nằm trong máy, không gửi đi đâu"*

---

### Trạm 2 · Làm máy đoán sai

| | |
|---|---|
| **Mục tiêu** | Học sinh tự phát hiện giới hạn của AI bằng cách phá nó |
| **Yêu cầu cần đạt** | 6.B1.1 · 6.D2.1 · 8.C5.MR1 |
| **Bài dùng** | K6 T19·21 · K7 T8 · K8 T16 |

**Thao tác:**
1. Mô hình chạy như trạm 1
2. Màn hình đưa **nhiệm vụ phá**: *"Làm cho máy nhận nhầm cây bút thành quyển sách"*
3. Học sinh thử: che một phần · đưa ra xa · xoay nghiêng · đổi ánh sáng · để vật lạ vào nền
4. Khi máy đoán sai → **hiện chúc mừng**, ghi lại cách phá vào bảng của nhóm
5. Cuối trạm: **bảng tổng hợp các cách phá được** của cả lớp

**Cần có:**
- Danh sách 5 nhiệm vụ phá, mỗi nhiệm vụ một mục tiêu khác nhau
- Tự nhận biết khi máy đoán sai *(nhãn ≠ nhãn đúng do học sinh chọn trước)*
- Ô ghi *"Em đã làm gì để máy sai?"* — in ra hoặc chép sang phiếu nhóm

> **Đây là trạm quan trọng nhất về mặt sư phạm.** Học sinh nhớ giới hạn của AI qua việc tự phá, không qua nghe giảng.

---

### Trạm 3 · So sánh hai mô hình

| | |
|---|---|
| **Mục tiêu** | Thấy tận mắt: nhiều dữ liệu thì máy giỏi hơn |
| **Yêu cầu cần đạt** | 6.C1.1 · 7.C4.1 |
| **Bài dùng** | K6 T12·19·20·31 · K8 T12 |

**Thao tác:**
1. Màn hình **chia đôi**, hai mô hình chạy song song cùng một khung hình camera
   - Trái: mô hình học từ **5 ảnh mỗi nhãn**
   - Phải: mô hình học từ **50 ảnh mỗi nhãn**
2. Đưa vật vào — hai bên cho kết quả khác nhau
3. Bảng đếm: mỗi bên đúng bao nhiêu lần trên 10 lần thử
4. Kết luận hiện ra sau 10 lần

**Cần có:**
- Một luồng camera, hai mô hình cùng chạy *(chú ý hiệu năng trên máy tính bảng)*
- Bảng đếm đúng/sai thao tác được bằng ngón tay
- Chế độ đổi cặp so sánh: *ít vs nhiều dữ liệu* · *dữ liệu sạch vs dữ liệu rác*

---

### Trạm 4 · Phòng thiên lệch

| | |
|---|---|
| **Mục tiêu** | Học sinh tự phát hiện mô hình đối xử không công bằng |
| **Yêu cầu cần đạt** | 6.B1.1 · 7.C4.1 · 7.C4.MR1 · 8.B1.1 |
| **Bài dùng** | K6 T21·32 · K7 T5·30 · K8 T13 |

**Thao tác:**
1. Nạp mô hình **cố tình lệch** — ví dụ chỉ được học ảnh **bút màu xanh**
2. Học sinh thử với nhiều loại bút khác nhau
3. Máy nhận đúng bút xanh, **trượt bút đỏ và bút vàng**
4. Màn hình hỏi: *"Vì sao máy nhận ra bút này mà không nhận ra bút kia?"*
5. Mở **bảng dữ liệu huấn luyện** → học sinh thấy toàn bút xanh
6. Câu hỏi cuối: *"Nếu đây là máy nhận diện học sinh, ai sẽ bị bỏ sót?"*

**Cần có:**
- Ít nhất **3 mô hình lệch theo 3 kiểu**: lệch màu · lệch góc chụp · lệch nền
- Nút **xem bộ dữ liệu đã học** — đây là bước "aha", không được bỏ
- Câu hỏi dẫn dắt hiện đúng lúc, không hiện sớm

---

### Trạm 5 · Ngưỡng tin cậy

| | |
|---|---|
| **Mục tiêu** | Hiểu máy không trả lời đúng/sai mà trả lời theo mức tin cậy, và con người chọn ngưỡng |
| **Yêu cầu cần đạt** | 7.C5.1 · 6.A1.2 |
| **Bài dùng** | K7 T8·23 · K6 T32 |

**Thao tác:**
1. Mô hình chạy, hiện phần trăm
2. **Thanh kéo ngưỡng 30% → 95%**
3. Dưới ngưỡng, máy trả lời *"Em không chắc"* thay vì đoán bừa
4. Học sinh kéo thanh và thấy: ngưỡng thấp thì máy hay đoán bừa, ngưỡng cao thì máy hay nói không biết
5. Tình huống: *"Máy này mở khoá cửa lớp. Em đặt ngưỡng bao nhiêu?"*

**Cần có:**
- Thanh kéo to, thao tác được bằng ngón tay
- Trạng thái *"Không chắc"* hiện rõ, khác màu
- Hai tình huống trái ngược để thấy đánh đổi: **khoá cửa** (ngưỡng cao) vs **gợi ý sách** (ngưỡng thấp)

---

### Trạm 6 · Vì sao máy nói vậy

| | |
|---|---|
| **Mục tiêu** | Trả lời câu *"tại sao nó lại như thế"* — phần kiến thức nền |
| **Yêu cầu cần đạt** | 6.C1.1 · 7.C5.1 · 8.C1.1 · 8.C1.MR1 |
| **Bài dùng** | mọi bài — dùng ở cuối tiết, 5 phút |

**Nội dung — 6 thẻ giải thích ngắn, mỗi thẻ một màn hình:**

| Thẻ | Nội dung | Hình thức |
|---|---|---|
| 1 | Máy không "nhìn thấy" như em — nó thấy **con số** | Ảnh → lưới ô vuông → dãy số |
| 2 | Máy so sánh với **những gì đã được xem** | Sơ đồ động |
| 3 | Vì sao máy **nói phần trăm** chứ không nói chắc chắn | Cột phần trăm minh hoạ |
| 4 | Dữ liệu **lệch** thì máy **lệch** | Nối thẳng trạm 4 |
| 5 | Máy **không hiểu ý nghĩa** — chỉ khớp mẫu | Ví dụ đánh lừa |
| 6 | **Con người quyết định cuối cùng** | Nối 6.A1.2 |

**Cần có:** mỗi thẻ đọc trong **dưới 60 giây**, nhiều hình ít chữ, có nút *"Em hiểu rồi"* để sang thẻ sau.

---

## 7. NĂM TRÒ CHƠI

Trò chơi không phải phần thưởng dán thêm — mỗi trò dạy đúng một điều mà trạm không dạy hết.

### Trò 1 · Đánh lừa máy

| | |
|---|---|
| **Dạy** | Giới hạn của AI · 6.D2.1 |
| **Bài** | K6 T19·21 · K7 T8 |

**Luật chơi:** 90 giây. Mỗi lần làm máy đoán sai được **1 điểm**. Nhưng **cùng một cách phá chỉ tính một lần** — buộc học sinh tìm cách mới, không lặp lại.

Cuối lượt hiện **danh sách các cách đã tìm ra**. Nhóm nào tìm được nhiều kiểu phá khác nhau nhất thì thắng.

*Vì sao hay:* trẻ con thích phá. Biến bản năng đó thành hoạt động khám phá giới hạn.

---

### Trò 2 · Đoán trước máy

| | |
|---|---|
| **Dạy** | Hiểu cách máy nghĩ · 7.C5.1 |
| **Bài** | K6 T20 · K7 T8 |

**Luật chơi:** hiện một ảnh khó. Học sinh **đoán trước** máy sẽ nói gì và **bao nhiêu phần trăm**, rồi mới bấm cho máy chạy.

Điểm tính theo mức gần đúng. Càng hiểu máy càng đoán chuẩn.

*Vì sao hay:* buộc học sinh **mô hình hoá cách máy nghĩ** trong đầu — đó chính là *"mô tả được cách AI hoạt động"*.

---

### Trò 3 · Người nhanh hay máy nhanh

| | |
|---|---|
| **Dạy** | Việc nào AI làm tốt, việc nào con người làm tốt · 6.D2.1 |
| **Bài** | K6 T19 · K8 T16 |

**Luật chơi:** 20 ảnh chạy qua. Học sinh phân loại bằng tay, máy phân loại song song. So **tốc độ** và **độ chính xác**.

Bộ ảnh chia hai phần có chủ ý:
- **10 ảnh dễ, rõ ràng** → máy thắng áp đảo về tốc độ
- **10 ảnh mẹo** — vật bị che, góc lạ, vật lai giữa hai nhóm → **người thắng**

*Vì sao hay:* kết luận không phải "AI giỏi hơn" hay "người giỏi hơn", mà **"mỗi bên giỏi việc khác nhau"** — đúng tinh thần mạch A của Bộ.

---

### Trò 4 · Thám tử thiên lệch

| | |
|---|---|
| **Dạy** | Phát hiện thiên lệch · 6.B1.1 · 7.C4.1 |
| **Bài** | K6 T21·32 · K7 T5·30 |

**Luật chơi:** cho một mô hình **bị lệch mà chưa nói lệch ở đâu**. Nhóm có 10 lần thử để tìm ra **nhóm nào bị máy đối xử tệ**.

Ghi phán đoán vào ô trả lời. Đúng thì mở ra **bộ dữ liệu thật** và giải thích nguyên nhân.

Ba vụ án với ba kiểu lệch khác nhau, khó dần.

*Vì sao hay:* thiên lệch là khái niệm trừu tượng nhất của cả chương trình. Biến thành **điều tra** thì học sinh nhớ.

---

### Trò 5 · Khoá cửa thông minh

| | |
|---|---|
| **Dạy** | Đánh đổi khi chọn ngưỡng · 7.C5.1 · 6.A1.2 |
| **Bài** | K7 T8·23 |

**Luật chơi:** học sinh làm bảo vệ, đặt **ngưỡng** cho máy mở cửa lớp.

Hệ thống cho 20 lượt người đến cửa — có bạn cùng lớp, có người lạ, có bạn đội mũ khẩu trang.

- Ngưỡng **thấp** → người lạ lọt vào: **trừ điểm an toàn**
- Ngưỡng **cao** → bạn cùng lớp bị chặn ngoài cửa: **trừ điểm tiện lợi**

Không có ngưỡng nào được điểm tuyệt đối. Cuối trò hỏi: *"Nếu đây là cửa bệnh viện thì em chọn khác không?"*

*Vì sao hay:* dạy được điều khó nhất — **AI luôn có đánh đổi, và con người là người chọn**.

---

## 8. MÔ HÌNH CẦN CHUẨN BỊ

Giáo viên huấn luyện một lần trên máy tính bằng Teachable Machine.

**Sáu mô hình dưới đây là xương sống của trạm 3 và 4 — bắt buộc để dạng file trong `models/`**, không dùng link.

| Mã | Nội dung | Dữ liệu huấn luyện | Dùng ở |
|---|---|---|---|
| `do-vat-day-du` | Bút · Sách · Tẩy | 50 ảnh mỗi nhãn, đủ góc và ánh sáng | Trạm 1·2·3·5 · Trò 1·2·3·5 |
| `do-vat-thieu` | Bút · Sách · Tẩy | **5 ảnh mỗi nhãn** | Trạm 3 |
| `do-vat-lech-mau` | Bút · Sách | Bút **chỉ màu xanh** | Trạm 4 · Trò 4 |
| `do-vat-lech-nen` | Bút · Sách | Chỉ chụp **trên bàn trắng** | Trạm 4 · Trò 4 |
| `do-vat-lech-goc` | Bút · Sách | Chỉ chụp **thẳng từ trên xuống** | Trạm 4 · Trò 4 |
| `cam-xuc` | Vui · Buồn · Ngạc nhiên | Ảnh minh hoạ, **không dùng ảnh học sinh** | K8 T16 |

**Quy tắc bắt buộc:** mô hình mẫu **không dùng ảnh mặt học sinh**. Dùng đồ vật hoặc ảnh minh hoạ có bản quyền rõ ràng.

Kèm mỗi mô hình một file `mota.json`: tên hiển thị tiếng Việt, số ảnh mỗi nhãn, chủ ý thiên lệch (nếu có) — để trạm 3 và 4 hiện được bảng dữ liệu.

### 8.1. Mô hình giáo viên tự thêm — dùng link

Giáo viên muốn làm mô hình riêng cho lớp mình:

1. Vào `teachablemachine.withgoogle.com` **trên máy tính** *(không vào được bằng máy tính bảng)*
2. Huấn luyện như bình thường
3. Bấm **Export Model → Upload my model** → chép link
4. Mở `models.js`, thêm **một dòng**

> ⚠️ **Cần kiểm trước khi phổ biến cho giáo viên:** nút *Upload my model* có bắt **đăng nhập Google** không, và có cảnh báo mô hình bị xoá sau một thời gian không dùng không.
>
> Nếu bắt đăng nhập thì phải dùng **một tài khoản chung của INOHUB**. Để giáo viên dùng tài khoản cá nhân thì người ta nghỉ việc là mất hết mô hình.

---

## 9. THIẾT KẾ GIAO DIỆN

| Yếu tố | Quy định |
|---|---|
| Kích thước nút | Tối thiểu **44 × 44 px** |
| Cỡ chữ | Nội dung ≥ 16px, tiêu đề ≥ 22px |
| Hướng màn hình | Chạy được cả **ngang và dọc** |
| Màu | Tương phản cao — phòng học nhiều ánh sáng |
| Ngôn ngữ | **Tiếng Việt toàn bộ**, kể cả lỗi |
| Điều hướng | Mọi trang có nút **← Về trang chủ** cố định |
| Trạng thái chờ | Nạp mô hình phải có vòng quay + chữ *"Đang chuẩn bị mô hình…"* |

**Trang chủ:** lưới ô lớn, mỗi ô một trạm hoặc trò chơi, có ảnh minh hoạ và một dòng mô tả. Chia hai khu rõ ràng: **Trạm thí nghiệm** và **Trò chơi**.

---

## 10. KỸ THUẬT

| Hạng mục | Quyết định | Lý do |
|---|---|---|
| Thư viện ML | TensorFlow.js + teachablemachine-image | Nạp thẳng mô hình định dạng Teachable Machine |
| Nơi để thư viện | **`lib/` trong thư mục, không CDN** | 30 máy cùng tải từ mạng ngoài sẽ nghẽn |
| Nơi để mô hình | **`models/` cho 6 mô hình chuẩn** · link cho mô hình thêm | Mô hình chuẩn phải chạy được kể cả mất mạng |
| Khai báo mô hình | Một mảng trong `models.js` | Giáo viên sửa một dòng, không cần biết lập trình |
| Nạp từ link ngoài | Dùng được — file mô hình của Teachable Machine cho phép trang khác tải | Trang huấn luyện chặn máy tính bảng, nhưng **file mô hình thì không** |
| Khung giao diện | **Không dùng framework** | Web tĩnh, không build, ai cũng sửa được |
| Lưu trữ | `localStorage` chỉ cho **điểm trò chơi** | Máy xoay vòng — có nút **Xoá dữ liệu buổi học** |
| Camera | `getUserMedia`, có nút đổi trước/sau | Chụp đồ vật cần camera sau |
| Huỷ ảnh | `tensor.dispose()` sau mỗi lần đoán · dừng luồng camera khi rời trang | Không dispose thì máy tính bảng hết bộ nhớ giữa tiết |
| Host | GitHub Pages hoặc Cloudflare Pages | Miễn phí, có HTTPS — **camera chỉ chạy trên HTTPS** |

**Chú ý hiệu năng:** trạm 3 chạy **hai mô hình cùng lúc**. Nếu máy tính bảng yếu thì đổi sang **chạy luân phiên** — chụp một khung hình rồi cho lần lượt hai mô hình đoán.

---

## 11. LỘ TRÌNH

| Giai đoạn | Nội dung | Kết quả |
|---|---|---|
| **1 — Thăm dò** | Trạm 1 chạy trên máy tính bảng thật: camera, nạp mô hình, thanh phần trăm | Biết máy có chạy nổi không. **Chặn mọi việc sau** |
| **2 — Lõi** | Trạm 1 · 2 · 5 + trang chủ | Đủ dùng cho 8 bài |
| **3 — Mở rộng** | Trạm 3 · 4 · 6 + trò 1 · 4 | Đủ dùng cho 15 bài |
| **4 — Hoàn thiện** | Trò 2 · 3 · 5 + hướng dẫn giáo viên + bộ mô hình đầy đủ | Xong |

**Giai đoạn 1 phải làm trước và làm riêng.** Nếu máy tính bảng không chạy nổi TensorFlow.js thì toàn bộ thiết kế này phải tính lại.

---

## 12. RỦI RO

| Rủi ro | Mức | Cách giảm |
|---|---|---|
| Máy tính bảng yếu, không chạy nổi mô hình | 🔴 Cao | Giai đoạn 1 thử trước. Dự phòng: dùng mô hình nhỏ hơn, hoặc giảm số khung hình mỗi giây |
| Trạm 3 chạy hai mô hình quá nặng | 🟠 Vừa | Đổi sang chạy luân phiên thay vì song song |
| Camera không chạy trên trình duyệt của máy | 🟠 Vừa | Bắt buộc HTTPS. Thử trước cả Chrome lẫn trình duyệt mặc định của máy |
| Không ai bảo trì sau khi bàn giao | 🟠 Vừa | Không dùng framework, không build — mã đọc thẳng được. Kèm tài liệu |
| **Mô hình dùng link — Google đổi chính sách hoặc đóng dịch vụ** | 🟠 Vừa | 6 mô hình chuẩn để dạng file, không phụ thuộc. Chỉ mô hình phụ mới dùng link |
| **30 máy cùng tải mô hình qua link, nghẽn wifi** | 🟠 Vừa | Mô hình chuẩn để trong máy. Nếu buộc dùng link thì cho lớp vào lệch giờ |
| Giáo viên không biết dựng mô hình mới | 🟡 Thấp | `GV_HuongDan.html` có ảnh chụp từng bước |
| Học sinh nghịch, xoá mất mô hình | 🟡 Thấp | Web tĩnh, học sinh không có quyền ghi. Tải lại trang là về nguyên |

---

## 13. PHỤ LỤC — ÁNH XẠ YÊU CẦU CẦN ĐẠT

| Mã YCCĐ | Nội dung | Trạm / Trò |
|---|---|---|
| 6.A1.2 | Con người quyết định cuối cùng | Trạm 5 · 6 · Trò 5 |
| 6.B1.1 | Mặt tích cực và hạn chế của một tính năng AI | Trạm 2 · 4 · Trò 1 · 4 |
| 6.C1.1 | Hai thành phần huấn luyện: dữ liệu và thuật toán | Trạm 3 · 6 |
| 6.C3.1 | Kể tên công nghệ AI quen thuộc | Trạm 1 |
| 6.D2.1 | Giới hạn của AI so với con người | Trạm 2 · Trò 1 · 3 |
| 7.C4.1 | Vấn đề đạo đức từ dữ liệu huấn luyện | Trạm 3 · 4 · Trò 4 |
| 7.C5.1 | Mô tả các bước huấn luyện AI qua ví dụ cụ thể | Trạm 1 · 5 · 6 · Trò 2 · 5 |
| 8.C1.1 | Cách AI thực hiện chức năng đọc, nghe, nhìn | Trạm 1 · 6 |
| 8.C1.MR1 | Công nghệ đảm nhiệm các chức năng đó | Trạm 6 |
| 8.C5.1 | Cách AI nhận diện cảm xúc | Trạm 1 · 2 với mô hình `cam-xuc` |
| 8.B1.1 | Nhận diện và phân loại rủi ro của AI | Trạm 4 · Trò 4 |

---

*Lập ngày 04/09/2026 · Bộ phận bài thực hành phần mềm*
