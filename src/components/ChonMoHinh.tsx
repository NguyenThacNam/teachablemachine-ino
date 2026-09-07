import React from 'react';
import { MO_HINH } from '../data/models';

interface ChonMoHinhProps {
  /** id mô hình đang chọn */
  giaTri: string;
  onChange: (id: string) => void;
  /** Chữ đứng trước ô chọn */
  nhan?: string;
  /** Ẩn biểu tượng, dùng khi đặt trong khung chật như trạm so sánh */
  gonGang?: boolean;
}

/**
 * Ô chọn mô hình dùng chung cho mọi trạm.
 *
 * Danh sách lấy thẳng từ src/data/models.ts nên thêm một mô hình mới là nó
 * xuất hiện ở tất cả các trạm, không phải sửa từng nơi.
 */
export const ChonMoHinh: React.FC<ChonMoHinhProps> = ({
  giaTri,
  onChange,
  nhan = 'Mô hình đang nạp:',
  gonGang = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
      {!gonGang && (
        <label className="text-sm sm:text-base font-semibold text-muc-nhat shrink-0 flex items-center gap-1.5">
          <span className="text-nhan text-[20px]" aria-hidden="true">🧠</span>
          <span>{nhan}</span>
        </label>
      )}
      {gonGang && (
        <label className="text-sm font-semibold text-muc-nhat shrink-0">{nhan}</label>
      )}

      <div className="relative flex-1 min-w-0 max-w-xl">
        <select
          value={giaTri}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[46px] pl-4 pr-10 rounded-to bg-nhan-nen border border-ke text-toi font-semibold text-sm sm:text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-nhan"
        >
          {MO_HINH.map((m) => (
            <option key={m.id} value={m.id}>
              {m.ten}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muc-mo">
          <span aria-hidden="true">▾</span>
        </div>
      </div>
    </div>
  );
};
