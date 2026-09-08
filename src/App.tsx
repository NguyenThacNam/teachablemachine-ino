import React, { useState } from 'react';
import { NavPage, GradeFilter } from './types';
import { MO_HINH } from './data/models';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { Station1And2 } from './components/Station1And2';
import { Station3And4 } from './components/Station3And4';
import { Station5And6 } from './components/Station5And6';
import { GamesHub } from './components/GamesHub';
import { TrangKiemTraModel } from './components/TrangKiemTraModel';
import { WorksheetModal, LeaderboardModal } from './components/Modals';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [subStationId, setSubStationId] = useState<string | undefined>(undefined);
  const [currentGrade, setCurrentGrade] = useState<GradeFilter>('all');

  // Mô hình đang chọn được giữ ở đây để học sinh chuyển trạm mà không phải
  // chọn lại từ đầu.
  const [modelId, setModelId] = useState<string>(MO_HINH[0]?.id ?? '');

  // Modals
  const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [resetToast, setResetToast] = useState<string | null>(null);

  const handleNavigate = (page: NavPage, subStation?: string) => {
    setCurrentPage(page);
    setSubStationId(subStation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSession = () => {
    if (window.confirm('Em có chắc chắn muốn xoá toàn bộ dữ liệu buổi học và ghi chép thực nghiệm trên máy này không?')) {
      setCurrentPage('home');
      setSubStationId(undefined);
      setCurrentGrade('all');
      setModelId(MO_HINH[0]?.id ?? '');
      setResetToast('Đã đặt lại phòng Lab về trạng thái ban đầu. Mọi ghi chép của nhóm trước đã bị xoá khỏi màn hình.');
      setTimeout(() => setResetToast(null), 4000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-muc">
      {/* Sticky Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentGrade={currentGrade}
        onChangeGrade={setCurrentGrade}
        onResetSession={handleResetSession}
      />

      {/* Main Content Area with padding for fixed header */}
      <main className="khong-in flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-12">
        {/* Reset Notification Toast */}
        {resetToast && (
          <div className="mb-6 p-4 rounded-to bg-dung-nen text-dung border border-ke-dam font-semibold text-sm flex items-center gap-2">
            <span className="text-dung text-[20px]" aria-hidden="true">🧹</span>
            <span>{resetToast}</span>
          </div>
        )}

        {/* Page Routing */}
        {currentPage === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            gradeFilter={currentGrade}
            onChangeGrade={setCurrentGrade}
            onOpenWorksheetModal={() => setIsWorksheetOpen(true)}
            onOpenLeaderboardModal={() => setIsLeaderboardOpen(true)}
          />
        )}

        {currentPage === 'station-1-2' && (
          <Station1And2
            initialMode={subStationId === 'mode-2' ? 'mode-2' : 'mode-1'}
            modelId={modelId}
            onChangeModel={setModelId}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'station-3-4' && (
          <Station3And4
            initialStation={subStationId === 'station-4' ? 'station-4' : 'station-3'}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'station-5-6' && (
          <Station5And6
            initialSubStation={
              subStationId === 'tro-choi-cua'
                ? 'tro-choi-cua'
                : subStationId === 'tram-6'
                ? 'tram-6'
                : 'tram-5'
            }
            modelId={modelId}
            onChangeModel={setModelId}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'games' && (
          <GamesHub
            initialGameId={subStationId || 'game-1'}
            onBack={() => handleNavigate('home')}
            onNavigateToStation={handleNavigate}
          />
        )}

        {currentPage === 'kiem-tra-model' && (
          <TrangKiemTraModel
            onBack={() => handleNavigate('home')}
            onOpenWorksheet={() => setIsWorksheetOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <WorksheetModal
        isOpen={isWorksheetOpen}
        onClose={() => setIsWorksheetOpen(false)}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
}
