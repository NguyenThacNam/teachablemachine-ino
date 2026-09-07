import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface Station3And4Props {
  initialStation?: 'station-3' | 'station-4';
  onBack: () => void;
}

export const Station3And4: React.FC<Station3And4Props> = ({
  initialStation = 'station-3',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'station-3' | 'station-4'>(initialStation);

  // Station 3 States
  const [currentTestSample, setCurrentTestSample] = useState<number>(0);
  const [scores, setScores] = useState({ modelA: 4, modelB: 9, total: 10 });
  const [recentTrials, setRecentTrials] = useState([
    { id: 1, test: 'Bút nghiêng 45°', resA: 'Nhầm Sách (42%) ❌', resB: 'Đúng Bút (93%) ✅' },
    { id: 2, test: 'Bút ngược sáng', resA: 'Nhầm Tẩy (38%) ❌', resB: 'Đúng Bút (89%) ✅' },
    { id: 3, test: 'Bút thẳng chính diện', resA: 'Đúng Bút (78%) ✅', resB: 'Đúng Bút (97%) ✅' },
    { id: 4, test: 'Bút che ngòi', resA: 'Nhầm Sách (29%) ❌', resB: 'Đúng Bút (85%) ✅' },
  ]);

  const testSamples = [
    { name: 'Bút bi góc nghiêng 60°', trueLabel: 'Bút bi', aPred: 'Quyển sách (46%)', aCorrect: false, bPred: 'Bút bi (92%)', bCorrect: true },
    { name: 'Bút bi bị che một phần ngòi', trueLabel: 'Bút bi', aPred: 'Cục tẩy (35%)', aCorrect: false, bPred: 'Bút bi (88%)', bCorrect: true },
    { name: 'Bút bi đặt trên vở kẻ ô', trueLabel: 'Bút bi', aPred: 'Vở ghi (64%)', aCorrect: false, bPred: 'Bút bi (91%)', bCorrect: true },
    { name: 'Bút bi thẳng trên bàn trắng', trueLabel: 'Bút bi', aPred: 'Bút bi (84%)', aCorrect: true, bPred: 'Bút bi (98%)', bCorrect: true },
  ];

  const handleNextTrial = () => {
    const nextIdx = (currentTestSample + 1) % testSamples.length;
    setCurrentTestSample(nextIdx);
    const item = testSamples[nextIdx];
    
    setScores(prev => ({
      modelA: item.aCorrect ? prev.modelA + 1 : prev.modelA,
      modelB: item.bCorrect ? prev.modelB + 1 : prev.modelB,
      total: prev.total + 1
    }));

    setRecentTrials(prev => [
      {
        id: Date.now(),
        test: item.name,
        resA: item.aCorrect ? `Đúng Bút (${item.aPred}) ✅` : `Nhầm (${item.aPred}) ❌`,
        resB: `Đúng Bút (${item.bPred}) ✅`
      },
      ...prev.slice(0, 4)
    ]);
  };

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
        /* STATION 3: DUAL MODEL BENCHMARK */
        <div className="flex flex-col gap-6">
          {/* Header Description Card */}
          <div className="bg-the p-6 rounded-to border border-ke flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-nho bg-ke text-nhan-dam text-sm font-semibold">
                  YCCĐ: 6.C1.1
                </span>
                <span className="text-sm text-muc-mo font-semibold">Tuần 5 • THCS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-toi">
                Đối Đầu Trực Diện: Mô Hình 5 Ảnh vs Mô Hình 50 Ảnh
              </h2>
              <p className="text-sm sm:text-base text-muc-nhat">
                Cho hai mạng nơ-ron cùng xem một vật thể thật. Quan sát xem khi nào mô hình thiếu dữ liệu sẽ bị "sập bẫy".
              </p>
            </div>

            {/* Scoreboard Widget */}
            <div className="flex items-center gap-3 bg-nhan-nen p-3 rounded-to border border-ke shrink-0">
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-vua min-w-[75px]">
                <span className="text-sm font-semibold text-muc-mo">Mẫu A (5 ảnh)</span>
                <span className="text-xl font-bold text-loi">{scores.modelA} điểm</span>
              </div>
              <span className="font-bold text-muc-mo">vs</span>
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-vua min-w-[75px]">
                <span className="text-sm font-semibold text-muc-mo">Mẫu B (50 ảnh)</span>
                <span className="text-xl font-bold text-nhan">{scores.modelB} điểm</span>
              </div>
            </div>
          </div>

          {/* Test Sample Controller */}
          <div className="bg-the p-5 rounded-to border border-ke flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-vua bg-ke text-nhan-dam flex items-center justify-center font-semibold">
                📸
              </span>
              <div>
                <span className="text-sm font-semibold text-muc-mo">Vật thể thử nghiệm:</span>
                <h4 className="text-base font-semibold text-toi">{testSamples[currentTestSample].name}</h4>
              </div>
            </div>

            <button
              onClick={handleNextTrial}
              className="min-h-[46px] px-6 rounded-vua bg-nhan text-white font-semibold text-base hover:bg-nhan-dam active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              type="button"
            >
              <span>Chấm Lượt Tiếp Theo</span>
              <span className="text-[18px]" aria-hidden="true">▶</span>
            </button>
          </div>

          {/* Side-by-Side Dual Inference Models */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MODEL A (5 IMAGES) */}
            <div className="bg-the p-6 rounded-to border-2 border-ke flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-loi-nen text-loi text-sm font-semibold rounded-bl-xl">
                THIẾU DỮ LIỆU
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-to bg-loi-nen text-loi flex items-center justify-center font-semibold text-lg">
                    A
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-toi">Mô hình A (5 ảnh/nhãn)</h3>
                    <p className="text-sm text-muc-mo">Chỉ chụp góc thẳng đứng, không đổi phông nền</p>
                  </div>
                </div>

                {/* Inference Result */}
                <div className="p-4 rounded-to bg-loi-nen border border-loi-nen flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-muc-nhat">Dự đoán của AI:</span>
                    <span className="text-loi">
                      {testSamples[currentTestSample].aCorrect ? 'CHÍNH XÁC ✅' : 'SAI LỆCH ❌'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-toi">
                    {testSamples[currentTestSample].aPred}
                  </div>
                  <div className="w-full bg-ke h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-loi h-full rounded-full transition-all duration-500"
                      style={{ width: testSamples[currentTestSample].aCorrect ? '84%' : '46%' }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-vua bg-giay text-sm text-muc-nhat">
                  ⚠️ <strong>Nhược điểm:</strong> Gặp vật thể ở góc chụp khác với 5 ảnh mẫu, mô hình liền bị sập độ tin cậy hoặc đoán bừa sang lớp khác.
                </div>
              </div>

              <div className="text-sm text-muc-mo text-right">
                Độ chính xác tích lũy: {Math.round((scores.modelA / scores.total) * 100)}%
              </div>
            </div>

            {/* MODEL B (50 IMAGES) */}
            <div className="bg-the p-6 rounded-to border-2 border-ke-dam flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-ke text-nhan-dam text-sm font-semibold rounded-bl-xl">
                ĐA DẠNG DỮ LIỆU
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-to bg-nhan-nen text-nhan flex items-center justify-center font-semibold text-lg">
                    B
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-toi">Mô hình B (50 ảnh/nhãn)</h3>
                    <p className="text-sm text-muc-mo">Chụp nhiều góc độ, đổi bàn học & ánh sáng</p>
                  </div>
                </div>

                {/* Inference Result */}
                <div className="p-4 rounded-to bg-nhan-nen border border-ke flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-muc-nhat">Dự đoán của AI:</span>
                    <span className="text-nhan-dam">CHÍNH XÁC ✅</span>
                  </div>
                  <div className="text-2xl font-bold text-toi">
                    {testSamples[currentTestSample].bPred}
                  </div>
                  <div className="w-full bg-ke h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-nhan h-full rounded-full transition-all duration-500"
                      style={{ width: '92%' }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-vua bg-giay text-sm text-muc-nhat">
                  ✨ <strong>Ưu điểm:</strong> Nhận diện vững vàng kể cả khi bút bị nghiêng, bóng đổ hoặc đặt lẫn trên bề mặt có vân.
                </div>
              </div>

              <div className="text-sm text-muc-mo text-right">
                Độ chính xác tích lũy: {Math.round((scores.modelB / scores.total) * 100)}%
              </div>
            </div>
          </div>

          {/* Pedagogical Conclusion Box */}
          <div className="bg-nhan-nen p-6 rounded-to border border-ke flex items-start gap-4">
<span className="text-[24px] shrink-0 mt-0.5" aria-hidden="true">🎓</span>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-base font-semibold text-toi">
                Ghi nhớ thực nghiệm cho học sinh (YCCĐ 6.C1.1)
              </h4>
              <p className="text-sm sm:text-base text-muc leading-relaxed">
                Để AI "thông minh", không chỉ cần nạp <strong>nhiều</strong> ảnh, mà ảnh phải <strong>đa dạng</strong> (nhiều góc nghiêng, khoảng cách, ánh sáng khác nhau). Nếu chỉ chụp 50 bức ảnh giống hệt nhau một góc độ, máy vẫn sẽ đoán sai khi ra ngoài đời thật!
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
