import React, { useState, useEffect } from 'react';
import { GAMES } from '../data/stations';
import confetti from 'canvas-confetti';

interface GamesHubProps {
  initialGameId?: string;
  onBack: () => void;
  onNavigateToStation: (page: any, sub?: string) => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  initialGameId = 'game-1',
  onBack,
  onNavigateToStation,
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGameId);

  // Game 1: 90s Blitz timer & points
  const [blitzTime, setBlitzTime] = useState<number>(90);
  const [isBlitzActive, setIsBlitzActive] = useState<boolean>(false);
  const [stars, setStars] = useState<number>(0);
  const [tricksFound, setTricksFound] = useState<string[]>([]);

  useEffect(() => {
    let timer: any = null;
    if (isBlitzActive && blitzTime > 0) {
      timer = setInterval(() => {
        setBlitzTime((t) => t - 1);
      }, 1000);
    } else if (blitzTime === 0 && isBlitzActive) {
      setIsBlitzActive(false);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
    return () => clearInterval(timer);
  }, [isBlitzActive, blitzTime]);

  const handleTriggerTrick = (trickName: string) => {
    if (!tricksFound.includes(trickName)) {
      setTricksFound((prev) => [...prev, trickName]);
      setStars((s) => s + 1);
    }
  };

  // Game 3: Người vs Máy state
  const [humanScore, setHumanScore] = useState<number>(6);
  const [aiScore, setAiScore] = useState<number>(4);
  const [currentRound, setCurrentRound] = useState<number>(10);

  const handleNextMatch = (humanWins: boolean) => {
    setCurrentRound((r) => r + 1);
    if (humanWins) {
      setHumanScore((s) => s + 1);
    } else {
      setAiScore((s) => s + 1);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-to bg-white border border-ke text-nhan-dam hover:bg-nhan hover:text-white font-semibold text-sm sm:text-base transition-all cursor-pointer"
          type="button"
        >
          <span>← Quay lại Trang Chủ</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-vua bg-ke text-nhan-dam text-sm font-semibold border border-ke">
            5 Trò Chơi Thực Nghiệm AI
          </span>
        </div>
      </div>

      {/* Game Selector Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGameId(g.id)}
            className={`min-h-[56px] p-3 rounded-to flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
 selectedGameId === g.id
 ? 'bg-nhan text-white border-nhan-dam scale-[1.02]'
 : 'bg-the text-muc border-ke hover:bg-nhan-nen'
 }`}
            type="button"
          >
            <span className="text-[20px]" aria-hidden="true">{g.icon}</span>
            <span className="text-sm font-semibold mt-1 line-clamp-1">{g.title}</span>
          </button>
        ))}
      </div>

      {/* Selected Game Playground */}
      {selectedGameId === 'game-1' && (
        <div className="bg-the p-6 lg:p-8 rounded-to border border-ke flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-nho bg-thu-nen text-thu text-sm font-semibold">
                Trò chơi 1 • 90 Giây Blitz
              </span>
              <h2 className="text-2xl font-semibold text-toi mt-1">
                Đánh Lừa Máy — Thu Thập Kỷ Lục Sao ⭐
              </h2>
              <p className="text-sm sm:text-base text-muc-nhat">
                Trong 90 giây, tìm càng nhiều góc lạ và mẹo che để khiến camera AI đoán nhầm vật thể!
              </p>
            </div>

            <div className="flex items-center gap-4 bg-thu-nen p-4 rounded-to border border-ke shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-muc-mo">Thời gian còn</span>
                <span className="text-3xl font-bold text-thu">{blitzTime}s</span>
              </div>
              <div className="w-px h-10 bg-ke"></div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-muc-mo">Sao thu được</span>
                <span className="text-3xl font-bold text-nhan">{stars} ⭐</span>
              </div>
            </div>
          </div>

          {!isBlitzActive ? (
            <div className="flex flex-col items-center justify-center p-8 bg-nhan-nen rounded-to border border-ke gap-4 text-center">
              <span className="text-5xl">⏱️</span>
              <div className="max-w-md">
                <h4 className="text-lg font-semibold text-toi">Sẵn sàng đếm ngược 90 giây?</h4>
                <p className="text-sm text-muc-nhat mt-1">
                  Hãy chuẩn bị sẵn đồ dùng học tập: Bút bi, thước kẻ, cục tẩy trên mặt bàn của nhóm em!
                </p>
              </div>
              <button
                onClick={() => {
                  setBlitzTime(90);
                  setStars(0);
                  setTricksFound([]);
                  setIsBlitzActive(true);
                }}
                className="min-h-[48px] px-8 rounded-to bg-thu text-white font-semibold text-base hover:bg-thu active:translate-y-0.5 cursor-pointer"
                type="button"
              >
                Bắt Đầu 90s Blitz!
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-semibold text-toi">Bấm xác nhận khi nhóm em vừa làm AI đoán sai:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: 'Che 50% thân bút bi', desc: 'Máy đoán nhầm sang: Quyển sách' },
                  { name: 'Chụp bút từ đỉnh ngòi xuống', desc: 'Máy đoán nhầm sang: Cục tẩy' },
                  { name: 'Chiếu đèn pin tạo bóng đen', desc: 'Máy đoán nhầm sang: Vở tối màu' },
                  { name: 'Đặt bút trên bàn có nhiều chữ', desc: 'Máy đoán nhầm sang: Trang sách' },
                  { name: 'Nghiêng góc 60 độ so với bàn', desc: 'Máy dao động dưới 40%' },
                  { name: 'Cầm 2 cây bút chụm lại', desc: 'Máy phân vân hai nhãn' },
                ].map((trick, i) => (
                  <button
                    key={i}
                    disabled={tricksFound.includes(trick.name)}
                    onClick={() => handleTriggerTrick(trick.name)}
                    className={`p-4 rounded-to border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
 tricksFound.includes(trick.name)
 ? 'bg-dung-nen border-ke-dam opacity-80'
 : 'bg-the border-ke hover:border-nhan'
 }`}
                    type="button"
                  >
                    <div>
                      <div className="text-sm font-semibold text-toi">{trick.name}</div>
                      <div className="text-sm text-muc-mo mt-1">{trick.desc}</div>
                    </div>
                    <span className="text-sm font-semibold text-nhan-dam">
                      {tricksFound.includes(trick.name) ? 'ĐÃ TÌM THẤY (+1 ⭐)' : '+ Nhận 1 Sao'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedGameId === 'game-3' && (
        <div className="bg-the p-6 lg:p-8 rounded-to border border-ke flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-nho bg-ke text-nhan-dam text-sm font-semibold">
                Trò chơi 3 • Đấu trí 20 Lượt
              </span>
              <h2 className="text-2xl font-semibold text-toi mt-1">Người vs Máy (Human vs AI)</h2>
              <p className="text-sm sm:text-base text-muc-nhat">
                10 ảnh bình thường máy thắng milli-giây; 10 ảnh bẫy ngữ cảnh thì ai sẽ chiến thắng?
              </p>
            </div>

            <div className="flex items-center gap-4 bg-nhan-nen p-4 rounded-to border border-ke">
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-muc-mo">Học Sinh 🧑</span>
                <span className="text-3xl font-bold text-nhan">{humanScore}</span>
              </div>
              <span className="text-xl font-semibold text-muc-mo">vs</span>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-muc-mo">Mạng Nơ-ron 🤖</span>
                <span className="text-3xl font-bold text-nhan">{aiScore}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-to bg-giay border border-ke flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-to bg-nhan text-white text-3xl flex items-center justify-center">
                {currentRound % 2 === 0 ? '🥖' : '🐕'}
              </div>
              <div>
                <span className="text-sm font-semibold text-muc-mo uppercase">
                  Lượt đấu #{currentRound} / 20:
                </span>
                <h4 className="text-base font-semibold text-toi">
                  {currentRound % 2 === 0
                    ? 'Bánh mì que nướng vàng đặt cạnh chú chó Pug'
                    : 'Bông cải xanh trông giống cây cổ thụ mini'}
                </h4>
                <p className="text-sm text-muc-mo mt-0.5">
                  Máy tính đo các cụm màu tương đồng, còn con người hiểu ngữ cảnh sinh học!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleNextMatch(true)}
                className="min-h-[44px] px-4 rounded-vua bg-nhan text-white font-semibold text-sm hover:bg-nhan-dam cursor-pointer"
                type="button"
              >
                Người Đúng (+1đ)
              </button>
              <button
                onClick={() => handleNextMatch(false)}
                className="min-h-[44px] px-4 rounded-vua bg-nhan text-white font-semibold text-sm hover:bg-nhan-dam cursor-pointer"
                type="button"
              >
                Máy Đoán Đúng (+1đ)
              </button>
            </div>
          </div>
        </div>
      )}

      {(selectedGameId === 'game-2' || selectedGameId === 'game-4' || selectedGameId === 'game-5') && (
        <div className="bg-the p-8 rounded-to border border-ke flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-to bg-ke text-nhan-dam flex items-center justify-center text-3xl">
            🎮
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-semibold text-toi">
              {selectedGameId === 'game-5'
                ? 'Trò Chơi Khóa Cửa Thông Minh'
                : selectedGameId === 'game-4'
                ? 'Thám Tử Thiên Lệch Dữ Liệu'
                : 'Đoán Trước Máy'}
            </h3>
            <p className="text-sm sm:text-base text-muc-nhat mt-1">
              Trò chơi này được tích hợp trực tiếp trong Trạm thí nghiệm chuyên sâu để học sinh thao tác cảm biến và dữ liệu trực tiếp.
            </p>
          </div>
          <button
            onClick={() => {
              if (selectedGameId === 'game-5') {
                onNavigateToStation('station-5-6', 'tro-choi-cua');
              } else if (selectedGameId === 'game-4') {
                onNavigateToStation('station-3-4', 'station-4');
              } else {
                onNavigateToStation('station-1-2', 'mode-1');
              }
            }}
            className="min-h-[46px] px-6 rounded-vua bg-nhan text-white font-semibold text-base hover:bg-nhan-dam cursor-pointer"
            type="button"
          >
            Chuyển Đến Trạm Thao Tác Trực Tiếp →
          </button>
        </div>
      )}
    </div>
  );
};
