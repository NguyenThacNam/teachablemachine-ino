import { Flashcard } from '../types';

export const FLASHCARDS: Flashcard[] = [
  {
    indexTag: 'THẺ 1 / 6',
    time: '< 40 giây để hiểu',
    overline: 'BẢN CHẤT CỦA MẮT MÁY TÍNH',
    title: 'Máy Không Nhìn Như Em, Máy Thấy Con Số',
    body: 'Khi em nhìn bạn mình, em thấy nụ cười, màu áo và đôi mắt. Nhưng camera gửi vào vi xử lý một lưới gồm hàng triệu ô vuông nhỏ xíu (pixel). Với máy, mỗi pixel chỉ là 3 con số: Đỏ, Xanh lá, Xanh dương (RGB)!',
    analogy: 'Ví dụ gần gũi:',
    analogyDetail: 'Giống như em chơi xếp tranh đính hạt theo số: Đặt hạt mã #255 màu đỏ, hạt #120 màu xanh. Toàn bộ hình ảnh thực ra là bảng tính khổng lồ!',
    type: 'matrix'
  },
  {
    indexTag: 'THẺ 2 / 6',
    time: '< 35 giây để hiểu',
    overline: 'BỘ NHỚ HỌC TẬP',
    title: 'Máy So Sánh Với Những Gì Đã Xem',
    body: 'Máy tính không có trí tưởng tượng bay bổng. Nó chỉ có một kho dữ liệu mẫu mà thầy cô giáo hoặc lập trình viên đã nạp sẵn vào (Training Data). Khi đưa vật thể mới tới, máy đem so từng đặc điểm xem giống mẫu nào nhất.',
    analogy: 'Ví dụ gần gũi:',
    analogyDetail: 'Giống như em mở quyển sổ vẽ mẫu: Thấy hình tròn và hai tai dài, em lật sổ so xem giống Con Thỏ hay Chú Chuột trong sách mẫu!',
    type: 'compare'
  },
  {
    indexTag: 'THẺ 3 / 6',
    time: '< 45 giây để hiểu',
    overline: 'TÍNH XÁC SUẤT TOÁN HỌC',
    title: 'Vì Sao Máy Nói Phần Trăm Chứ Không Chắc Chắn? ',
    body: 'Thế giới thực có bóng râm, góc nghiêng và ánh sáng thay đổi liên tục. Máy không bao giờ dám nói "Chắc 100%!". Máy chỉ tính ra điểm số xác suất (Ví dụ: 82% là Chó, 18% là Khăn len cuộn tròn).',
    analogy: 'Ví dụ gần gũi:',
    analogyDetail: 'Khi trời nhiều mây đen, em sẽ bảo "Khả năng 80% trời sắp mưa", chứ không ai dám thề 100% cả! Máy tính cũng làm toán ước lượng y như vậy.',
    type: 'prob'
  },
  {
    indexTag: 'THẺ 4 / 6',
    time: '< 50 giây để hiểu',
    overline: 'NGUYÊN TẮC DỮ LIỆU HUẤN LUYỆN',
    title: 'Dữ Liệu Lệch Thì Máy Đoán Lệch',
    body: 'Nếu ta chỉ dạy máy ảnh quả Táo Màu Đỏ, khi gặp một quả Táo Xanh lá cây giòn ngọt, máy sẽ lắc đầu bảo:"Đây không phải quả táo!". Máy không thông minh hơn những gì nó được người ta nạp vào.',
    analogy: 'Ví dụ gần gũi:',
    analogyDetail: 'Nếu một bạn nhỏ từ bé chỉ được xem tranh chó lông xù màu trắng, ngày đầu tiên gặp chú chó đen thui, bạn ấy sẽ nghĩ đó là con gấu!',
    type: 'bias'
  },
  {
    indexTag: 'THẺ 5 / 6',
    time: '< 45 giây để hiểu',
    overline: 'GIỚI HẠN HIỂU BIẾT',
    title: 'Máy Không Hiểu Ý Nghĩa, Chỉ Khớp Mẫu',
    body: 'Khi máy nhận ra "Cái Bút", nó không hề biết cây bút dùng để viết bài, vẽ tranh hay có mực bên trong. Máy chỉ thấy các nét thẳng dài, hai đầu thon nhọn xếp cạnh nhau. Nó là bậc thầy ghép hình, không phải triết gia!',
    analogy: 'Ví dụ gần gũi:',
    analogyDetail: 'Em dùng khuôn bánh hình ngôi sao dập lên bột: Khuôn không biết ngôi sao trên trời là gì, nó chỉ đơn giản có 5 cánh nhọn!',
    type: 'pattern'
  },
  {
    indexTag: 'THẺ 6 / 6',
    time: '< 40 giây để hiểu',
    overline: 'BẢN LĨNH CON NGƯỜI (YCCĐ 6.A1.2)',
    title: 'Con Người Luôn Kiểm Soát & Quyết Định!',
    body: 'AI là một chiếc kính hiển vi hoặc chiếc máy tính bỏ túi siêu cấp giúp con người nhìn nhanh hơn. Nhưng ai quyết định đặt ngưỡng? Ai quyết định khi nào mở cửa? Chính là các em và thầy cô giáo!',
    analogy: 'Ví dụ gần gũi:',
    analogyDetail: 'Người lái xe cầm vô lăng: Bản đồ GPS chỉ gợi ý đường đi nhanh nhất, nhưng rẽ vào đâu và dừng xe lúc nào là ở đôi tay của bác tài xế!',
    type: 'human'
  }
];
