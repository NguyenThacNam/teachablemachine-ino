import React, { useState } from 'react';
import { STATIONS, GAMES } from '../data/stations';
import { NavPage, GradeFilter } from '../types';

const BO_LOC: { ma: GradeFilter; ten: string; tuan?: string }[] = [
  { ma: 'all', ten: 'Tất cả' },
  { ma: 'k6', ten: 'Khối 6', tuan: '9 tuần' },
  { ma: 'k7', ten: 'Khối 7', tuan: '6 tuần' },
  { ma: 'k8', ten: 'Khối 8', tuan: '3 tuần' },
];

interface HomeScreenProps {
  onNavigate: (page: NavPage, subStation?: string) => void;
  gradeFilter: GradeFilter;
  onChangeGrade: (grade: GradeFilter) => void;
  onOpenWorksheetModal: () => void;
  onOpenLeaderboardModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  gradeFilter,
  onChangeGrade,
  onOpenWorksheetModal,
  onOpenLeaderboardModal,
}) => {
  const [customModelUrl, setCustomModelUrl] = useState('');
  const [loadedModelMsg, setLoadedModelMsg] = useState<string | null>(null);
  const [loadedModelOk, setLoadedModelOk] = useState(true);
  const [dangKiemTra, setDangKiemTra] = useState(false);

  const filteredStations = STATIONS.filter(s => {
    if (gradeFilter === 'all') return true;
    return s.grades.includes(gradeFilter);
  });

  /**
   * Thử tải thật metadata.json của mô hình để biết link có dùng được không.
   * Chỉ kiểm tra, chưa nạp vào trạm — muốn dùng lâu dài thì khai báo trong
   * src/data/models.ts.
   */
  const handleLoadCustomModel = async () => {
    const url = customModelUrl.trim();
    if (!url) {
      setLoadedModelOk(false);
      setLoadedModelMsg('Em chưa dán đường link. Ví dụ: https://teachablemachine.withgoogle.com/models/AbCd123/');
      return;
    }

    setDangKiemTra(true);
    setLoadedModelMsg(null);

    try {
      const base = url.endsWith('/') ? url : `${url}/`;
      const phanHoi = await fetch(`${base}metadata.json`);
      if (!phanHoi.ok) throw new Error(`máy chủ trả về mã ${phanHoi.status}`);

      const metadata = await phanHoi.json();
      const nhan: string[] = Array.isArray(metadata?.labels) ? metadata.labels : [];
      if (nhan.length === 0) throw new Error('không tìm thấy danh sách nhãn trong metadata.json');

      setLoadedModelOk(true);
      setLoadedModelMsg(
        `Link dùng được — mô hình có ${nhan.length} nhãn: ${nhan.join(' · ')}. ` +
          'Thêm link này vào src/data/models.ts để nó xuất hiện trong danh sách của các trạm.',
      );
    } catch (err) {
      const chiTiet = err instanceof Error ? err.message : String(err);
      setLoadedModelOk(false);
      setLoadedModelMsg(`Không đọc được mô hình từ link này (${chiTiet}). Kiểm tra lại đường link và kết nối mạng.`);
    } finally {
      setDangKiemTra(false);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-10">
      {/* MĂNG-SÉT — kiểu trang bìa sổ tay, không phải banner quảng cáo */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 border-b-2 border-muc pb-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-muc">Phòng Lab AI</h1>
            <p className="text-base sm:text-lg text-muc-nhat mt-1.5">
              Thử · Phá · So sánh · Hiểu vì sao — xem cách máy nhìn thế giới, không phải ngồi huấn luyện.
            </p>
          </div>
          <p className="so text-sm text-muc-mo shrink-0 pb-1">6 trạm · 5 trò chơi · tiết 22 phút</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Lọc theo khối */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base text-muc-nhat mr-1">Lọc theo khối:</span>
            {BO_LOC.map((b) => (
              <button
                key={b.ma}
                onClick={() => onChangeGrade(b.ma)}
                className={`nut ${gradeFilter === b.ma ? 'nut-chinh' : ''}`}
                type="button"
              >
                {b.ten}
                {b.tuan && <span className="so text-sm opacity-70">{b.tuan}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* KHU VỰC 1: 6 TRẠM THÍ NGHIỆM CHỨC NĂNG (BENTO GRID 3x2) */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-nhan text-sm font-semibold">
              <span className="text-[18px]" aria-hidden="true">🧫</span>
              <span>Không Gian Thực Hành</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-toi">
              6 Trạm Thí Nghiệm Chức Năng
            </h2>
          </div>
          <p className="text-sm sm:text-base text-muc-mo max-w-md text-left sm:text-right">
            Học sinh trực tiếp tác động thị giác máy tính, phát hiện lỗi suy luận và trải nghiệm bản chất của phân loại ảnh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStations.map((station) => (
            <article
              key={station.id}
              className={`flex flex-col justify-between bg-white rounded-to p-6 border transition-all duration-300 relative ${
 station.isSpecial
 ? 'border-ke-dam ring-2 ring-thu'
 : 'border-ke hover:border-ke-dam'
 }`}
            >
              {station.isSpecial && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-thu text-white text-sm font-semibold rounded-bl-2xl rounded-tr-3xl flex items-center gap-1">
                  <span className="text-[14px]" aria-hidden="true">⭐</span>
                  <span>Trọng tâm buổi học</span>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`w-12 h-12 rounded-to flex items-center justify-center text-[24px] ${
 station.isSpecial
 ? 'bg-thu-nen text-thu'
 : 'bg-ke text-nhan-dam'
 }`}
                  >
                    <span className="text-[24px]" aria-hidden="true">{station.icon}</span>
                  </span>

                  <div className={`flex flex-wrap items-center gap-1 justify-end ${station.isSpecial ? 'mr-28' : ''}`}>
                    <span className="px-2 py-0.5 rounded-nho bg-nhan-nen text-nhan-dam text-sm font-semibold border border-ke">
                      {station.yccd}
                    </span>
                    <span className="px-2 py-0.5 rounded-nho bg-giay text-muc-nhat text-sm">
                      {station.week}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muc-mo">{station.number}</span>
                    <span className="w-1 h-1 rounded-full bg-ke-dam"></span>
                    <span
                      className={`text-sm font-semibold ${
 station.isSpecial ? 'text-thu' : 'text-nhan-dam'
 }`}
                    >
                      {station.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-toi">{station.title}</h3>
                  <p className="text-base text-muc-nhat leading-relaxed">{station.description}</p>
                </div>

                {/* Specific Visual Snippets for cards */}
                {station.id === 'station-1' && (
                  <div className="p-3 rounded-to bg-nhan-nen border border-ke flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muc font-medium">Bút bi xanh:</span>
                      <span className="text-nhan-dam font-semibold">96.4%</span>
                    </div>
                    <div className="w-full bg-ke h-2 rounded-full overflow-hidden">
                      <div className="bg-nhan h-full rounded-full" style={{ width: '96.4%' }}></div>
                    </div>
                  </div>
                )}

                {station.id === 'station-2' && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-vua bg-thu-nen text-thu text-sm font-semibold border border-ke">
                      🕵️ Che 50% thân bút
                    </span>
                    <span className="px-2.5 py-1 rounded-vua bg-thu-nen text-thu text-sm font-semibold border border-ke">
                      🔦 Chiếu đèn pin
                    </span>
                    <span className="px-2.5 py-1 rounded-vua bg-thu-nen text-thu text-sm font-semibold border border-ke">
                      📐 Xoay 180 độ
                    </span>
                  </div>
                )}

                {station.id === 'station-3' && (
                  <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="p-2 rounded-vua bg-nhan-nen border border-ke">
                      <span className="text-muc-mo block">Mô hình A (5 ảnh)</span>
                      <span className="text-loi font-semibold">Thua: 4/10</span>
                    </div>
                    <div className="p-2 rounded-vua bg-nhan-nen border border-ke">
                      <span className="text-muc-mo block">Mô hình B (50 ảnh)</span>
                      <span className="text-nhan-dam font-semibold">Thắng: 9/10</span>
                    </div>
                  </div>
                )}

                {station.id === 'station-4' && (
                  <div className="p-3 rounded-to bg-nhan-nen border border-ke flex items-center gap-2">
                    <span className="text-nhan-dam text-[20px]" aria-hidden="true">👁️</span>
                    <span className="text-sm font-semibold text-toi-nhat">Xem 60 ảnh huấn luyện bị lệch</span>
                  </div>
                )}

                {station.id === 'station-5' && (
                  <div className="p-3 rounded-to bg-nhan-nen border border-ke flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muc-nhat">Ngưỡng mở cửa lớp:</span>
                      <span className="font-semibold text-nhan">85%</span>
                    </div>
                    <div className="relative w-full h-3 bg-ke rounded-full flex items-center px-1">
                      <div className="w-4/5 h-2 bg-nhan rounded-full"></div>
                      <div className="w-4 h-4 rounded-full bg-white border-2 border-nhan -ml-2"></div>
                    </div>
                  </div>
                )}

                {station.id === 'station-6' && (
                  <div className="flex items-center gap-2 text-sm text-muc-nhat">
                    <span className="px-2 py-1 rounded-nho bg-ke text-nhan-dam font-semibold">Pixel Array</span>
                    <span>→</span>
                    <span className="px-2 py-1 rounded-nho bg-ke text-nhan-dam font-semibold">Feature Map</span>
                    <span>→</span>
                    <span className="px-2 py-1 rounded-nho bg-ke text-nhan-dam font-semibold">Label</span>
                  </div>
                )}
              </div>

              <div className="pt-5">
                <button
                  onClick={() => onNavigate(station.navTarget, station.subStationId)}
                  className={`min-h-[48px] w-full inline-flex items-center justify-center gap-2 px-4 rounded-to font-semibold text-base transition-all cursor-pointer ${
 station.isSpecial
 ? 'bg-thu text-white hover:bg-thu active:translate-y-0.5'
 : 'bg-nhan text-white hover:bg-nhan-dam active:translate-y-0.5'
 }`}
                  type="button"
                >
                  <span>
                    {station.id === 'station-2'
                      ? 'Bắt Đầu Thử Thách Phá Máy'
                      : station.id === 'station-3'
                      ? 'Bật Trạm Đối Đầu'
                      : station.id === 'station-4'
                      ? 'Khám Phá Thiên Lệch'
                      : station.id === 'station-5'
                      ? 'Thử Nghiệm Ngưỡng AI'
                      : station.id === 'station-6'
                      ? 'Mở 6 Thẻ Giải Mã'
                      : 'Bật Trạm 1'}
                  </span>
                  <span className="text-[18px]" aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* KHU VỰC 2: 5 TRÒ CHƠI KHÁM PHÁ AI (ARCADE STYLE) */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-nhan-dam text-sm font-semibold">
              <span className="text-[18px]" aria-hidden="true">🎮</span>
              <span>Đấu Trí Cùng Trí Tuệ Nhân Tạo</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-toi">
              5 Trò Chơi Khám Phá AI
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ke text-nhan-dam text-sm font-semibold">
            <span className="text-[18px]" aria-hidden="true">🎯</span>
            <span>Tích lũy sao & Lưu bảng kỷ lục nhóm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="flex flex-col justify-between p-5 rounded-to bg-white border border-ke hover:border-ke transition-all group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-vua bg-nhan-nen text-nhan-dam flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-[22px]" aria-hidden="true">{game.icon}</span>
                  </span>
                  <span className={` text-sm font-semibold px-2 py-0.5 rounded-nho ${game.badgeColor}`}>
                    {game.badge}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-toi">{game.title}</h4>
                <p className="text-sm text-muc-mo leading-relaxed">{game.description}</p>
                <div className="p-2 rounded-vua bg-giay border border-giay text-sm text-muc-nhat text-center">
                  {game.target}
                </div>
              </div>

              <button
                onClick={() => {
                  if (game.id === 'game-1') {
                    onNavigate('station-1-2', 'mode-2');
                  } else if (game.id === 'game-5') {
                    onNavigate('station-5-6', 'tro-choi-cua');
                  } else if (game.id === 'game-4') {
                    onNavigate('station-3-4', 'station-4');
                  } else if (game.id === 'game-3') {
                    onNavigate('station-3-4', 'station-3');
                  } else {
                    onNavigate('games', game.id);
                  }
                }}
                className="mt-4 min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 px-3 rounded-vua bg-nhan text-white font-semibold text-sm hover:bg-nhan-dam active:translate-y-0.5 transition-all cursor-pointer"
                type="button"
              >
                <span>Chơi Ngay</span>
                <span className="text-[16px]" aria-hidden="true">▶</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TIỆN ÍCH DÀNH CHO TIẾT HỌC (SPLIT VIEW: MODELS.JS INSPECTOR & CLASS ACTIONS) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Models Inspector Widget (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white rounded-to p-6 lg:p-8 border border-ke">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-nhan text-sm font-semibold">
                <span className="text-[18px]" aria-hidden="true">🗂️</span>
                <span>Kho Mô Hình Sẵn Có (models.js)</span>
              </div>
              <span className="text-sm px-2.5 py-1 rounded-nho bg-ke text-nhan-dam font-semibold">
                5 Pre-loaded + Custom URL
              </span>
            </div>

            <h3 className="text-xl font-semibold text-toi">Bộ Thư Viện Mô Hình Lớp Học</h3>
            <p className="text-base text-muc-mo leading-relaxed">
              Toàn bộ tệp weights.bin & model.json nằm trực tiếp trong bộ nhớ đệm máy tính bảng học sinh, không cần tải lại trong giờ.
            </p>

            {/* Model List Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-to bg-nhan-nen border border-ke">
                <span className="text-nhan text-[22px]" aria-hidden="true">✅</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-toi">1. Đồ vật trường học chuẩn</span>
                  <span className="text-sm text-muc-mo">Bút bi • Thước • Tẩy • Vở</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-to bg-nhan-nen border border-ke">
                <span className="text-thu text-[22px]" aria-hidden="true">⚠️</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-toi">2. Mô hình thiếu góc nhìn</span>
                  <span className="text-sm text-muc-mo">Chỉ chụp từ trên xuống (5 ảnh)</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-to bg-nhan-nen border border-ke">
                <span className="text-loi text-[22px]" aria-hidden="true">🎨</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-toi">3. Mô hình lệch màu sắc</span>
                  <span className="text-sm text-muc-mo">100% mẫu học bút xanh</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-to bg-nhan-nen border border-ke">
                <span className="text-nhan text-[22px]" aria-hidden="true">🖼️</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-toi">4. Mô hình dính rác nền</span>
                  <span className="text-sm text-muc-mo">Học luôn vân gỗ bàn học</span>
                </div>
              </div>
            </div>

            {/* External Link Input for Teacher */}
            <div className="mt-1 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muc-mo" aria-hidden="true">🔗</span>
                <input
                  value={customModelUrl}
                  onChange={(e) => setCustomModelUrl(e.target.value)}
                  className="w-full min-h-[46px] pl-10 pr-3 rounded-vua bg-giay border border-ke text-sm text-toi-nhat placeholder:text-muc-mo focus:outline-none focus:ring-2 focus:ring-nhan focus:bg-white"
                  placeholder="Dán link Teachable Machine của Giáo viên (https://teachablemachine...)"
                  type="url"
                />
              </div>
              <button
                onClick={handleLoadCustomModel}
                disabled={dangKiemTra}
                className="min-h-[46px] px-5 rounded-vua bg-ke text-nhan-dam font-semibold text-sm hover:bg-ke transition-all shrink-0 w-full sm:w-auto cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                {dangKiemTra ? 'Đang kiểm tra…' : 'Kiểm Tra Link'}
              </button>
            </div>

            {loadedModelMsg && (
              <div
                className={`p-3 rounded-vua text-sm font-medium border ${
 loadedModelOk
 ? 'bg-dung-nen text-dung border-ke'
 : 'bg-loi-nen text-loi border-ke'
 }`}
              >
                {loadedModelMsg}
              </div>
            )}
          </div>
        </div>

        {/* Classroom Action Hub (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-nhan-nen rounded-to p-6 lg:p-8 border border-ke">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1.5 text-nhan-dam text-sm font-semibold">
              <span className="text-[18px]" aria-hidden="true">🧑‍🏫</span>
              <span>Tài Nguyên Tiết Học (22 Phút)</span>
            </div>
            <h3 className="text-xl font-semibold text-toi">Hỗ Trợ Giáo Viên & Học Sinh</h3>
            <p className="text-base text-muc-nhat leading-relaxed">
              Tải tài liệu in ấn chuẩn khung phân phối GDPT hoặc chiếu trực tiếp bảng tổng kết nhóm lên màn hình lớn lớp học.
            </p>

            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={onOpenWorksheetModal}
                className="min-h-[48px] w-full flex items-center justify-between px-4 rounded-to bg-white border border-ke text-toi-nhat font-semibold text-base hover:bg-nhan-nen transition-all cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-nhan text-[22px]" aria-hidden="true">📄</span>
                  <span>Phiếu học tập nhóm (PDF / Bản in A4)</span>
                </div>
                <span className="text-[18px] text-muc-mo" aria-hidden="true">⬇</span>
              </button>

              <button
                onClick={onOpenLeaderboardModal}
                className="min-h-[48px] w-full flex items-center justify-between px-4 rounded-to bg-white border border-ke text-toi-nhat font-semibold text-base hover:bg-nhan-nen transition-all cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-thu text-[22px]" aria-hidden="true">🏆</span>
                  <span>Bảng thành tích thám tử AI (Toàn lớp)</span>
                </div>
                <span className="text-[18px] text-muc-mo" aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-to bg-white/90 border border-ke flex items-center gap-3">
            <span className="text-nhan text-[24px]" aria-hidden="true">✅</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-toi">Khung chương trình THCS</span>
              <span className="text-sm text-muc-mo">Tương thích hoàn toàn Quyết định 2422/QĐ-BGDĐT</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
