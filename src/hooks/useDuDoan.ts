import { useEffect, useMemo, useState, type RefObject } from 'react';
import { MoHinhTeachable, type DuDoan } from '../lib/teachable';

export type TrangThaiMoHinh = 'chua-nap' | 'dang-nap' | 'san-sang' | 'loi';

interface TuyChon {
  /** Chỉ đoán khi camera đang bật và khung hình chưa bị giữ lại */
  dangChay: boolean;
  /** Camera trước thì ảnh bị soi gương, cần lật lại trước khi đưa vào mô hình */
  lat?: boolean;
  /** Số lần đoán mỗi giây. Để thấp cho máy tính bảng đỡ nóng và đỡ tụt pin. */
  fps?: number;
}

function moTaLoi(err: unknown): string {
  const goc = err instanceof Error ? err.message : String(err);
  if (/fetch|network|Failed to fetch/i.test(goc)) {
    return 'Không tải được mô hình. Kiểm tra kết nối mạng hoặc đường dẫn thư mục mô hình.';
  }
  if (/metadata\.json/i.test(goc)) {
    return `Thiếu hoặc hỏng file metadata.json của mô hình. (${goc})`;
  }
  return `Không nạp được mô hình: ${goc}`;
}

/**
 * Nạp một mô hình Teachable Machine và chạy vòng lặp dự đoán trên thẻ <video>.
 *
 * Mô hình được giải phóng khi đổi nguồn hoặc khi rời trạm, nên không rò bộ nhớ
 * GPU giữa các tiết học.
 */
export function useDuDoan(
  nguon: string | null,
  videoRef: RefObject<HTMLVideoElement | null>,
  { dangChay, lat = false, fps = 8 }: TuyChon,
) {
  const [moHinh, setMoHinh] = useState<MoHinhTeachable | null>(null);
  const [trangThai, setTrangThai] = useState<TrangThaiMoHinh>('chua-nap');
  const [loi, setLoi] = useState<string | null>(null);
  const [duDoan, setDuDoan] = useState<DuDoan[]>([]);

  // Nạp mô hình
  useEffect(() => {
    if (!nguon) {
      setMoHinh(null);
      setTrangThai('chua-nap');
      return;
    }

    let huy = false;
    let daNap: MoHinhTeachable | null = null;

    setTrangThai('dang-nap');
    setLoi(null);
    setDuDoan([]);

    MoHinhTeachable.nap(nguon)
      .then((m) => {
        daNap = m;
        // Rời trạm trước khi nạp xong thì giải phóng luôn, không setState nữa.
        if (huy) {
          m.huy();
          return;
        }
        setMoHinh(m);
        setTrangThai('san-sang');
      })
      .catch((err) => {
        if (huy) return;
        setLoi(moTaLoi(err));
        setTrangThai('loi');
      });

    return () => {
      huy = true;
      daNap?.huy();
      setMoHinh(null);
    };
  }, [nguon]);

  // Vòng lặp dự đoán
  useEffect(() => {
    if (!moHinh || !dangChay) return;

    let huy = false;
    let timer = 0;
    const khoangCach = Math.max(1000 / fps, 40);

    const chay = async () => {
      if (huy) return;
      const video = videoRef.current;

      // readyState >= 2 nghĩa là đã có ít nhất một khung hình để đọc
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        try {
          const ketQua = await moHinh.duDoan(video, lat);
          if (huy) return;
          setDuDoan(ketQua);
        } catch (err) {
          if (huy) return;
          setLoi(moTaLoi(err));
          setTrangThai('loi');
          return;
        }
      }

      if (!huy) timer = window.setTimeout(chay, khoangCach);
    };

    chay();

    return () => {
      huy = true;
      window.clearTimeout(timer);
    };
  }, [moHinh, dangChay, lat, fps, videoRef]);

  // moHinh?.labels ?? [] tạo mảng mới mỗi lần render, làm các effect phía dùng
  // nó chạy lại vô ích. Ghim lại theo mô hình đang nạp.
  const labels = useMemo(() => moHinh?.labels ?? [], [moHinh]);

  const nhanCaoNhat = useMemo(() => {
    if (duDoan.length === 0) return null;
    return duDoan.reduce((a, b) => (b.probability > a.probability ? b : a));
  }, [duDoan]);

  return {
    trangThai,
    loi,
    duDoan,
    nhanCaoNhat,
    labels,
    tenMoHinh: moHinh?.thongTin.modelName,
  };
}
