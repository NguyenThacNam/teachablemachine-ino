import { StationInfo, GameInfo } from '../types';

export const STATIONS: StationInfo[] = [
  {
    id: 'station-1',
    number: 'TRẠM 01',
    title: 'Thử Mô Hình',
    subtitle: 'Quan sát cơ bản',
    category: 'Quan sát cơ bản',
    yccd: 'YCCĐ: 6.C3.1',
    week: 'Tuần 1-2',
    description: 'Theo dõi độ tin cậy % thời gian thực, lật camera trước/sau trên tablet và khóa kết quả để phân tích vạch phân loại.',
    grades: ['k6', 'k7', 'k8'],
    icon: '📹',
    navTarget: 'station-1-2',
    subStationId: 'mode-1'
  },
  {
    id: 'station-2',
    number: 'TRẠM 02 • ĐẶC BIỆT',
    title: 'Làm Máy Đoán Sai',
    subtitle: 'Thử thách phá AI',
    category: 'Thử thách phá AI',
    yccd: 'YCCĐ: 6.B1.1',
    week: 'Tuần 3-4',
    description: 'Nhiệm vụ phá máy: nghiêng góc, che vật, đổi phông nền, chiếu ánh sáng lạ để tìm ra lỗ hổng của thị giác máy tính.',
    grades: ['k6'],
    icon: '🐞',
    isSpecial: true,
    navTarget: 'station-1-2',
    subStationId: 'mode-2'
  },
  {
    id: 'station-3',
    number: 'TRẠM 03',
    title: 'So Sánh Hai Mô Hình',
    subtitle: 'So sánh dữ liệu',
    category: 'So sánh dữ liệu',
    yccd: 'YCCĐ: 6.C1.1',
    week: 'Tuần 5',
    description: 'Màn hình chia đôi: Mô hình 5 ảnh vs 50 ảnh hoặc Dữ liệu chuẩn vs Rác nền. Đếm tỉ số đối đầu sau 10 lượt chấm điểm.',
    grades: ['k6', 'k7'],
    icon: '⇄',
    navTarget: 'station-3-4',
    subStationId: 'station-3'
  },
  {
    id: 'station-4',
    number: 'TRẠM 04',
    title: 'Phòng Thiên Lệch',
    subtitle: 'Đạo đức & Thiên lệch',
    category: 'Đạo đức & Thiên lệch',
    yccd: 'YCCĐ: 7.C4.MR1',
    week: 'Tuần 6',
    description: 'Thử mô hình chỉ học bút xanh, dẫn đến trượt bút đỏ/vàng. Mở kho dữ liệu để khám phá vì sao AI thiên vị và bất công.',
    grades: ['k6', 'k7'],
    icon: '⚖️',
    navTarget: 'station-3-4',
    subStationId: 'station-4'
  },
  {
    id: 'station-5',
    number: 'TRẠM 05',
    title: 'Ngưỡng Tin Cậy',
    subtitle: 'Ra quyết định',
    category: 'Ra quyết định',
    yccd: 'YCCĐ: 7.C5.1',
    week: 'Tuần 7-8',
    description: 'Kéo thanh trượt ngưỡng từ 30% đến 95%. Quan sát khi nào AI được quyền hành động và khi nào máy cần nói "Em không chắc".',
    grades: ['k7'],
    icon: '🎚️',
    navTarget: 'station-5-6',
    subStationId: 'tram-5'
  },
  {
    id: 'station-6',
    number: 'TRẠM 06',
    title: 'Vì Sao Máy Nói Vậy? ',
    subtitle: 'Giải mã bản chất',
    category: 'Giải mã bản chất',
    yccd: 'YCCĐ: 8.C1.1',
    week: 'Tuần 9',
    description: 'Bộ 6 thẻ giải thích trực quan dưới 60 giây: Máy thấy con số thế nào? So khớp mẫu ma trận ra sao? Và con người quyết định điều gì? ',
    grades: ['k6', 'k8'],
    icon: '❓',
    navTarget: 'station-5-6',
    subStationId: 'tram-6'
  }
];

export const GAMES: GameInfo[] = [
  {
    id: 'game-1',
    title: 'Đánh Lừa Máy',
    badge: '90s Blitz',
    badgeColor: 'text-thu bg-thu-nen',
    description: 'Trong 90 giây, tìm càng nhiều cách phá phán đoán của camera càng tốt. Mỗi cách hợp lệ nhận 1 điểm sao.',
    target: 'Mục tiêu: ≥ 4 cách phá',
    icon: '⏱'
  },
  {
    id: 'game-2',
    title: 'Đoán Trước Máy',
    badge: '10 Thử thách',
    badgeColor: 'text-nhan-dam bg-ke',
    description: 'Xem ảnh nhiễu hoặc vật lạ, đoán nhãn sai và khoảng phần trăm độ tin cậy AI sẽ đưa ra trước khi máy chấm.',
    target: 'Độ lệch ≤ 10%: +50đ',
    icon: '👁️'
  },
  {
    id: 'game-3',
    title: 'Người vs Máy',
    badge: '20 Lượt',
    badgeColor: 'text-nhan-dam bg-ke',
    description: '20 ảnh hỗn hợp: 10 ảnh thông thường máy thắng tốc độ milli-giây, 10 ảnh mẹo người thắng nhờ tư duy ngữ cảnh.',
    target: 'Tỉ số trực tiếp Live',
    icon: '⚡'
  },
  {
    id: 'game-4',
    title: 'Thám Tử Thiên Lệch',
    badge: 'Vụ Án AI',
    badgeColor: 'text-loi bg-loi-nen',
    description: 'Thực hiện 10 phép thử có chủ đích để truy tìm nhóm dữ liệu nào đã bị mô hình bỏ quên hoặc đối xử bất công.',
    target: 'Tìm vết trượt dữ liệu',
    icon: '🔎'
  },
  {
    id: 'game-5',
    title: 'Khóa Cửa Thông Minh',
    badge: 'Thực Tế',
    badgeColor: 'text-teal-700 bg-teal-100',
    description: 'Cân não cài đặt ngưỡng: An toàn tuyệt đối (không cho kẻ gian vào nhưng hay kẹt bạn) hay Tiện lợi (dễ mở nhưng dễ nhầm)? ',
    target: 'Đánh đổi An toàn / Tiện ích',
    icon: '🔒'
  }
];
