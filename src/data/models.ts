/**
 * DANH SÁCH MÔ HÌNH CỦA PHÒNG LAB
 *
 * Thêm mô hình mới:
 *   1. Teachable Machine → Export Model → tab Tensorflow.js → Download my model
 *   2. Giải nén 3 file (model.json · weights.bin · metadata.json) vào
 *      public/models/<ten-thu-muc>/
 *   3. Thêm một khối vào mảng MO_HINH bên dưới
 *
 * Mô hình đặt trên Teachable Machine (Upload my model) thì để nguyên link
 * https://teachablemachine.withgoogle.com/models/xxxx/ vào ô `nguon`.
 *
 * Quy tắc bắt buộc: mô hình mẫu KHÔNG dùng ảnh mặt học sinh. Dùng đồ vật
 * hoặc ảnh minh hoạ có bản quyền rõ ràng.
 */

export type KieuThienLech = 'mau' | 'nen' | 'goc' | 'thieu-du-lieu';

export interface MoHinhLab {
  id: string;
  /** Tên hiện trong danh sách thả xuống cho học sinh */
  ten: string;
  /** Thư mục trong public/models/ hoặc link Teachable Machine */
  nguon: string;
  /** Các nhãn mô hình phân biệt được, để hiện trước khi nạp */
  nhan?: string[];
  /** Số ảnh mỗi nhãn khi huấn luyện — bỏ trống nếu không nắm chắc */
  soAnhMoiNhan?: number;
  /** Mô hình này cho học sinh thấy hiện tượng gì */
  dayGi?: string;
  /** Trạm và trò chơi dùng tới */
  dungO?: string[];
  /** Mô hình cố tình lệch thì ghi kiểu lệch */
  thienLech?: KieuThienLech;
}

/** Mô hình đã có file trong máy, học sinh chọn được ngay */
export const MO_HINH: MoHinhLab[] = [
  {
    id: 'but-tay-ghim-50anh',
    ten: 'Đồ vật — đầy đủ dữ liệu (50 ảnh mỗi nhãn)',
    nguon: '/models/but-tay-ghim-50anh/',
    nhan: ['Bút', 'Tẩy', 'Ghim'],
    soAnhMoiNhan: 50,
    dayGi:
      'Vế "nhiều dữ liệu" của Trạm 3. Học đủ góc và đủ kiểu nên đoán chắc tay ' +
      'kể cả khi vật nghiêng hoặc bị che một phần.',
    dungO: ['Trạm 3 · So sánh hai mô hình'],
  },
  {
    id: 'but-tay-ghim-5anh',
    ten: 'Đồ vật — thiếu dữ liệu (5 ảnh mỗi nhãn)',
    nguon: '/models/but-tay-ghim-5anh/',
    nhan: ['Bút', 'Tẩy', 'Ghim'],
    soAnhMoiNhan: 5,
    thienLech: 'thieu-du-lieu',
    dayGi:
      'Cùng ba nhãn với mô hình trên, chỉ khác số ảnh đã học. Đặt cạnh nhau là ' +
      'học sinh thấy ngay: dữ liệu ít thì máy đoán chập chờn, đổi góc một chút đã sai.',
    dungO: ['Trạm 3 · So sánh hai mô hình'],
  },
  {
    id: 'but-tay-thuocke',
    ten: 'Đồ dùng học tập — Bút · Tẩy · Thước kẻ',
    nguon: '/models/but_tay_thuocke/',
    nhan: ['Tẩy', 'Thước kẻ', 'Bút'],
    dayGi:
      'Mô hình nền của phòng lab. Ba đồ vật nào cũng có sẵn trên bàn học, ' +
      'nên cả lớp thử được cùng lúc mà không phải chuẩn bị gì.',
    dungO: ['Trạm 1 · Thử mô hình', 'Trạm 2 · Làm máy đoán sai'],
  },
];

/**
 * Mô hình chương trình còn thiếu, theo mục 8 của bản Phân tích thiết kế.
 * Liệt kê ở trang Kiểm tra mô hình để biết trạm nào chưa chạy thật được.
 */
export interface MoHinhDuKien {
  ten: string;
  nhan: string[];
  duLieu: string;
  dayGi: string;
  dungO: string[];
}

export const MO_HINH_DU_KIEN: MoHinhDuKien[] = [
  {
    ten: 'Đồ vật — lệch màu',
    nhan: ['Bút', 'Sách'],
    duLieu: 'Bút chỉ chụp loại màu xanh',
    dayGi:
      'Máy nhận đúng bút xanh nhưng trượt bút đỏ, bút vàng. Câu hỏi cuối: ' +
      'nếu đây là máy nhận diện học sinh thì ai bị bỏ sót?',
    dungO: ['Trạm 4 · Phòng thiên lệch', 'Trò 4 · Thám tử thiên lệch'],
  },
  {
    ten: 'Đồ vật — lệch nền',
    nhan: ['Bút', 'Sách'],
    duLieu: 'Chỉ chụp trên mặt bàn trắng',
    dayGi:
      'Máy học nhầm cả cái nền chứ không riêng đồ vật. Đổi sang nền vân gỗ ' +
      'là máy đoán sai ngay.',
    dungO: ['Trạm 4 · Phòng thiên lệch', 'Trò 4 · Thám tử thiên lệch'],
  },
  {
    ten: 'Đồ vật — lệch góc chụp',
    nhan: ['Bút', 'Sách'],
    duLieu: 'Chỉ chụp thẳng từ trên xuống',
    dayGi: 'Nghiêng vật 45° là máy mất dấu — thiên lệch không chỉ nằm ở màu sắc.',
    dungO: ['Trạm 4 · Phòng thiên lệch'],
  },
  {
    ten: 'Cảm xúc khuôn mặt',
    nhan: ['Vui', 'Buồn', 'Ngạc nhiên'],
    duLieu: 'Ảnh minh hoạ có bản quyền rõ ràng — tuyệt đối không dùng ảnh học sinh',
    dayGi: 'Yêu cầu cần đạt 8.C5.1 — cách AI nhận diện cảm xúc.',
    dungO: ['Khối 8 tuần 16'],
  },
];

/** Cặp mô hình Trạm 3 so sánh: cùng nhãn, chỉ khác số ảnh đã học */
export const CAP_SO_SANH = {
  itAnh: 'but-tay-ghim-5anh',
  nhieuAnh: 'but-tay-ghim-50anh',
} as const;

export function timMoHinh(id: string): MoHinhLab | undefined {
  return MO_HINH.find((m) => m.id === id);
}
