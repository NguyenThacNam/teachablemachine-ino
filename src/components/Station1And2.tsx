import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { MO_HINH } from '../data/models';
import { useCamera } from '../hooks/useCamera';
import { useDuDoan } from '../hooks/useDuDoan';
import { ChonMoHinh } from './ChonMoHinh';

interface Station1And2Props {
  initialMode?: 'mode-1' | 'mode-2';
  /** Mô hình đang chọn, giữ ở App để không mất khi chuyển trạm */
  modelId: string;
  onChangeModel: (id: string) => void;
  onBack: () => void;
}

/** Mô hình phải tự tin trên mức này thì mới tính là "đã lừa được AI" */
const NGUONG_LUA = 0.7;

/** Màu cho từng thanh phần trăm, lặp lại nếu mô hình có nhiều nhãn hơn */
const MAU_NHAN = [
  { thanh: 'bg-cot-1', chu: 'text-cot-1' },
  { thanh: 'bg-cot-2', chu: 'text-cot-2' },
  { thanh: 'bg-cot-3', chu: 'text-cot-3' },
  { thanh: 'bg-cot-4', chu: 'text-cot-4' },
  { thanh: 'bg-cot-5', chu: 'text-cot-5' },
];

const GOI_Y_PHA = [
  { id: 'che', nhan: '🤏 Che một phần vật' },
  { id: 'nghieng', nhan: '📐 Đặt nghiêng 45°' },
  { id: 'den', nhan: '💡 Tạo bóng đổ' },
  { id: 'nen', nhan: '🎨 Đổi nền phía sau' },
];

interface GhiChepPha {
  id: number;
  title: string;
  reason: string;
  conf: string;
  color: string;
}

