import React, { useEffect } from 'react';

/** Đóng lớp phủ bằng phím Esc, và khoá cuộn nền khi đang mở */
function useDongBangEsc(dangMo: boolean, onClose: () => void) {
  useEffect(() => {
    if (!dangMo) return;
    const nghe = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const cuonCu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', nghe);
    return () => {
      window.removeEventListener('keydown', nghe);
      document.body.style.overflow = cuonCu;
    };
  }, [dangMo, onClose]);
}

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorksheetModal: React.FC<WorksheetModalProps> = ({ isOpen, onClose }) => {
  useDongBangEsc(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-toi/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-the w-full max-w-3xl rounded-to p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-ke"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Print action */}
        <div className="flex items-center justify-between border-b pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-nhan text-[24px]" aria-hidden="true">📄</span>
            <h3 className="text-lg font-semibold text-toi">Phiếu Học Tập Nhóm (Bản In A4 Chuẩn Tiết Học)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-vua bg-nhan text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-nhan-dam cursor-pointer"
              type="button"
            >
              <span className="text-[16px]" aria-hidden="true">🖨️</span>
              <span>In Phiếu / Lưu PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-giay text-muc-nhat hover:bg-ke flex items-center justify-center font-semibold text-base cursor-pointer"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* The Worksheet Content */}
        <div className="chi-in flex flex-col gap-5 text-toi border-2 border-ke-dam p-6 rounded-to bg-white">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-toi pb-3 gap-2">
            <div>
              <h2 className="text-lg font-bold uppercase">TRƯỜNG THCS: ....................................................</h2>
              <span className="text-sm font-semibold text-muc-nhat">PHIẾU BÁO CÁO THỰC NGHIỆM PHÒNG LAB AI</span>
            </div>
            <div className="text-right text-sm">
              <div><strong>Lớp:</strong> .................... • <strong>Nhóm:</strong> ...........</div>
              <div className="text-muc-mo">Tiết học 22 phút STEM AI</div>
            </div>
          </div>

          <div className="text-sm">
            <strong>Thành viên trong nhóm:</strong> 1................................ 2................................ 3................................ 4................................
          </div>

          {/* Task 1 */}
          <div className="p-3 bg-giay rounded-vua border border-ke text-sm flex flex-col gap-1.5">
            <strong className="text-nhan-dam">PHẦN 1: THỬ THÁCH PHÁ MÁY (TRẠM 02)</strong>
            <p className="text-muc-nhat">Ghi lại ít nhất 2 cách nhóm em đã làm AI nhận diện CÂY BÚT thành vật thể khác:</p>
            <div className="border-b border-dotted border-muc-mo py-1">Cách 1: ............................................................................................................................................</div>
            <div className="border-b border-dotted border-muc-mo py-1">Cách 2: ............................................................................................................................................</div>
          </div>

          {/* Task 2 */}
          <div className="p-3 bg-giay rounded-vua border border-ke text-sm flex flex-col gap-1.5">
            <strong className="text-nhan-dam">PHẦN 2: SO SÁNH DỮ LIỆU & THIÊN LỆCH (TRẠM 03 & 04)</strong>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="p-2 bg-white rounded border">
                <strong>Mô hình 5 ảnh:</strong> Đạt: ...... / 10 điểm
              </div>
              <div className="p-2 bg-white rounded border">
                <strong>Mô hình 50 ảnh:</strong> Đạt: ...... / 10 điểm
              </div>
            </div>
            <p className="text-muc-nhat mt-1">Vì sao AI không nhận ra bút bi đỏ ở Trạm 04?</p>
            <div className="border-b border-dotted border-muc-mo py-1">Trả lời: ............................................................................................................................................</div>
          </div>

          {/* Task 3 */}
          <div className="p-3 bg-giay rounded-vua border border-ke text-sm flex flex-col gap-1.5">
            <strong className="text-nhan-dam">PHẦN 3: ĐẶT NGƯỠNG AN TOÀN (TRẠM 05)</strong>
            <p className="text-muc-nhat">Nếu là người quản lý cửa lớp học, nhóm em chọn ngưỡng bao nhiêu %? Vì sao?</p>
            <div className="border-b border-dotted border-muc-mo py-1">Ngưỡng đề xuất: ............% • Lý do: ....................................................................................</div>
          </div>

          {/* Footer Signatures */}
          <div className="flex justify-between items-end pt-4 text-sm">
            <div className="text-center">
              <div>Thư ký nhóm ký tên</div>
              <div className="h-10"></div>
              <div>...................................</div>
            </div>
            <div className="text-center">
              <div>Giáo viên chấm điểm & nhận xét</div>
              <div className="h-10"></div>
              <div>...................................</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 rounded-vua bg-giay text-muc font-semibold text-sm hover:bg-ke cursor-pointer"
            type="button"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  useDongBangEsc(isOpen, onClose);
  if (!isOpen) return null;

  const teams = [
    { rank: 1, name: 'Nhóm 3 — Tia Chớp', tricks: 6, stars: 12, biasFound: '100% Bút Xanh', status: 'Xuất Sắc ⭐⭐⭐' },
    { rank: 2, name: 'Nhóm 1 — Thám Tử Nhí', tricks: 5, stars: 10, biasFound: 'Đã giải mã', status: 'Giỏi ⭐⭐' },
    { rank: 3, name: 'Nhóm 5 — AI Robocon', tricks: 4, stars: 9, biasFound: 'Đã giải mã', status: 'Giỏi ⭐⭐' },
    { rank: 4, name: 'Nhóm 2 — Đại Bàng', tricks: 3, stars: 7, biasFound: 'Đang thử', status: 'Đạt ⭐' },
    { rank: 5, name: 'Nhóm 4 — Vươn Xa', tricks: 3, stars: 6, biasFound: 'Đang thử', status: 'Đạt ⭐' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-toi/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-the w-full max-w-2xl rounded-to p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-ke"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="text-thu text-[24px]" aria-hidden="true">🏆</span>
            <h3 className="text-lg font-semibold text-toi">Bảng Thành Tích Thám Tử AI (Toàn Lớp)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-giay text-muc-nhat hover:bg-ke flex items-center justify-center font-semibold text-base cursor-pointer"
            type="button"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-muc-nhat">
          Cập nhật trực tiếp số lượng chiêu thức phá mô hình và số sao thu thập của các nhóm học sinh trong giờ học.
        </p>

        <div className="flex flex-col gap-2.5">
          {teams.map((t) => (
            <div
              key={t.rank}
              className={`p-4 rounded-to border flex items-center justify-between gap-3 ${
 t.rank === 1
 ? 'bg-thu-nen border-ke-dam ring-2 ring-thu'
 : 'bg-giay border-ke'
 }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-vua font-semibold flex items-center justify-center text-sm ${
 t.rank === 1
 ? 'bg-thu text-white'
 : t.rank === 2
 ? 'bg-ke-dam text-toi-nhat'
 : 'bg-ke text-muc-nhat'
 }`}
                >
                  #{t.rank}
                </span>
                <div>
                  <h4 className="text-base font-semibold text-toi">{t.name}</h4>
                  <span className="text-sm text-muc-mo">
                    Phát hiện thiên lệch: <strong>{t.biasFound}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-nhan-dam">{t.tricks} cách phá</span>
                  <span className="text-sm font-semibold text-thu">{t.stars} ⭐</span>
                </div>
                <span className="px-2.5 py-1 rounded-nho bg-white border text-sm font-semibold text-muc hidden sm:inline">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 rounded-vua bg-nhan text-white font-semibold text-sm hover:bg-nhan-dam cursor-pointer"
            type="button"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};
