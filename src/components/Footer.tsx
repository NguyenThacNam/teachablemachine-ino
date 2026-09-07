import React from 'react';

export const Footer: React.FC = () => {
  return (
    // Cùng nền và cùng đường kẻ với thanh đầu trang, để hai đầu trang khép lại
    <footer className="khong-in w-full bg-giay border-t border-ke py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-semibold text-base text-muc">INOHUB STEM AI Explorer Lab</span>
          <p className="text-sm text-muc-nhat max-w-2xl leading-relaxed">
            Đề án giáo dục tích hợp Trí tuệ nhân tạo theo Khung phân phối chương trình THCS —
            Quyết định 2422/QĐ-BGDĐT. Mô hình chạy ngay trên trình duyệt, ảnh camera không rời khỏi
            máy của học sinh.
          </p>
        </div>

        <span className="text-sm text-muc-mo shrink-0 text-center md:text-right">
          © 2025 INOHUB STEM Lab.
        </span>
      </div>
    </footer>
  );
};
