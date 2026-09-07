import React from 'react';
import { KiemTraMoHinh } from './KiemTraMoHinh';
import { MO_HINH, MO_HINH_DU_KIEN } from '../data/models';

interface TrangKiemTraModelProps {
  onBack: () => void;
  onOpenWorksheet: () => void;
  onOpenLeaderboard: () => void;
}

export const TrangKiemTraModel: React.FC<TrangKiemTraModelProps> = ({
  onBack,
  onOpenWorksheet,
  onOpenLeaderboard,
}) => {
  return (
    <div className="flex flex-col w-full gap-6">
      <button onClick={onBack} className="nut self-start" type="button">
        ← Quay lại Trang Chủ
      </button>

      <div className="flex flex-col gap-2 border-b-2 border-muc pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-muc">Kiểm Tra Mô Hình</h1>
        <p className="text-base text-muc-nhat max-w-3xl">
          Chạy trước khi phát máy cho học sinh. Mỗi mô hình được nạp thật rồi giải phóng ngay, nên
          biết chắc mô hình nào hỏng hoặc tải quá chậm trước khi 30 máy tính bảng cùng mở.
        </p>
      </div>

      <KiemTraMoHinh />

      {/* Mô hình đã huấn luyện sẵn */}
      <section className="flex flex-col gap-3">
        <h2 className="nhan-muc">
          <span>Các mô hình đã train sẵn</span>
          <span className="nhan-muc-so">{MO_HINH.length} mô hình</span>
        </h2>
        <p className="text-base text-muc-nhat max-w-3xl">
          Giáo viên không phải huấn luyện gì. Mô hình đã dựng sẵn nên hiện tượng cần dạy luôn xảy ra
          đúng như thiết kế, thay vì mỗi nhóm ra một kết quả khác nhau.
        </p>

        <div className="flex flex-col gap-3">
          {MO_HINH.map((m) => (
            <article key={m.id} className="the p-5 flex flex-col gap-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-muc">{m.ten}</h3>
                <span className="so text-sm text-muc-mo">{m.nguon}</span>
              </div>

              {m.nhan && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muc-nhat">Nhận ra:</span>
                  {m.nhan.map((n) => (
                    <span key={n} className="chip">
                      {n}
                    </span>
                  ))}
                </div>
              )}

              {m.soAnhMoiNhan && (
                <p className="text-base text-muc-nhat">
                  Huấn luyện với <span className="so">{m.soAnhMoiNhan}</span> ảnh mỗi nhãn.
                </p>
              )}

              {m.dayGi && <p className="text-base text-muc-nhat">{m.dayGi}</p>}

              {m.dungO && (
                <p className="text-sm text-muc-mo">Dùng ở: {m.dungO.join(' · ')}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Mô hình chương trình còn thiếu */}
      <section className="flex flex-col gap-3">
        <h2 className="nhan-muc">
          <span>Mô hình còn thiếu</span>
          <span className="nhan-muc-so">{MO_HINH_DU_KIEN.length} mô hình</span>
        </h2>
        <p className="text-base text-muc-nhat max-w-3xl">
          Những mô hình dưới đây chưa có file trong máy. Trạm 3, Trạm 4 và trò Thám tử thiên lệch
          phải có đủ chúng mới chạy được trên dữ liệu thật — hiện các trạm đó vẫn dùng số dựng sẵn.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {MO_HINH_DU_KIEN.map((m) => (
            <article
              key={m.ten}
              className="the p-5 flex flex-col gap-2 border-dashed border-ke-dam"
            >
              <div className="flex items-baseline gap-2">
                <span className="chip shrink-0">Chưa có</span>
                <h3 className="text-lg font-semibold text-muc">{m.ten}</h3>
              </div>
              <p className="text-base text-muc-nhat">
                <span className="text-muc-mo">Nhãn:</span> {m.nhan.join(' · ')}
              </p>
              <p className="text-base text-muc-nhat">
                <span className="text-muc-mo">Dữ liệu:</span> {m.duLieu}
              </p>
              <p className="text-base text-muc-nhat">{m.dayGi}</p>
              <p className="text-sm text-muc-mo">Dành cho: {m.dungO.join(' · ')}</p>
            </article>
          ))}
        </div>

        <p className="text-sm text-muc-nhat o-trong p-4">
          <strong>Lưu ý khi chuẩn bị mô hình:</strong> tuyệt đối không dùng ảnh mặt học sinh. Dùng
          đồ vật có sẵn trên bàn học, hoặc ảnh minh hoạ có bản quyền rõ ràng.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <button onClick={onOpenWorksheet} className="nut" type="button">
          🖨️ Phiếu học tập nhóm (bản in A4)
        </button>
        <button onClick={onOpenLeaderboard} className="nut" type="button">
          🏆 Bảng điểm toàn lớp
        </button>
      </div>
    </div>
  );
};
