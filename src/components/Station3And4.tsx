import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { CAP_SO_SANH, timMoHinh } from '../data/models';
import { useCamera } from '../hooks/useCamera';
import { useDuDoan } from '../hooks/useDuDoan';

/** Một lượt thử đã chấm: cả hai mô hình cùng đoán trên một khung hình */
interface LuotThu {
  id: number;
  nhanThat: string;
  aNhan: string;
  aTinCay: number;
  bNhan: string;
  bTinCay: number;
}

const SO_LUOT_KET_LUAN = 10;

/** Hai cột so sánh của Trạm 3 — màu và lời mô tả cố định */
const THE_MO_HINH = [
  { ma: 'A', thanh: 'bg-cot-5', chu: 'text-cot-5', ghiChu: 'Học ít ảnh, dễ lung lay' },
  { ma: 'B', thanh: 'bg-cot-1', chu: 'text-cot-1', ghiChu: 'Học nhiều ảnh, vững hơn' },
] as const;

interface Station3And4Props {
  initialStation?: 'station-3' | 'station-4';
  onBack: () => void;
}

export const Station3And4: React.FC<Station3And4Props> = ({
  initialStation = 'station-3',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'station-3' | 'station-4'>(initialStation);

  // ---- Trạm 3: hai mô hình thật cùng nhìn một khung hình ----
  const moHinhA = timMoHinh(CAP_SO_SANH.itAnh);
  const moHinhB = timMoHinh(CAP_SO_SANH.nhieuAnh);

  const [camBat, setCamBat] = useState(false);
  const [camTruoc, setCamTruoc] = useState(false);
  const [nhanThat, setNhanThat] = useState('');
  const [luotThu, setLuotThu] = useState<LuotThu[]>([]);

  const { videoRef, loi: loiCamera } = useCamera(camBat, camTruoc, () => setCamBat(false));

  // Hai hook độc lập, cùng đọc một thẻ <video>. Để 5 khung/giây mỗi bên vì máy
  // tính bảng phải chạy hai mô hình cùng lúc.
  const A = useDuDoan(moHinhA?.nguon ?? null, videoRef, { dangChay: camBat, lat: camTruoc, fps: 5 });
  const B = useDuDoan(moHinhB?.nguon ?? null, videoRef, { dangChay: camBat, lat: camTruoc, fps: 5 });

  const nhanChung = A.labels.length > 0 ? A.labels : B.labels;

  const diem = useMemo(() => {
    const a = luotThu.filter((l) => l.aNhan === l.nhanThat).length;
    const b = luotThu.filter((l) => l.bNhan === l.nhanThat).length;
    return { a, b, tong: luotThu.length };
  }, [luotThu]);

  const chamMotLuot = () => {
    if (!A.nhanCaoNhat || !B.nhanCaoNhat || !nhanThat) return;
    setLuotThu((prev) => [
      {
        id: Date.now(),
        nhanThat,
        aNhan: A.nhanCaoNhat!.label,
        aTinCay: A.nhanCaoNhat!.probability,
        bNhan: B.nhanCaoNhat!.label,
        bTinCay: B.nhanCaoNhat!.probability,
      },
      ...prev,
    ]);
  };

  const phanTram = (p: number) => (p * 100).toFixed(1);
  const tiLe = (dung: number) => (diem.tong === 0 ? 0 : Math.round((dung / diem.tong) * 100));

  // Station 4 States (Bias)
  const [selectedPenColor, setSelectedPenColor] = useState<'blue' | 'red' | 'yellow'>('blue');
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [isBiasFixed, setIsBiasFixed] = useState(false);

  const handleFixBias = () => {
    setIsBiasFixed(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-to bg-white border border-ke text-nhan-dam hover:bg-nhan hover:text-white font-semibold text-sm sm:text-base transition-all cursor-pointer"
          type="button"
        >
          <span>← Quay lại Trang Chủ</span>
        </button>

        {/* Station switcher tabs */}
        <div className="inline-flex p-1.5 rounded-to bg-giay gap-1">
          <button
            onClick={() => setActiveTab('station-3')}
            className={`min-h-[44px] px-4 py-1.5 rounded-vua text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
 activeTab === 'station-3'
 ? 'bg-nhan text-white'
 : 'text-muc-nhat hover:text-toi'
 }`}
            type="button"
          >
            <span className="text-[18px]" aria-hidden="true">⇄</span>
            <span>Trạm 03: So Sánh Hai Mô Hình</span>
          </button>

          <button
            onClick={() => setActiveTab('station-4')}
            className={`min-h-[44px] px-4 py-1.5 rounded-vua text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
 activeTab === 'station-4'
 ? 'bg-nhan text-white'
 : 'text-muc-nhat hover:text-toi'
 }`}
            type="button"
          >
            <span className="text-[18px]" aria-hidden="true">⚖️</span>
            <span>Trạm 04: Phòng Thiên Lệch (Bias)</span>
          </button>
        </div>
      </div>

      {activeTab === 'station-3' ? (
        /* TRẠM 3 — HAI MÔ HÌNH THẬT, MỘT KHUNG HÌNH */
        <div className="flex flex-col gap-6">
          <div className="the p-6 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">YCCĐ 6.C1.1</span>
              <span className="chip">Tuần 5</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-muc">
              Đối đầu: mô hình 5 ảnh và mô hình 50 ảnh
            </h2>
            <p className="text-base text-muc-nhat">
              Hai mô hình cùng học ba nhãn giống hệt nhau, chỉ khác số ảnh đã xem. Cùng một khung
              hình camera, cùng một lúc — xem bên nào đoán vững hơn.
            </p>
          </div>

          {(A.trangThai === 'loi' || B.trangThai === 'loi') && (
            <div className="p-4 rounded-vua bg-loi-nen border border-loi text-loi text-base">
              ⚠️ {A.loi ?? B.loi}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Camera dùng chung cho cả hai mô hình */}
            <section className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative w-full aspect-[4/3] rounded-to bg-toi overflow-hidden border border-toi-nhat flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${
                    camTruoc ? 'scale-x-[-1]' : ''
                  } ${camBat ? '' : 'hidden'}`}
                />
                {!camBat && (
                  <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
                    <span className="text-[48px]" aria-hidden="true">📷</span>
                    <p className="text-base text-toi-chu">Bật camera để hai mô hình cùng nhìn</p>
                    {loiCamera && <p className="text-sm text-toi-chu opacity-80">{loiCamera}</p>}
                  </div>
                )}
                {camBat && (
                  <div className="relative z-10 h-[78%] aspect-square border border-toi-chu/70 pointer-events-none" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setCamBat((v) => !v)}
                  className={`nut ${camBat ? '' : 'nut-chinh'}`}
                  type="button"
                >
                  {camBat ? '⏹ Dừng camera' : '📹 Bật camera'}
                </button>
                <button
                  onClick={() => setCamTruoc((v) => !v)}
                  disabled={!camBat}
                  className="nut"
                  type="button"
                >
                  🔄 {camTruoc ? 'Camera trước' : 'Camera sau'}
                </button>
              </div>

              <div className="the p-5 flex flex-col gap-3">
                <span className="text-base font-semibold text-muc">Vật thật em đang cầm là:</span>
                <div className="flex flex-wrap gap-2">
                  {nhanChung.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNhanThat(n)}
                      className={`nut ${nhanThat === n ? 'nut-dang-chon' : ''}`}
                      type="button"
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  onClick={chamMotLuot}
                  disabled={!camBat || !nhanThat || !A.nhanCaoNhat || !B.nhanCaoNhat}
                  className="nut nut-chinh"
                  type="button"
                >
                  ✍️ Chấm lượt thử này
                </button>
                {luotThu.length > 0 && (
                  <button onClick={() => setLuotThu([])} className="nut" type="button">
                    Xoá bảng đếm
                  </button>
                )}
              </div>
            </section>

            {/* Hai mô hình chạy song song */}
            <section className="lg:col-span-7 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THE_MO_HINH.map((cot) => {
                  const kq = cot.ma === 'A' ? A : B;
                  const mh = cot.ma === 'A' ? moHinhA : moHinhB;
                  return (
                    <div key={cot.ma} className="the p-5 flex flex-col gap-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-lg font-semibold text-muc">
                          Mô hình {cot.ma}
                          <span className="so text-sm text-muc-mo ml-2">
                            {mh?.soAnhMoiNhan} ảnh/nhãn
                          </span>
                        </h3>
                        {kq.trangThai === 'dang-nap' && (
                          <span className="text-sm text-muc-mo">⏳ đang nạp…</span>
                        )}
                      </div>
                      <p className="text-sm text-muc-mo">{cot.ghiChu}</p>

                      {kq.nhanCaoNhat ? (
                        <>
                          <div className="o-trong p-4 flex flex-col gap-0.5">
                            <span className="text-sm text-muc-nhat">Máy đang nói:</span>
                            <span className="text-2xl font-bold text-muc">
                              {kq.nhanCaoNhat.label}
                            </span>
                            <span className={`so text-lg ${cot.chu}`}>
                              {phanTram(kq.nhanCaoNhat.probability)}%
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            {kq.duDoan.map((d) => (
                              <div key={d.label} className="flex flex-col gap-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muc-nhat">{d.label}</span>
                                  <span className="so text-muc-nhat">
                                    {phanTram(d.probability)}%
                                  </span>
                                </div>
                                <div className="w-full h-2.5 bg-giay rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${cot.thanh} rounded-full transition-all duration-200`}
                                    style={{ width: `${d.probability * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-base text-muc-mo py-6 text-center">
                          {kq.trangThai === 'dang-nap' ? 'Đang chuẩn bị mô hình…' : 'Chờ camera…'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bảng đếm đúng/sai — số thật, không dựng sẵn */}
              <div className="the p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-muc">Bảng đếm</h3>
                  <span className="so text-sm text-muc-mo">
                    {diem.tong}/{SO_LUOT_KET_LUAN} lượt
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="o-trong p-4 flex flex-col items-center">
                    <span className="text-sm text-muc-nhat">Mô hình A · 5 ảnh</span>
                    <span className="so text-3xl font-bold text-cot-5">
                      {diem.a}/{diem.tong}
                    </span>
                    <span className="so text-sm text-muc-mo">{tiLe(diem.a)}% đúng</span>
                  </div>
                  <div className="o-trong p-4 flex flex-col items-center">
                    <span className="text-sm text-muc-nhat">Mô hình B · 50 ảnh</span>
                    <span className="so text-3xl font-bold text-cot-1">
                      {diem.b}/{diem.tong}
                    </span>
                    <span className="so text-sm text-muc-mo">{tiLe(diem.b)}% đúng</span>
                  </div>
                </div>

                {luotThu.length > 0 && (
                  <ul className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
                    {luotThu.map((l, i) => (
                      <li
                        key={l.id}
                        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm border-b border-ke pb-1.5"
                      >
                        <span className="so text-muc-mo">#{luotThu.length - i}</span>
                        <span className="text-muc-nhat">
                          thật: <strong>{l.nhanThat}</strong>
                        </span>
                        <span className={l.aNhan === l.nhanThat ? 'text-dung' : 'text-loi'}>
                          A: {l.aNhan} ({phanTram(l.aTinCay)}%){' '}
                          {l.aNhan === l.nhanThat ? '✅' : '❌'}
                        </span>
                        <span className={l.bNhan === l.nhanThat ? 'text-dung' : 'text-loi'}>
                          B: {l.bNhan} ({phanTram(l.bTinCay)}%){' '}
                          {l.bNhan === l.nhanThat ? '✅' : '❌'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {diem.tong >= SO_LUOT_KET_LUAN && (
                  <div className="p-4 rounded-vua bg-nhan-nen border border-ke flex flex-col gap-1.5">
                    <strong className="text-base text-muc">
                      Sau {diem.tong} lượt: A đúng {tiLe(diem.a)}%, B đúng {tiLe(diem.b)}%.
                    </strong>
                    <p className="text-base text-muc-nhat">
                      {diem.b > diem.a
                        ? 'Mô hình học nhiều ảnh đoán đúng nhiều hơn. Cùng một thuật toán, chỉ khác dữ liệu — dữ liệu chính là thứ tạo ra khác biệt.'
                        : diem.b === diem.a
                          ? 'Hai bên hoà. Thử thêm những góc khó: nghiêng vật, che một phần, đổi nền — chỗ đó mô hình ít ảnh mới lộ ra.'
                          : 'Lần này mô hình ít ảnh lại thắng. Ghi lại các lượt và cùng bàn xem vì sao — kết quả bất ngờ cũng là dữ liệu.'}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="the p-5 flex items-start gap-3">
            <span className="text-[24px] shrink-0" aria-hidden="true">🎓</span>
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-semibold text-muc">Ghi nhớ (YCCĐ 6.C1.1)</h4>
              <p className="text-base text-muc-nhat leading-relaxed">
                Hai mô hình dùng cùng một thuật toán. Thứ duy nhất khác nhau là{' '}
                <strong>dữ liệu đã học</strong>. Muốn máy giỏi thì ảnh phải vừa nhiều vừa{' '}
                <strong>đa dạng</strong> — 50 tấm chụp giống hệt một góc cũng không hơn 5 tấm là bao.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* STATION 4: BIAS DETECTOR ROOM */
        <div className="flex flex-col gap-6">
          {/* Header Banner */}
          <div className="bg-the p-6 rounded-to border border-ke flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-nho bg-thu-nen text-thu text-sm font-semibold">
                  YCCĐ: 7.C4.MR1
                </span>
                <span className="text-sm text-muc-mo font-semibold">Đạo đức & Thiên lệch AI</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-toi">
                Vụ Án Thiên Lệch: Tại Sao AI Không Nhận Ra Bút Đỏ?
              </h2>
              <p className="text-sm sm:text-base text-muc-nhat">
                Hãy đưa các màu bút khác nhau vào trước camera để tìm ra lỗ hổng định kiến của mô hình.
              </p>
            </div>

            <button
              onClick={() => setIsDatasetModalOpen(true)}
              className="min-h-[46px] px-4 rounded-vua bg-ke text-nhan-dam font-semibold text-sm sm:text-base hover:bg-ke transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              type="button"
            >
              <span className="text-[18px]" aria-hidden="true">📂</span>
              <span>🔍 Mở Kho 50 Ảnh Huấn Luyện Thật</span>
            </button>
          </div>

          {/* Test Color Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-to border border-ke flex flex-col gap-5">
              <h3 className="text-base font-semibold text-toi">1. Chọn vật phẩm đưa vào kiểm tra:</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedPenColor('blue')}
                  className={`min-h-[70px] p-3 rounded-to flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
 selectedPenColor === 'blue'
 ? 'bg-nhan-nen border-nhan ring-2 ring-nhan'
 : 'bg-giay border-ke hover:bg-giay'
 }`}
                  type="button"
                >
                  <span className="w-5 h-5 rounded-full bg-nhan"></span>
                  <span className="text-sm font-semibold text-toi-nhat">Bút Bi Xanh</span>
                </button>

                <button
                  onClick={() => setSelectedPenColor('red')}
                  className={`min-h-[70px] p-3 rounded-to flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
 selectedPenColor === 'red'
 ? 'bg-loi-nen border-loi ring-2 ring-loi'
 : 'bg-giay border-ke hover:bg-giay'
 }`}
                  type="button"
                >
                  <span className="w-5 h-5 rounded-full bg-loi"></span>
                  <span className="text-sm font-semibold text-toi-nhat">Bút Bi Đỏ</span>
                </button>

                <button
                  onClick={() => setSelectedPenColor('yellow')}
                  className={`min-h-[70px] p-3 rounded-to flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
 selectedPenColor === 'yellow'
 ? 'bg-thu-nen border-thu ring-2 ring-thu'
 : 'bg-giay border-ke hover:bg-giay'
 }`}
                  type="button"
                >
                  <span className="w-5 h-5 rounded-full bg-thu"></span>
                  <span className="text-sm font-semibold text-toi-nhat">Bút Dạ Vàng</span>
                </button>
              </div>

              {/* Status explanation */}
              <div className="p-4 rounded-to bg-nhan-nen text-sm text-muc-nhat flex items-start gap-2.5">
                <span className="text-nhan text-[18px] shrink-0" aria-hidden="true">ℹ️</span>
                <span>
                  {selectedPenColor === 'blue'
                    ? 'Bút bi xanh là nhãn chuẩn mà mô hình đã học. Hãy thử bấm chọn Bút Bi Đỏ xem điều gì sẽ xảy ra!'
                    : isBiasFixed
                    ? 'Tuyệt vời! Sau khi sửa thiên lệch dữ liệu, mô hình đã nhận diện chính xác mọi màu bút!'
                    : 'Phát hiện bất thường! AI không được dạy bút màu này nên độ tin cậy rớt thảm hại!'}
                </span>
              </div>
            </div>

            {/* Inference Card Display */}
            <div className="lg:col-span-7 bg-white p-6 rounded-to border border-ke flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-toi">2. Kết quả phán đoán của AI:</h3>
                  <span className="text-sm px-2 py-0.5 rounded bg-giay text-muc-nhat">
                    Confidence Meter
                  </span>
                </div>

                {selectedPenColor === 'blue' ? (
                  <div className="p-5 rounded-to bg-nhan-nen border border-ke flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-nhan uppercase">Chẩn đoán:</span>
                      <div className="text-2xl font-bold text-nhan-dam">Bút bi viết bài</div>
                      <span className="text-sm text-muc-nhat">Độ chắc chắn: 98.4% (Rất chuẩn xác)</span>
                    </div>
                    <span className="text-nhan text-[36px]" aria-hidden="true">✅</span>
                  </div>
                ) : isBiasFixed ? (
                  <div className="p-5 rounded-to bg-dung-nen border border-ke flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-dung uppercase">Sau khi sửa thiên lệch:</span>
                      <div className="text-2xl font-bold text-dung">Bút bi ({selectedPenColor === 'red' ? 'Đỏ' : 'Vàng'})</div>
                      <span className="text-sm text-muc-nhat">Độ chắc chắn: 94.7% (Đã học đầy đủ các màu)</span>
                    </div>
                    <span className="text-dung text-[36px]" aria-hidden="true">✅</span>
                  </div>
                ) : (
                  <div className="p-5 rounded-to bg-loi-nen border border-ke flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-loi uppercase">Bị sập bẫy thiên lệch:</span>
                      <div className="text-2xl font-bold text-loi">Không xác định / Bút dạ màu lạ</div>
                      <span className="text-sm text-loi font-semibold">Độ chắc chắn chỉ đạt: 14.2% ❌</span>
                    </div>
                    <span className="text-loi text-[36px]" aria-hidden="true">⚠️</span>
                  </div>
                )}
              </div>

              {/* Fix Bias Action */}
              {!isBiasFixed ? (
                <div className="p-4 rounded-to bg-thu-nen border border-ke flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-thu text-sm font-semibold">
                    <span className="text-[20px]" aria-hidden="true">🔧</span>
                    <span>Em có muốn giải cứu mô hình bằng cách bổ sung dữ liệu cân bằng?</span>
                  </div>
                  <button
                    onClick={handleFixBias}
                    className="min-h-[44px] px-5 rounded-vua bg-thu text-white font-semibold text-sm hover:bg-thu transition-all shrink-0 cursor-pointer"
                    type="button"
                  >
                    Sửa Thiên Lệch (Thêm Bút Đỏ & Vàng)
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-to bg-dung-nen text-dung text-sm font-semibold flex items-center gap-2 border border-ke">
                  <span className="text-dung text-[20px]" aria-hidden="true">✅</span>
                  <span>Đã cân bằng thành công tập dữ liệu huấn luyện: 33% Bút Xanh + 33% Bút Đỏ + 34% Bút Vàng!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW DATASET INSPECTOR */}
      {isDatasetModalOpen && (
        <div className="fixed inset-0 z-50 bg-toi flex items-center justify-center p-4">
          <div className="bg-the w-full max-w-2xl rounded-to p-6 flex flex-col gap-4 border border-ke max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-nhan text-[24px]" aria-hidden="true">📁</span>
                <h3 className="text-lg font-semibold text-toi">Kho 50 Hình Ảnh Huấn Luyện Gốc</h3>
              </div>
              <button
                onClick={() => setIsDatasetModalOpen(false)}
                className="w-8 h-8 rounded-full bg-giay text-muc-nhat hover:bg-ke flex items-center justify-center font-semibold text-base cursor-pointer"
                type="button"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muc-nhat">
              Quan sát kỹ 50 bức ảnh trong tập dữ liệu của lớp học dưới đây. Em có nhận ra điều bất thường gì không?
            </p>

            {/* Visual 50 Grid representation */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-giay rounded-to border">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-nho flex items-center justify-center text-sm font-semibold ${
 isBiasFixed && i >= 25
 ? i % 2 === 0
 ? 'bg-loi-nen text-loi border border-ke-dam'
 : 'bg-thu-nen text-thu border border-ke-dam'
 : 'bg-ke text-nhan-dam border border-ke-dam'
 }`}
                >
                  {isBiasFixed && i >= 25 ? (i % 2 === 0 ? '🔴' : '🟡') : '🔵'}
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-vua bg-loi-nen text-loi text-sm font-medium border border-ke leading-relaxed">
              🔍 <strong>Phát hiện của thám tử nhí:</strong> Cả 50 bức ảnh đều là <strong>Bút bi màu xanh</strong>! Mô hình không học hình dáng cây bút, mà học mảng màu xanh dương. Vì thế khi gặp bút bi màu đỏ, AI tưởng là một vật hoàn toàn khác!
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDatasetModalOpen(false)}
                className="min-h-[44px] px-5 rounded-vua bg-nhan text-white font-semibold text-sm hover:bg-nhan-dam cursor-pointer"
                type="button"
              >
                Đã Hiểu & Đóng Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
