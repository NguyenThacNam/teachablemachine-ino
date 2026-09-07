/**
 * Nạp và chạy mô hình Teachable Machine bằng TensorFlow.js.
 *
 * Không dùng gói @teachablemachine/image vì gói đó ghim cứng tfjs 1.3.1 (2019)
 * và chỉ có bản CommonJS. Ở đây tái hiện đúng các bước tiền xử lý của nó
 * (cắt vuông giữa khung → vẽ vào canvas 224×224 → chuẩn hoá về [-1, 1] bằng
 * div(127).sub(1)) nên kết quả khớp với bản chạy trên teachablemachine.withgoogle.com.
 */
import type * as TF from '@tensorflow/tfjs';

/** Kiểu của cả module tfjs, dùng cho biến giữ thư viện sau khi import động */
type ThuVienTF = typeof import('@tensorflow/tfjs');

export interface ThongTinMoHinh {
  /** Tên các nhãn, đúng thứ tự đầu ra của mô hình */
  labels: string[];
  /** Cạnh ảnh đầu vào, Teachable Machine luôn xuất 224 */
  imageSize: number;
  modelName?: string;
  tfjsVersion?: string;
}

export interface DuDoan {
  label: string;
  /** 0…1 */
  probability: number;
}

export type NguonAnh = HTMLVideoElement | HTMLCanvasElement | HTMLImageElement;

let tfPromise: Promise<ThuVienTF> | null = null;

/**
 * Nạp TensorFlow.js một lần duy nhất và chỉ khi thật sự cần.
 * Thư viện nặng ~1MB gzip nên phải để ngoài gói khởi động của trang chủ.
 */
export function napTensorFlow(): Promise<ThuVienTF> {
  if (!tfPromise) {
    tfPromise = import('@tensorflow/tfjs').then(async (tf) => {
      await tf.ready();
      return tf;
    });
  }
  return tfPromise;
}

/** Đảm bảo đường dẫn thư mục mô hình luôn kết thúc bằng dấu / */
function chuanHoaNguon(nguon: string): string {
  return nguon.endsWith('/') ? nguon : `${nguon}/`;
}

export class MoHinhTeachable {
  private readonly canvas: HTMLCanvasElement;

  private constructor(
    private readonly tf: ThuVienTF,
    private readonly model: TF.LayersModel,
    readonly thongTin: ThongTinMoHinh,
  ) {
    this.canvas = document.createElement('canvas');
  }

  get labels(): string[] {
    return this.thongTin.labels;
  }

  /**
   * @param nguon Thư mục chứa model.json + metadata.json + weights.bin.
   *   Dùng được cả đường dẫn nội bộ ("/models/but_tay_thuocke/") lẫn link
   *   Teachable Machine ("https://teachablemachine.withgoogle.com/models/xxx/").
   */
  static async nap(nguon: string): Promise<MoHinhTeachable> {
    const base = chuanHoaNguon(nguon);
    const tf = await napTensorFlow();

    const phanHoi = await fetch(`${base}metadata.json`);
    if (!phanHoi.ok) {
      throw new Error(`Không đọc được metadata.json (mã ${phanHoi.status}) tại ${base}`);
    }
    const thongTin = (await phanHoi.json()) as ThongTinMoHinh;

    if (!Array.isArray(thongTin.labels) || thongTin.labels.length === 0) {
      throw new Error('metadata.json không có danh sách nhãn (labels)');
    }

    const model = await tf.loadLayersModel(`${base}model.json`);
    return new MoHinhTeachable(tf, model, {
      ...thongTin,
      imageSize: thongTin.imageSize || 224,
    });
  }

  /**
   * Cắt vuông ở giữa nguồn ảnh rồi vẽ vào canvas cạnh `size`.
   * Tái hiện nguyên văn hàm cropTo của @teachablemachine/image.
   */
  private catVuongGiua(nguon: NguonAnh, size: number, lat: boolean): HTMLCanvasElement {
    const rong = nguon instanceof HTMLVideoElement ? nguon.videoWidth : nguon.width;
    const cao = nguon instanceof HTMLVideoElement ? nguon.videoHeight : nguon.height;

    const min = Math.min(rong, cao);
    const tyLe = size / min;
    const rongMoi = Math.ceil(rong * tyLe);
    const caoMoi = Math.ceil(cao * tyLe);
    const dx = rongMoi - size;
    const dy = caoMoi - size;

    this.canvas.width = this.canvas.height = size;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Trình duyệt không tạo được canvas 2D');

    // Canvas được dùng lại giữa các khung hình nên phải trả phép biến đổi về
    // gốc, nếu không ảnh sẽ bị lật tích luỹ qua từng lần gọi.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(nguon, ~~(dx / 2) * -1, ~~(dy / 2) * -1, rongMoi, caoMoi);

    if (lat) {
      ctx.scale(-1, 1);
      ctx.drawImage(this.canvas, size * -1, 0);
    }

    return this.canvas;
  }

  /**
   * @param lat Đặt true khi dùng camera trước, để ảnh khớp với thứ học sinh
   *   nhìn thấy trên màn hình (màn hình đang soi gương).
   */
  async duDoan(nguon: NguonAnh, lat = false): Promise<DuDoan[]> {
    const canvas = this.catVuongGiua(nguon, this.thongTin.imageSize, lat);

    const ketQua = this.tf.tidy(() => {
      const diem = this.tf.browser.fromPixels(canvas).expandDims(0);
      // Chuẩn hoá giống hệt Teachable Machine: [0…255] → [-1…1] qua div(127)
      const chuanHoa = this.tf.cast(diem, 'float32').div(127).sub(1);
      return this.model.predict(chuanHoa) as TF.Tensor;
    });

    const giaTri = await ketQua.data();
    ketQua.dispose();

    return this.labels.map((label, i) => ({ label, probability: giaTri[i] }));
  }

  /** Giải phóng bộ nhớ GPU. Bắt buộc gọi khi rời trạm. */
  huy(): void {
    this.model.dispose();
  }
}
