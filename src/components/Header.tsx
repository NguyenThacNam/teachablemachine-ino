import React from 'react';
import { NavPage, GradeFilter } from '../types';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage, subStation?: string) => void;
  currentGrade: GradeFilter;
  onChangeGrade: (grade: GradeFilter) => void;
  onResetSession: () => void;
}

const MUC_DIEU_HUONG: { trang: NavPage; ten: string; gomThem?: NavPage[] }[] = [
  { trang: 'home', ten: 'Trang Chủ Chọn Trạm' },
  {
    trang: 'station-1-2',
    ten: '6 Trạm Thí Nghiệm',
    gomThem: ['station-3-4', 'station-5-6'],
  },
  { trang: 'games', ten: '5 Trò Chơi Khám Phá' },
  { trang: 'kiem-tra-model', ten: 'Kiểm Tra Mô Hình' },
];

const KHOI: GradeFilter[] = ['k6', 'k7', 'k8'];

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  currentGrade,
  onChangeGrade,
  onResetSession,
}) => {
  return (
    // sticky chứ không fixed: thanh này nằm trong luồng nên không bao giờ đè lên
    // nội dung, khỏi phải canh padding-top cho <main>
    <header className="khong-in sticky top-0 z-50 bg-giay border-b border-ke">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto flex flex-col gap-2 py-2">
        {/* Hàng trên: tên sản phẩm và thao tác lớp học */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
            type="button"
          >
            <span className="w-9 h-9 rounded-vua bg-nhan flex items-center justify-center text-white font-bold text-lg shrink-0">
              A
            </span>
            <span className="flex flex-col">
              <span className="font-bold text-lg text-muc leading-tight group-hover:text-nhan transition-colors">
                Phòng Lab AI
              </span>
              <span className="text-sm text-muc-mo leading-tight">INOHUB STEM Explorer</span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1 bg-the p-1 rounded-vua border border-ke">
              {KHOI.map((k) => (
                <button
                  key={k}
                  onClick={() => onChangeGrade(k)}
                  className={`min-h-[36px] px-3 rounded-nho text-sm font-semibold transition-colors ${
                    currentGrade === k
                      ? 'bg-nhan text-white'
                      : 'text-muc-nhat hover:text-nhan-dam'
                  }`}
                  type="button"
                >
                  Khối {k.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={onResetSession}
              className="min-h-[38px] px-3 flex items-center gap-1.5 rounded-nho border border-ke-dam bg-the text-loi text-sm font-semibold hover:bg-loi-nen transition-colors cursor-pointer"
              title="Xoá toàn bộ dữ liệu và ghi chép buổi học trên máy này"
              type="button"
            >
              <span aria-hidden="true">🧹</span>
              <span className="hidden md:inline">Xoá dữ liệu buổi học</span>
            </button>
          </div>
        </div>

        {/* Hàng dưới: điều hướng — lưới cột bằng nhau nên các mục cách đều,
            không dồn về một góc. Máy tính bảng đủ chỗ cho 4 cột, điện thoại thì 2. */}
        <nav className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {MUC_DIEU_HUONG.map((m) => {
            const dangMo =
              currentPage === m.trang || (m.gomThem?.includes(currentPage) ?? false);
            return (
              <button
                key={m.trang}
                onClick={() => onNavigate(m.trang)}
                className={`min-h-[40px] w-full inline-flex items-center justify-center px-3 rounded-nho text-base font-semibold text-center transition-colors cursor-pointer ${
                  dangMo
                    ? 'bg-nhan text-white'
                    : 'text-muc-nhat hover:bg-nhan-nen hover:text-nhan-dam'
                }`}
                type="button"
              >
                {m.ten}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
