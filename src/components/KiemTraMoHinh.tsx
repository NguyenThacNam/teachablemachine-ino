import React, { useEffect, useRef, useState } from 'react';
import { MO_HINH, type MoHinhLab } from '../data/models';
import { MoHinhTeachable } from '../lib/teachable';

type TrangThaiKiem = 'chua' | 'dang' | 'ok' | 'loi';

interface KetQuaKiem {
  trangThai: TrangThaiKiem;
  thoiGianMs?: number;
  nhan?: string[];
  tenGoc?: string;
  dungLuong?: number;
  loi?: string;
}

/** Mô hình để trong public/models/ thì không phụ thuộc mạng ngoài */
function laNoiBo(nguon: string): boolean {
  return !/^https?:\/\//i.test(nguon);
}

function doDoc(byte?: number): string {
  if (byte === undefined) return '—';
  return `${(byte / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Đo tổng dung lượng các file trọng số khai trong model.json.
 * Best-effort: máy chủ không trả Content-Length thì bỏ qua, không coi là lỗi.
 */
async function doDungLuong(nguon: string): Promise<number | undefined> {
  try {
    const base = nguon.endsWith('/') ? nguon : `${nguon}/`;
    const phanHoi = await fetch(`${base}model.json`);
    if (!phanHoi.ok) return undefined;

    const manifest = await phanHoi.json();
    const duongDan: string[] = (manifest?.weightsManifest ?? []).flatMap(
      (nhom: { paths?: string[] }) => nhom?.paths ?? [],
    );
    if (duongDan.length === 0) return undefined;

    let tong = 0;
    for (const p of duongDan) {
      const head = await fetch(`${base}${p}`, { method: 'HEAD' });
      const kichThuoc = head.headers.get('content-length');
      if (!kichThuoc) return undefined;
      tong += Number(kichThuoc);
    }
    return tong;
  } catch {
    return undefined;
  }
}

/**
 * Bảng kiểm tra mô hình — dành cho giáo viên chạy trước tiết học.
 *
 * Nạp thật từng mô hình trong danh sách rồi giải phóng ngay, nên biết chắc
 * mô hình nào hỏng trước khi 30 máy tính bảng cùng mở.
 */
export const KiemTraMoHinh: React.FC = () => {
  const [ketQua, setKetQua] = useState<Record<string, KetQuaKiem>>({});
  const [dangChay, setDangChay] = useState(false);
  const huyRef = useRef(false);

  useEffect(() => {
    huyRef.current = false;
    return () => {
      huyRef.current = true;
    };
  }, []);

  const kiemTraMot = async (m: MoHinhLab) => {
    setKetQua((prev) => ({ ...prev, [m.id]: { trangThai: 'dang' } }));

    try {
      const batDau = performance.now();
      const moHinh = await MoHinhTeachable.nap(m.nguon);
      const thoiGianMs = Math.round(performance.now() - batDau);

      const nhan = [...moHinh.labels];
      const tenGoc = moHinh.thongTin.modelName;
      // Giải phóng ngay, không giữ nhiều mô hình cùng lúc trong bộ nhớ GPU
      moHinh.huy();

      const dungLuong = await doDungLuong(m.nguon);
      if (huyRef.current) return;

      setKetQua((prev) => ({
        ...prev,
        [m.id]: { trangThai: 'ok', thoiGianMs, nhan, tenGoc, dungLuong },
      }));
    } catch (err) {
      if (huyRef.current) return;
      setKetQua((prev) => ({
        ...prev,
        [m.id]: {
          trangThai: 'loi',
          loi: err instanceof Error ? err.message : String(err),
        },
      }));
    }
  };

  const kiemTraTatCa = async () => {
    setDangChay(true);
    // Chạy lần lượt, không song song — máy tính bảng yếu dễ hết bộ nhớ
    for (const m of MO_HINH) {
      if (huyRef.current) break;
      await kiemTraMot(m);
    }
    if (!huyRef.current) setDangChay(false);
  };

  const soOk = Object.values(ketQua).filter((k) => k.trangThai === 'ok').length;
  const soLoi = Object.values(ketQua).filter((k) => k.trangThai === 'loi').length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={kiemTraTatCa}
          disabled={dangChay}
          className="nut nut-chinh shrink-0"
          type="button"
        >
          <span aria-hidden="true">{dangChay ? '⏳' : '▶'}</span>
          <span>{dangChay ? 'Đang kiểm tra…' : `Kiểm tra tất cả (${MO_HINH.length})`}</span>
        </button>
      </div>

      {(soOk > 0 || soLoi > 0) && (
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <span className="px-3 py-1 rounded-nho bg-dung-nen text-dung border border-ke">
            ✅ {soOk} mô hình chạy được
          </span>
          {soLoi > 0 && (
            <span className="px-3 py-1 rounded-nho bg-loi-nen text-loi border border-ke">
              ❌ {soLoi} mô hình lỗi
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {MO_HINH.map((m) => {
          const kq = ketQua[m.id] ?? { trangThai: 'chua' as TrangThaiKiem };
          const noiBo = laNoiBo(m.nguon);

          return (
            <div
              key={m.id}
              className={`the p-4 flex flex-col gap-2.5 ${
                kq.trangThai === 'loi' ? 'border-loi' : 'border-ke'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">
                    {kq.trangThai === 'ok'
                      ? '✅'
                      : kq.trangThai === 'loi'
                        ? '❌'
                        : kq.trangThai === 'dang'
                          ? '⏳'
                          : '⚪'}
                  </span>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-toi truncate">{m.ten}</div>
                    <div className="text-sm text-muc-mo truncate">
                      {m.nguon}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-nho text-sm font-semibold border ${
 noiBo
 ? 'bg-nhan-nen text-nhan-dam border-ke'
 : 'bg-thu-nen text-thu border-ke'
 }`}
                  >
                    {noiBo ? 'Trong máy' : 'Link ngoài — cần mạng'}
                  </span>
                  <button
                    onClick={() => kiemTraMot(m)}
                    disabled={dangChay || kq.trangThai === 'dang'}
                    className="min-h-[36px] px-3 rounded-nho bg-giay text-muc font-semibold text-sm hover:bg-ke cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    Thử lại
                  </button>
                </div>
              </div>

              {kq.trangThai === 'ok' && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muc-nhat border-t border-giay pt-2.5">
                  <span>
                    ⏱ Nạp trong <strong className="text-toi">{kq.thoiGianMs} ms</strong>
                  </span>
                  <span>
                    💾 <strong className="text-toi">{doDoc(kq.dungLuong)}</strong>
                  </span>
                  {kq.tenGoc && (
                    <span>
                      📁 Dự án gốc: <strong className="text-toi">{kq.tenGoc}</strong>
                    </span>
                  )}
                  <span className="w-full sm:w-auto">
                    🏷️ {kq.nhan?.length} nhãn:{' '}
                    <strong className="text-toi">{kq.nhan?.join(' · ')}</strong>
                  </span>
                </div>
              )}

              {kq.trangThai === 'loi' && (
                <div className="text-sm text-loi bg-loi-nen border border-ke rounded-nho p-2.5 border-t leading-relaxed">
                  <strong>Không nạp được:</strong> {kq.loi}
                  <div className="mt-1 text-loi">
                    Kiểm tra thư mục có đủ 3 file <code>model.json</code> · <code>weights.bin</code> ·{' '}
                    <code>metadata.json</code> và đường dẫn trong{' '}
                    <code>src/data/models.ts</code> có đúng không.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
