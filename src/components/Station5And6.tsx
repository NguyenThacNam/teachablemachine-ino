import React, { useState } from 'react';
import { FLASHCARDS } from '../data/flashcards';
import { Visitor, GameLogEntry } from '../types';
import confetti from 'canvas-confetti';

interface Station5And6Props {
  initialSubStation?: 'tram-5' | 'tro-choi-cua' | 'tram-6';
  onBack: () => void;
}

export const Station5And6: React.FC<Station5And6Props> = ({
  initialSubStation = 'tram-5',
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'tram-5' | 'tro-choi-cua' | 'tram-6'>(initialSubStation);

  // Station 5 States
  const [threshold, setThreshold] = useState<number>(80);
  const [scenario, setScenario] = useState<'vault' | 'library'>('vault');
  const [sampleConfidence, setSampleConfidence] = useState<number>(84);

  // Gatekeeper Game States
  const [gameThreshold, setGameThreshold] = useState<number>(75);
  const [doorStatus, setDoorStatus] = useState<'locked' | 'opened'>('locked');
  const [isSimulating, setIsSimulating] = useState(false);
  const [gameLogs, setGameLogs] = useState<GameLogEntry[]>([
    {
      id: '1',
      emoji: '🧒',
      name: 'Bạn An (Lớp 6A)',
      prob: 88,
      decision: 'opened',
      statusType: 'valid',
      text: 'Mở cửa đúng bạn',
      badgeText: 'Thành công',
      badgeColor: 'bg-dung-nen text-dung'
    },
    {
      id: '2',
      emoji: '🥷',
      name: 'Người lạ trùm kín mặt',
      prob: 42,
      decision: 'locked',
      statusType: 'safe',
      text: 'Chặn thành công kẻ gian',
      badgeText: 'An toàn',
      badgeColor: 'bg-ke text-nhan-dam'
    },
    {
      id: '3',
      emoji: '👧',
      name: 'Bạn Mai (Đeo khẩu trang)',
      prob: 68,
      decision: 'locked',
      statusType: 'inconvenient',
      text: 'Bị khóa oan ngoài cửa vì đeo khẩu trang',
      badgeText: 'Bất tiện',
      badgeColor: 'bg-thu-nen text-thu'
    }
  ]);
  const [safetyScore, setSafetyScore] = useState<number>(95);
  const [convenienceScore, setConvenienceScore] = useState<number>(70);

  // Station 6 States (Flashcards)
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setGameLogs([]);

    const visitors: Visitor[] = [
      { id: 1, type: 'friend', name: 'Bạn Nam (Lớp 6B)', emoji: '👦', matchProb: 92 },
      { id: 2, type: 'stranger', name: 'Kẻ lạ mặt', emoji: '🥷', matchProb: 38 },
      { id: 3, type: 'friend_masked', name: 'Bạn Linh (Đeo khẩu trang)', emoji: '👧', matchProb: 72 },
      { id: 4, type: 'friend_glasses', name: 'Bạn Tuấn (Đeo kính cận)', emoji: '👓', matchProb: 84 },
      { id: 5, type: 'stranger', name: 'Kẻ giả danh cầm ảnh', emoji: '🎭', matchProb: 65 },
      { id: 6, type: 'friend_hat', name: 'Bạn Hoa (Đội mũ rộng vành)', emoji: '👒', matchProb: 74 },
      { id: 7, type: 'friend', name: 'Bạn Minh (Lớp trưởng)', emoji: '🧑', matchProb: 95 },
    ];

    let safeBlocks = 0;
    let totalStrangers = 2;
    let friendEntries = 0;
    let totalFriends = 5;

    visitors.forEach((v, index) => {
      setTimeout(() => {
        const opens = v.matchProb >= gameThreshold;
        setDoorStatus(opens ? 'opened' : 'locked');

        let statusType:'valid' | 'danger' | 'inconvenient' | 'safe' = 'valid';
        let badgeText = '';
        let badgeColor = '';
        let text = '';

        if (v.type === 'stranger') {
          if (opens) {
            statusType = 'danger';
            badgeText = 'NGUY HIỂM!';
            badgeColor = 'bg-loi-nen text-loi border border-ke-dam';
            text = 'Kẻ lạ lọt vào phòng!';
          } else {
            statusType = 'safe';
            badgeText = 'An toàn';
            badgeColor = 'bg-ke text-nhan-dam';
            text = 'Cửa khóa chặt chặn kẻ lạ';
            safeBlocks++;
          }
        } else {
          if (opens) {
            statusType = 'valid';
            badgeText = 'Hợp lệ';
            badgeColor = 'bg-dung-nen text-dung';
            text = 'Bạn vào lớp thuận lợi';
            friendEntries++;
          } else {
            statusType = 'inconvenient';
            badgeText = 'Bị kẹt';
            badgeColor = 'bg-thu-nen text-thu';
            text = 'Học sinh quen bị AI chặn vì dưới ngưỡng!';
          }
        }

        setGameLogs(prev => [
          {
            id: String(Date.now() + index),
            emoji: v.emoji,
            name: v.name,
            prob: v.matchProb,
            decision: opens ? 'opened' : 'locked',
            statusType,
            text,
            badgeText,
            badgeColor
          },
          ...prev
        ]);

        if (index === visitors.length - 1) {
          setIsSimulating(false);
          const computedSafety = Math.round((safeBlocks / totalStrangers) * 100);
          const computedConvenience = Math.round((friendEntries / totalFriends) * 100);
          setSafetyScore(computedSafety);
          setConvenienceScore(computedConvenience);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }, (index + 1) * 600);
    });
  };

  const card = FLASHCARDS[currentCardIndex];

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-to bg-white border border-ke text-nhan-dam hover:bg-nhan hover:text-white font-semibold text-sm sm:text-base transition-all cursor-pointer"
          type="button"
        >
          <span>← Quay lại Trang Chủ</span>
        </button>

        {/* Tab Switcher */}
        <div className="inline-flex p-1.5 rounded-to bg-giay gap-1 flex-wrap">
          <button
            onClick={() => setActiveTab('tram-5')}
            className={`min-h-[44px] px-4 py-1.5 rounded-vua text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
 activeTab === 'tram-5'
 ? 'bg-nhan text-white'
 : 'text-muc-nhat hover:text-toi'
 }`}
            type="button"
          >
            <span className="text-[18px]" aria-hidden="true">🎚️</span>
            <span>Trạm 05: Ngưỡng Tin Cậy</span>
          </button>

          <button
            onClick={() => setActiveTab('tro-choi-cua')}
            className={`min-h-[44px] px-4 py-1.5 rounded-vua text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
 activeTab === 'tro-choi-cua'
 ? 'bg-nhan text-white'
 : 'text-muc-nhat hover:text-toi'
 }`}
            type="button"
          >
            <span className="text-[18px]" aria-hidden="true">🔒</span>
            <span className="flex items-center gap-1.5">
              <span>Trò Chơi Khóa Cửa</span>
              <span className="px-1.5 py-0.5 rounded bg-ke text-thu text-sm font-semibold">
                Game
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tram-6')}
            className={`min-h-[44px] px-4 py-1.5 rounded-vua text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
 activeTab === 'tram-6'
 ? 'bg-nhan text-white'
 : 'text-muc-nhat hover:text-toi'
 }`}
            type="button"
          >
            <span className="text-[18px]" aria-hidden="true">❓</span>
            <span>Trạm 06: Vì Sao Máy Nói Vậy?</span>
          </button>
        </div>
      </div>

      {activeTab === 'tram-5' ? (
        /* STATION 5: THRESHOLD SLIDER & HUMAN DECISION */
        <div className="flex flex-col gap-6">
          <div className="bg-the p-6 rounded-to border border-ke flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-nho bg-ke text-nhan-dam text-sm font-semibold">
                  YCCĐ: 7.C5.1
                </span>
                <span className="text-sm text-muc-mo font-semibold">Ra Quyết Định Trong AI</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-toi">
                Thanh Trượt Ngưỡng Tin Cậy (Confidence Threshold)
              </h2>
              <p className="text-sm sm:text-base text-muc-nhat">
                AI chỉ đưa ra điểm số xác suất. Con người quyết định đặt mức bao nhiêu để hệ thống được phép hành động!
              </p>
            </div>

            {/* Scenario toggle */}
            <div className="flex items-center gap-2 bg-nhan-nen p-1.5 rounded-to border border-ke shrink-0">
              <button
                onClick={() => {
                  setScenario('vault');
                  setThreshold(90);
                }}
                className={`px-3 py-2 rounded-vua text-sm font-semibold transition-all cursor-pointer ${
 scenario === 'vault' ? 'bg-the text-nhan-dam' : 'text-muc-nhat'
 }`}
                type="button"
              >
                🏦 Phòng Giữ Kho Báu (Nguy cấp)
              </button>
              <button
                onClick={() => {
                  setScenario('library');
                  setThreshold(60);
                }}
                className={`px-3 py-2 rounded-vua text-sm font-semibold transition-all cursor-pointer ${
 scenario === 'library' ? 'bg-the text-nhan-dam' : 'text-muc-nhat'
 }`}
                type="button"
              >
                📚 Thư Viện Đọc Truyện (Thân thiện)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left controller: Slider */}
            <div className="lg:col-span-6 bg-white p-6 rounded-to border border-ke flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-toi">1. Điều chỉnh Ngưỡng Chấp Nhận:</h3>
                  <span className="text-3xl font-bold text-nhan">{threshold}%</span>
                </div>

                {/* Tactile Slider */}
                <div className="flex flex-col gap-2">
                  <input
                    type="range"
                    min="30"
                    max="95"
                    step="1"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-3 bg-ke rounded-nho appearance-none cursor-pointer accent-nhan"
                  />
                  <div className="flex justify-between text-sm text-muc-mo">
                    <span>30% (Dễ tính)</span>
                    <span>60% (Trung bình)</span>
                    <span>80% (Khắt khe)</span>
                    <span>95% (Cực kỳ an toàn)</span>
                  </div>
                </div>

                <div className="p-4 rounded-to bg-giay border border-ke text-sm text-muc-nhat leading-relaxed">
                  💡 <strong>Quy tắc hệ thống:</strong> Nếu độ chắc chắn của AI{' '}
                  <span className="font-semibold text-toi">≥ {threshold}%</span>, hệ thống tự động mở cửa. Nếu{' '}
                  <span className="font-semibold text-toi">&lt; {threshold}%</span>, máy từ chối và báo{' '}
                  <strong>"Em không chắc"</strong>.
                </div>
              </div>

              {/* Sample Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muc">2. Chọn mẫu thử nghiệm trước camera:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSampleConfidence(94)}
                    className={`p-2.5 rounded-vua border text-sm font-semibold transition-all cursor-pointer ${
 sampleConfidence === 94 ? 'bg-nhan-nen border-nhan ring-2 ring-nhan' : 'bg-giay border-ke'
 }`}
                    type="button"
                  >
                    👤 Mặt rõ nét (94%)
                  </button>
                  <button
                    onClick={() => setSampleConfidence(82)}
                    className={`p-2.5 rounded-vua border text-sm font-semibold transition-all cursor-pointer ${
 sampleConfidence === 82 ? 'bg-nhan-nen border-nhan ring-2 ring-nhan' : 'bg-giay border-ke'
 }`}
                    type="button"
                  >
                    👓 Đeo kính mờ (82%)
                  </button>
                  <button
                    onClick={() => setSampleConfidence(45)}
                    className={`p-2.5 rounded-vua border text-sm font-semibold transition-all cursor-pointer ${
 sampleConfidence === 45 ? 'bg-nhan-nen border-nhan ring-2 ring-nhan' : 'bg-giay border-ke'
 }`}
                    type="button"
                  >
                    👒 Trùm kín đầu (45%)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Display: Dual Gauge comparison */}
            <div className="lg:col-span-6 bg-white p-6 rounded-to border border-ke flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-semibold text-toi">2. Quyết Định Thực Thi:</h3>

                {/* Visual meter comparison */}
                <div className="flex items-center justify-around p-4 bg-giay rounded-to border">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-muc-mo">Độ Tin Cậy AI</span>
                    <span className="text-3xl font-bold text-nhan">{sampleConfidence}%</span>
                  </div>

                  <span className="text-2xl font-semibold text-muc-mo">
                    {sampleConfidence >= threshold ? '≥' : '<'}
                  </span>

                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-muc-mo">Ngưỡng Yêu Cầu</span>
                    <span className="text-3xl font-bold text-muc">{threshold}%</span>
                  </div>
                </div>

                {/* State Decision Box */}
                {sampleConfidence >= threshold ? (
                  <div className="p-6 rounded-to bg-dung-nen border-2 border-ke-dam flex items-center gap-4">
                    <span className="text-dung text-[42px] shrink-0" aria-hidden="true">🔒</span>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-dung">
                        HÀNH ĐỘNG ĐƯỢC DUYỆT: MỞ CỬA TỰ ĐỘNG ✅
                      </span>
                      <p className="text-sm text-dung mt-0.5">
                        Độ tin cậy ({sampleConfidence}%) vượt qua mức an toàn ({threshold}%). Máy tự tin thực thi hành động.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-to bg-thu-nen border-2 border-ke-dam flex items-center gap-4">
<span className="text-[36px] shrink-0" aria-hidden="true">❓</span>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-thu">
                        AI BẢO:"EM KHÔNG CHẮC CHẮN!" ⚠️
                      </span>
                      <p className="text-sm text-thu mt-0.5">
                        Độ tin cậy ({sampleConfidence}%) thấp hơn ngưỡng ({threshold}%). Máy dừng lại và yêu cầu bảo vệ con người đến xác nhận!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-vua bg-nhan-nen text-sm text-nhan-dam font-medium">
                🎯 <strong>Bài học rút ra:</strong> Trong đời sống, các hệ thống y tế hoặc xe tự lái đặt ngưỡng rất cao (98-99%) để tránh tai nạn; trong khi bộ lọc tìm kiếm ảnh vui có thể hạ ngưỡng xuống 50%.
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'tro-choi-cua' ? (
        /* GATEKEEPER GAME */
        <div className="flex flex-col gap-6">
          <div className="bg-the p-6 rounded-to border border-ke flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-nho bg-teal-100 text-teal-800 text-sm font-semibold">
                  Thực Nghiệm Đánh Đổi
                </span>
                <span className="text-sm text-muc-mo font-semibold">Trade-off Dilemma</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-toi">
                Trò Chơi: Khóa Cửa Thông Minh (Smart Gatekeeper)
              </h2>
              <p className="text-sm sm:text-base text-muc-nhat">
                Cài đặt ngưỡng cửa và đón 20 lượt khách. Em chọn <strong>An toàn tuyệt đối</strong> hay <strong>Tiện lợi cho bạn bè</strong>?
              </p>
            </div>

            <button
              disabled={isSimulating}
              onClick={handleRunSimulation}
              className="min-h-[48px] px-6 rounded-to bg-teal-600 text-white font-semibold text-base hover:bg-teal-700 active:translate-y-0.5 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span className="text-[20px]" aria-hidden="true">▶</span>
              <span>{isSimulating ? 'Đang Chạy Mô Phỏng...' : 'Chạy Thử Nghiệm Khách Đến'}</span>
            </button>
          </div>

          {/* Controller & Meters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Door Visual */}
            <div className="lg:col-span-6 bg-white p-6 rounded-to border border-ke flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-muc">Ngưỡng mở cửa tự động:</span>
                  <span className="text-teal-700 text-base">{gameThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  step="1"
                  value={gameThreshold}
                  onChange={(e) => setGameThreshold(Number(e.target.value))}
                  disabled={isSimulating}
                  className="w-full h-3 bg-teal-100 rounded-nho appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* Animated Door Frame */}
              <div className="w-full aspect-[16/9] rounded-to bg-toi p-6 flex flex-col items-center justify-center relative overflow-hidden border border-toi-nhat">
                <div className="text-6xl sm:text-7xl transition-all duration-500 transform">
                  {doorStatus === 'opened' ? '🚪 🟢' : '🔒 🔴'}
                </div>
                <div className="mt-3 px-4 py-1.5 rounded-full bg-toi-nhat text-white text-sm font-semibold tracking-wider">
                  {doorStatus === 'opened' ? 'CỬA ĐANG MỞ (PASS)' : 'CỬA ĐANG KHÓA (LOCKED)'}
                </div>
              </div>

              {/* Two Meters: Safety vs Convenience */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-to bg-nhan-nen border border-ke flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm font-semibold text-muc">
                    <span>🛡️ Điểm An Toàn:</span>
                    <span className="text-nhan-dam">{safetyScore}%</span>
                  </div>
                  <div className="w-full bg-ke h-2.5 rounded-full overflow-hidden">
                    <div className="bg-nhan h-full rounded-full transition-all duration-500" style={{ width: `${safetyScore}%` }}></div>
                  </div>
                  <span className="text-sm text-muc-mo">Chặn kẻ gian lọt vào</span>
                </div>

                <div className="p-4 rounded-to bg-teal-50/70 border border-teal-100 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-sm font-semibold text-muc">
                    <span>⚡ Điểm Tiện Lợi:</span>
                    <span className="text-teal-700">{convenienceScore}%</span>
                  </div>
                  <div className="w-full bg-teal-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full transition-all duration-500" style={{ width: `${convenienceScore}%` }}></div>
                  </div>
                  <span className="text-sm text-muc-mo">Bạn bè không bị kẹt ngoài</span>
                </div>
              </div>
            </div>

            {/* Right Live Event Stream */}
            <div className="lg:col-span-6 bg-white p-6 rounded-to border border-ke flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-toi flex items-center gap-2">
                  <span className="text-teal-600 text-[20px]" aria-hidden="true">📄</span>
                  <span>Nhật ký khách tới cửa thời gian thực</span>
                </h3>
                <span className="text-sm text-muc-mo">Live stream</span>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {gameLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-to bg-giay border border-ke flex items-center justify-between gap-3 animate-in fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{log.emoji}</span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-toi">{log.name}</span>
                          <span className="text-sm text-nhan-dam font-semibold">
                            ({log.prob}%)
                          </span>
                        </div>
                        <span className="text-sm text-muc-mo">{log.text}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-nho text-sm font-semibold shrink-0 ${log.badgeColor}`}>
                      {log.badgeText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STATION 6: 6 FLASHCARDS */
        <div className="flex flex-col gap-6">
          <div className="bg-the p-6 rounded-to border border-ke flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-nho bg-ke text-nhan-dam text-sm font-semibold">
                  YCCĐ: 8.C1.1
                </span>
                <span className="text-sm text-muc-mo font-semibold">Giải Mã Bản Chất AI</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-toi">
                Vì Sao Máy Nói Vậy? (Bộ 6 Thẻ Trực Quan Dưới 60s)
              </h2>
              <p className="text-sm sm:text-base text-muc-nhat">
                Hiểu bản chất từ bảng số pixel đến xác suất và vai trò làm chủ tối thượng của con người.
              </p>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-1.5 shrink-0">
              {FLASHCARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentCardIndex(i)}
                  className={`w-8 h-8 rounded-vua text-sm font-semibold transition-all cursor-pointer ${
 currentCardIndex === i
 ? 'bg-nhan text-white'
 : 'bg-giay text-muc-nhat hover:bg-ke'
 }`}
                  type="button"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Viewer */}
          <div className="bg-the p-6 lg:p-10 rounded-to border border-ke flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-ke text-nhan-dam text-sm font-semibold">
                  {card.indexTag}
                </span>
                <span className="text-sm text-muc-mo">⏱️ {card.time}</span>
              </div>
              <span className="text-sm font-semibold text-muc-mo">
                {card.overline}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-toi leading-tight">
                {card.title}
              </h3>
              <p className="text-base sm:text-lg text-muc leading-relaxed">
                {card.body}
              </p>
            </div>

            {/* Visual Tactile Widget according to type */}
            <div className="p-6 rounded-to bg-nhan-nen border border-ke flex flex-col gap-4">
              {card.type === 'matrix' && (
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-muc-mo mb-2">Hình ảnh camera thấy</span>
                    <div className="w-24 h-24 rounded-to bg-nhan flex items-center justify-center text-white text-3xl">
                      ✏️
                    </div>
                  </div>
                  <span className="text-muc-mo text-[28px]" aria-hidden="true">→</span>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-muc-mo mb-2">Bảng số RGB bộ nhớ đọc</span>
                    <div className="grid grid-cols-3 gap-1 p-2 bg-toi rounded-vua text-sm text-ke-dam">
                      <span className="p-1 bg-toi-nhat rounded text-center">255</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">120</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">45</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">0</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">240</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">255</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">18</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">90</span>
                      <span className="p-1 bg-toi-nhat rounded text-center">200</span>
                    </div>
                  </div>
                </div>
              )}

              {card.type === 'compare' && (
                <div className="flex items-center justify-center gap-6 text-center">
                  <div className="p-4 bg-white rounded-to border flex flex-col items-center">
                    <span className="text-3xl">🐰</span>
                    <span className="text-sm font-semibold mt-1 text-muc">Mẫu trong kho</span>
                  </div>
                  <span className="text-xl font-semibold text-nhan">vs</span>
                  <div className="p-4 bg-white rounded-to border flex flex-col items-center">
                    <span className="text-3xl">🐇</span>
                    <span className="text-sm font-semibold mt-1 text-muc">Ảnh mới đến</span>
                  </div>
                  <span className="text-sm text-dung font-semibold bg-dung-nen px-2 py-1 rounded-nho">
                    Khớp 91%
                  </span>
                </div>
              )}

              {card.type === 'prob' && (
                <div className="flex items-center justify-around gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold text-nhan">82%</span>
                    <span className="text-sm text-muc-nhat">Chú chó</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-semibold text-muc-mo">18%</span>
                    <span className="text-sm text-muc-nhat">Khăn len cuộn tròn</span>
                  </div>
                </div>
              )}

              {card.type === 'bias' && (
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">🍎</span>
                    <span className="text-sm font-semibold text-dung">Được dạy: Nhận ra ngay</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">🍏</span>
                    <span className="text-sm font-semibold text-loi">Không dạy: Không nhận ra</span>
                  </div>
                </div>
              )}

              {card.type === 'pattern' && (
                <div className="text-center text-sm text-muc-nhat">
                  Khuôn bánh ⭐ dập lên bột: Không cần biết ngôi sao vũ trụ là gì, chỉ đo các cạnh hình học!
                </div>
              )}

              {card.type === 'human' && (
                <div className="flex items-center justify-center gap-4 text-center">
                  <div className="p-3 bg-white rounded-vua border flex items-center gap-2">
                    <span className="text-2xl">🚗</span>
                    <span className="text-sm font-semibold text-toi-nhat">Con người cầm vô lăng</span>
                  </div>
                  <span className="text-lg font-semibold text-muc-mo">+</span>
                  <div className="p-3 bg-white rounded-vua border flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    <span className="text-sm font-semibold text-toi-nhat">AI gợi ý bản đồ</span>
                  </div>
                </div>
              )}

              {/* Analogy explanation */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-ke">
<span className="shrink-0" aria-hidden="true">💡</span>
                <div className="text-sm sm:text-base text-muc leading-relaxed">
                  <strong className="text-nhan-dam">{card.analogy}</strong> {card.analogyDetail}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentCardIndex === 0}
                onClick={() => setCurrentCardIndex(prev => prev - 1)}
                className="min-h-[44px] px-5 rounded-vua bg-giay text-muc font-semibold text-sm hover:bg-ke transition-all disabled:opacity-30 cursor-pointer"
                type="button"
              >
                ← Thẻ Trước
              </button>

              <button
                disabled={currentCardIndex === FLASHCARDS.length - 1}
                onClick={() => setCurrentCardIndex(prev => prev + 1)}
                className="min-h-[44px] px-5 rounded-vua bg-nhan text-white font-semibold text-sm hover:bg-nhan-dam transition-all disabled:opacity-30 cursor-pointer"
                type="button"
              >
                Thẻ Tiếp Theo →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