export const Station1And2: React.FC<Station1And2Props> = ({
  initialMode = 'mode-1',
  modelId,
  onChangeModel,
  onBack,
}) => {
  const [activeMode, setActiveMode] = useState<'mode-1' | 'mode-2'>(initialMode);

  // Camera
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const { videoRef, loi: loiCamera } = useCamera(isCameraRunning, isFrontCamera, () =>
    setIsCameraRunning(false),
  );

  // Trạm 2 — thử thách đánh lừa
  const [nhanThat, setNhanThat] = useState<string>('');
  const [goiYDangChon, setGoiYDangChon] = useState<string | null>(null);
  const [trickHistory, setTrickHistory] = useState<GhiChepPha[]>([]);
  const [customNote, setCustomNote] = useState('');
  const nhanDaMung = useRef<string | null>(null);

  const moHinhDangChon = useMemo(
    () => MO_HINH.find((m) => m.id === modelId) ?? null,
    [modelId],
  );

  const { trangThai, loi, duDoan, nhanCaoNhat, labels } = useDuDoan(
    moHinhDangChon?.nguon ?? null,
    videoRef,
    {
      dangChay: isCameraRunning && !isFrozen,
      lat: isFrontCamera,
      fps: 8,
    },
  );

  // Phát hiện "đã lừa được AI": mô hình nói sai nhãn thật, mà lại rất tự tin
  const daLuaDuoc =
    activeMode === 'mode-2' &&
    !!nhanThat &&
    !!nhanCaoNhat &&
    nhanCaoNhat.label !== nhanThat &&
    nhanCaoNhat.probability >= NGUONG_LUA;

  useEffect(() => {
    if (!daLuaDuoc || !nhanCaoNhat) {
      if (!daLuaDuoc) nhanDaMung.current = null;
      return;
    }
    // Chỉ ăn mừng một lần cho mỗi nhãn sai, không bắn pháo giấy mỗi khung hình
    if (nhanDaMung.current === nhanCaoNhat.label) return;
    nhanDaMung.current = nhanCaoNhat.label;
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }, [daLuaDuoc, nhanCaoNhat]);

  // Nhãn thật mặc định là nhãn đầu tiên của mô hình vừa nạp
  useEffect(() => {
    if (labels.length > 0 && !labels.includes(nhanThat)) {
      setNhanThat(labels[0]);
    }
  }, [labels, nhanThat]);

  const phanTram = (p: number) => (p * 100).toFixed(1);

  const mucTinCay = (p: number) => {
    if (p >= 0.9) return 'Rất tin cậy';
    if (p >= 0.7) return 'Khá chắc';
    if (p >= 0.5) return 'Chập chờn';
    return 'Máy đang lúng túng';
  };

  const handleAddNote = () => {
    if (!customNote.trim()) return;
    setTrickHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: customNote.trim(),
        reason: 'Nhóm tự ghi nhận trên bàn thực nghiệm',
        conf: nhanCaoNhat
          ? `Máy nói: ${nhanCaoNhat.label} (${phanTram(nhanCaoNhat.probability)}%)`
          : 'Đã ghi sổ',
        color: 'text-nhan-dam bg-ke',
      },
    ]);
    setCustomNote('');
  };

  const ghiCachPhaHienTai = () => {
    if (!nhanCaoNhat) return;
    const goiY = GOI_Y_PHA.find((g) => g.id === goiYDangChon);
    setCustomNote(
      `${goiY ? goiY.nhan.replace(/^\S+\s/, '') : 'Cách của nhóm'} → máy nhầm ${nhanThat} thành ${nhanCaoNhat.label} (${phanTram(nhanCaoNhat.probability)}%)`,
    );
  };

  const dangChoMoHinh = trangThai === 'dang-nap';

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top utility sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-to bg-white border border-ke text-nhan-dam hover:bg-nhan hover:text-white font-semibold text-sm sm:text-base transition-all cursor-pointer"
          type="button"
        >
          <span>← Quay lại Trang Chủ</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-vua bg-ke text-nhan-dam text-sm font-semibold border border-ke">
            <span>🔒 Ảnh camera chỉ nằm trong máy, không gửi đi đâu</span>
          </div>
        </div>
      </div>

      {/* Main Controller Bar: Model Selector & Mode Switcher */}
      <div className="w-full bg-white p-4 sm:p-5 rounded-to border border-ke flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Model Selector */}
        <ChonMoHinh
          giaTri={modelId}
          onChange={(id) => {
            onChangeModel(id);
            setGoiYDangChon(null);
          }}
        />

        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1.5 rounded-to bg-giay gap-1 shrink-0">
          <button
            onClick={() => setActiveMode('mode-1')}
            className={`min-h-[44px] px-4 py-1.5 rounded-vua text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
 activeMode === 'mode-1'
 ? 'bg-the text-nhan-dam'
 : 'text-muc-nhat hover:text-toi'
 }`}
            type="button"
          >
            <span className="text-[18px]" aria-hidden="true">📊</span>
            <span>Chế độ 1: Thử mô hình &amp; Đo tin cậy</span>
          </button>

          <button
            onClick={() => setActiveMode('mode-2')}
            className={`min-h-[44px] px-4 py-1.5 rounded-vua text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
 activeMode === 'mode-2'
 ? 'bg-the text-thu'
 : 'text-muc-nhat hover:text-toi'
 }`}
            type="button"
          >
            <span className="text-[18px]" aria-hidden="true">⚡</span>
            <span className="flex items-center gap-1.5">
              <span>Chế độ 2: Đánh lừa AI</span>
              <span className="px-1.5 py-0.5 rounded-nho bg-thu-nen text-thu text-sm font-semibold">
                Thử thách
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Báo lỗi nạp mô hình */}
      {trangThai === 'loi' && loi && (
        <div className="w-full p-4 rounded-to bg-loi-nen border border-ke text-loi text-sm sm:text-base font-semibold flex items-start gap-2">
          <span className="text-loi text-[20px] shrink-0" aria-hidden="true">⚠️</span>
          <span>{loi}</span>
        </div>
      )}

      {/* WORKBENCH 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CAMERA WORKBENCH & HUD */}
        <section className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/3] rounded-to bg-toi overflow-hidden flex flex-col justify-between p-4 border border-toi-nhat">
            <div className="absolute inset-0 z-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''} ${
 isCameraRunning ? '' : 'hidden'
 } ${isFrozen ? 'brightness-75' : ''}`}
              />
              {!isCameraRunning && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muc-mo px-6 text-center">
                  <span className="text-[56px] text-muc-nhat" aria-hidden="true">📷</span>
                  <p className="text-base font-semibold">
                    Bấm <strong className="text-white">Bật Camera</strong> để mô hình bắt đầu nhìn
                  </p>
                  {loiCamera && (
                    <p className="text-sm text-ke-dam font-semibold max-w-xs leading-relaxed">{loiCamera}</p>
                  )}
                </div>
              )}
            </div>

            {/* Dòng trạng thái — chữ thật, không phải đồng hồ đo giả */}
            <div className="relative z-10 flex items-center justify-between w-full text-toi-chu">
              <span className="text-sm">
                {!isCameraRunning ? 'Camera đang tắt' : isFrozen ? 'Đang giữ hình' : 'Camera đang bật'}
              </span>
              {labels.length > 0 && (
                <span className="so text-sm opacity-80">{labels.length} nhãn</span>
              )}
            </div>

            {/* Ô vuông máy thật sự nhìn.
                Trước đây đây là khung ngắm trang trí, không ăn nhập gì với mô hình.
                Mô hình cắt vuông ở giữa khung hình rồi thu về 224×224 — vẽ đúng
                ô đó thì học sinh biết phải đặt vật vào đâu. */}
            {isCameraRunning && (
              <div className="relative z-10 self-center my-auto h-full aspect-square border border-toi-chu/70 pointer-events-none">
                <span className="so absolute -top-px left-0 bg-toi/85 text-toi-chu text-sm px-2 py-0.5">
                  vùng máy nhìn · 224×224
                </span>
              </div>
            )}

            {/* HUD Bottom Diagnostic */}
            <div className="relative z-10 w-full flex items-center justify-between bg-toi px-3.5 py-2 rounded-to border border-toi-nhat">
              <div className="flex items-center gap-2 text-white">
                <span
                  aria-hidden="true"
                >
                  {dangChoMoHinh ? '⏳' : '🧠'}
                </span>
                <span className="text-sm font-semibold">
                  {dangChoMoHinh
                    ? 'Đang chuẩn bị mô hình…'
                    : trangThai === 'san-sang'
                      ? 'Mô hình đã sẵn sàng'
                      : trangThai === 'loi'
                        ? 'Mô hình lỗi'
                        : 'Chưa có mô hình'}
                </span>
              </div>
              <span className="text-sm text-ke-dam">224×224</span>
            </div>
          </div>

          {/* Large Touch Controls Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                setIsCameraRunning((v) => !v);
                setIsFrozen(false);
              }}
              className={`min-h-[52px] px-3 py-2 rounded-to font-semibold text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 active:translate-y-0.5 transition-all cursor-pointer ${
 isCameraRunning
 ? 'bg-nhan text-white hover:bg-nhan-dam'
 : 'bg-thu text-white hover:bg-thu'
 }`}
              type="button"
            >
              <span aria-hidden="true">{isCameraRunning ? '⏹' : '📹'}</span>
              <span>{isCameraRunning ? 'Dừng Camera' : 'Bật Camera'}</span>
            </button>

            <button
              onClick={() => setIsFrontCamera((v) => !v)}
              disabled={!isCameraRunning}
              className="min-h-[52px] px-3 py-2 rounded-to bg-white border border-ke text-toi-nhat font-semibold text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 hover:bg-nhan-nen active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              type="button"
            >
              <span className="text-[20px]" aria-hidden="true">🔄</span>
              <span>{isFrontCamera ? 'Camera Trước' : 'Camera Sau'}</span>
            </button>

            <button
              onClick={() => setIsFrozen((v) => !v)}
              disabled={!isCameraRunning}
              className={`min-h-[52px] px-3 py-2 rounded-to font-semibold text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-1.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
 isFrozen
 ? 'bg-thu-nen text-thu border border-ke-dam ring-2 ring-thu'
 : 'bg-the border border-ke text-toi-nhat hover:bg-nhan-nen'
 }`}
              type="button"
            >
              <span className="text-[20px] text-thu" aria-hidden="true">📸</span>
              <span>{isFrozen ? 'Đang Giữ 🔒' : 'Chụp Giữ 📸'}</span>
            </button>
          </div>

          {/* Mini Lab Notebook Tip */}
          <div className="w-full bg-nhan-nen p-4 rounded-to border border-ke flex items-start gap-3">
            <div className="w-10 h-10 rounded-to bg-white border border-ke text-nhan flex items-center justify-center shrink-0">
              <span className="text-[22px]" aria-hidden="true">💡</span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <h4 className="text-sm font-semibold text-toi">
                Mẹo nhỏ cho nhà khoa học nhí:
              </h4>
              <p className="text-sm text-muc-nhat leading-relaxed">
                Máy chỉ nhìn phần vuông ở giữa khung, thu nhỏ còn{' '}
                <span className="font-semibold text-nhan-dam">224×224 px</span>. Nếu em xoay vật hoặc
                che một phần, AI sẽ nhìn nó như thế nào?
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: PREDICTION & CHALLENGE */}
        <section className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5">
          {activeMode === 'mode-1' ? (
            /* MODE 1: CONFIDENCE BENCHMARK */
            <div className="flex flex-col gap-5">
              <div className="w-full bg-white p-6 rounded-to border border-ke flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-nhan text-[24px]" aria-hidden="true">🔍</span>
                    <h3 className="text-lg font-semibold text-toi">Dự đoán AI thời gian thực</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-nhan-nen text-nhan-dam text-sm font-semibold border border-ke">
                    Softmax Distribution
                  </span>
                </div>

                {nhanCaoNhat ? (
                  <>
                    {/* Leading Class Card */}
                    <div className="w-full bg-nhan text-white p-5 rounded-to flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-vua bg-white/20 flex items-center justify-center shrink-0">
                          <span className="text-[28px] text-white" aria-hidden="true">👁️</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm uppercase opacity-80">Phát hiện số 1:</span>
                            <span className="px-2 py-0.5 rounded bg-white text-nhan-dam font-semibold text-sm">
                              {mucTinCay(nhanCaoNhat.probability)}
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold">{nhanCaoNhat.label}</h2>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end">
                        <span className="text-3xl sm:text-4xl font-bold leading-none">
                          {phanTram(nhanCaoNhat.probability)}%
                        </span>
                        <span className="text-sm opacity-80 mt-1">Độ chắc chắn (Confidence)</span>
                      </div>
                    </div>

                    {/* Bảng thanh phần trăm — dựng theo đúng nhãn của mô hình */}
                    <div className="flex flex-col gap-3 pt-1">
                      {duDoan.map((d, i) => {
                        const mau = MAU_NHAN[i % MAU_NHAN.length];
                        return (
                          <div key={d.label} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-sm sm:text-base font-semibold">
                              <span className="text-toi-nhat flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-nho ${mau.thanh}`}></span>
                                <span>{d.label}</span>
                              </span>
                              <span className={` ${mau.chu}`}>{phanTram(d.probability)}%</span>
                            </div>
                            <div className="w-full h-3 bg-giay rounded-full overflow-hidden">
                              <div
                                className={`h-full ${mau.thanh} rounded-full transition-all duration-300`}
                                style={{ width: `${d.probability * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="py-10 flex flex-col items-center text-center gap-2 text-muc-mo">
                    <span className="text-[36px]" aria-hidden="true">
                      {dangChoMoHinh ? '⏳' : '📸'}
                    </span>
                    <p className="text-base font-semibold">
                      {dangChoMoHinh
                        ? 'Đang chuẩn bị mô hình…'
                        : 'Bật camera và đưa đồ vật vào khung để xem máy đoán'}
                    </p>
                  </div>
                )}
              </div>

              {/* Concept Card */}
              <div className="w-full bg-nhan-nen p-5 rounded-to border border-ke flex flex-col gap-2">
                <div className="flex items-center gap-2 text-nhan-dam">
                  <span className="text-[22px]" aria-hidden="true">🧪</span>
                  <span className="text-sm font-semibold">
                    Khái niệm cốt lõi: Độ tin cậy (Confidence Score)
                  </span>
                </div>
                <p className="text-base text-muc leading-relaxed">
                  Máy tính không thực sự "hiểu" đồ vật như con người. Nó chỉ tính xác suất dựa trên những ảnh đã được
                  cho xem. Em thử đưa một vật <strong>không có trong danh sách nhãn</strong> vào khung xem máy nói gì —
                  nó vẫn buộc phải chọn một nhãn, dù chẳng nhãn nào đúng.
                </p>
              </div>
            </div>
          ) : (
            /* MODE 2: TRICK THE AI CHALLENGE */
            <div className="flex flex-col gap-5">
              <div className="w-full bg-thu text-white p-5 rounded-to flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[26px]" aria-hidden="true">🎯</span>
                    <span className="text-sm font-semibold">Nhiệm Vụ Đánh Lừa AI</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-thu text-sm font-semibold">
                    Đã tìm được: {trickHistory.length} cách
                  </span>
                </div>

                <div className="bg-white/15 p-4 rounded-to border border-white/20 flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold opacity-90">Vật thật em đang cầm là:</span>
                    <div className="flex flex-wrap gap-2">
                      {labels.map((l) => (
                        <button
                          key={l}
                          onClick={() => setNhanThat(l)}
                          className={`min-h-[44px] px-4 rounded-vua text-sm font-semibold transition-all cursor-pointer ${
 nhanThat === l
 ? 'bg-the text-thu ring-2 ring-white'
 : 'bg-white/25 text-white hover:bg-white/40'
 }`}
                          type="button"
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed">
                    🎯 Giữ vật trong khung ngắm, đừng cất đi. Hãy làm cách nào đó để máy nói ra một cái tên{' '}
                    <strong>khác</strong> với trên {Math.round(NGUONG_LUA * 100)}% độ tin cậy.
                  </p>
                </div>

                {/* Gợi ý cách phá — chỉ là gợi ý thao tác, không tác động vào mô hình */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold opacity-90">Gợi ý các "chiêu thức" để em thử:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GOI_Y_PHA.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGoiYDangChon(goiYDangChon === g.id ? null : g.id)}
                        className={`min-h-[44px] px-3 py-2 rounded-vua text-sm font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
 goiYDangChon === g.id
 ? 'bg-thu-nen text-thu ring-2 ring-white'
 : 'bg-the text-toi-nhat hover:bg-thu-nen'
 }`}
                        type="button"
                      >
                        <span>{g.nhan}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trạng thái thử thách theo dự đoán thật */}
              {!isCameraRunning ? (
                <div className="w-full bg-giay text-muc-nhat p-5 rounded-to border border-ke text-base font-semibold flex items-center gap-2">
                  <span className="text-[22px]" aria-hidden="true">📹</span>
                  <span>Bật camera để bắt đầu thử thách.</span>
                </div>
              ) : daLuaDuoc && nhanCaoNhat ? (
                <div className="w-full bg-ke text-nhan-dam p-5 rounded-to border border-ke flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-to bg-nhan text-white flex items-center justify-center shrink-0 animate-bounce">
                      <span className="text-[28px]" aria-hidden="true">🤖</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-nhan-dam">🎉 XUẤT SẮC! AI ĐÃ BỊ LỪA!</span>
                      <p className="text-sm text-nhan-dam">
                        Máy nhận diện:{' '}
                        <strong className="text-nhan-dam">
                          {nhanCaoNhat.label} ({phanTram(nhanCaoNhat.probability)}%)
                        </strong>{' '}
                        dù vật thật là <strong className="text-toi">{nhanThat}</strong>!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={ghiCachPhaHienTai}
                    className="min-h-[42px] px-4 py-2 rounded-vua bg-nhan-dam text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-nhan-dam transition-all shrink-0 cursor-pointer"
                    type="button"
                  >
                    <span className="text-[18px]" aria-hidden="true">💾</span>
                    <span>Ghi cách phá vào phiếu nhóm</span>
                  </button>
                </div>
              ) : (
                <div className="w-full bg-white p-5 rounded-to border border-ke flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-to bg-nhan-nen text-nhan flex items-center justify-center shrink-0">
                      <span className="text-[26px]" aria-hidden="true">📡</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-semibold text-toi">Máy vẫn chưa bị lừa — thử tiếp!</span>
                      <p className="text-sm text-muc-nhat truncate">
                        {nhanCaoNhat
                          ? `Máy đang nói: ${nhanCaoNhat.label} (${phanTram(nhanCaoNhat.probability)}%)`
                          : 'Đưa vật vào khung ngắm…'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Team History Log Card */}
              <div className="w-full bg-white p-6 rounded-to border border-ke flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-toi flex items-center gap-2">
                    <span className="text-nhan text-[22px]" aria-hidden="true">📔</span>
                    <span>Nhật ký "Đánh lừa AI" của Nhóm:</span>
                  </h4>
                  <span className="px-2.5 py-1 rounded-nho bg-nhan-nen text-nhan-dam text-sm font-semibold border border-ke">
                    {trickHistory.length} Cách tìm thấy
                  </span>
                </div>

                {trickHistory.length === 0 && (
                  <p className="text-sm text-muc-mo italic">
                    Chưa có ghi chép nào. Khi lừa được máy, bấm "Ghi cách phá vào phiếu nhóm" rồi bấm Lưu.
                  </p>
                )}

                <div className="flex flex-col gap-2.5">
                  {trickHistory.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-to bg-nhan-nen border border-ke flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-nhan text-white text-sm font-semibold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-sm sm:text-base font-semibold text-toi">{item.title}</div>
                          <div className="text-sm text-muc-mo">{item.reason}</div>
                        </div>
                      </div>
                      <span
                        className={` text-sm px-2.5 py-1 rounded-nho font-semibold shrink-0 self-start sm:self-auto ${item.color}`}
                      >
                        {item.conf}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Add Note Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    className="flex-1 min-h-[44px] px-4 rounded-vua bg-giay border border-ke text-toi text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-nhan focus:bg-white"
                    placeholder="Nhập nhanh phát hiện mới của nhóm..."
                    type="text"
                  />
                  <button
                    onClick={handleAddNote}
                    className="min-h-[44px] px-4 rounded-vua bg-nhan text-white font-semibold text-sm flex items-center gap-1.5 shrink-0 hover:bg-nhan-dam cursor-pointer"
                    type="button"
                  >
                    <span className="text-[18px]" aria-hidden="true">＋</span>
                    <span className="hidden sm:inline">Lưu Ghi Chú</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
