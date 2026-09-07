import { useEffect, useRef, useState } from 'react';

/**
 * Mở luồng camera và gắn vào một thẻ <video>.
 *
 * Điểm quan trọng: luồng phải được tắt kể cả khi người dùng rời trạm trong lúc
 * trình duyệt còn đang hỏi quyền — nếu không, đèn camera của máy tính bảng vẫn
 * sáng cho tới khi đóng tab.
 *
 * @param bat      Có mở camera hay không
 * @param truoc    true = camera trước (tự sướng), false = camera sau
 * @param onLoi    Gọi khi không mở được, để component tự tắt công tắc
 */
export function useCamera(bat: boolean, truoc: boolean, onLoi?: () => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const onLoiRef = useRef(onLoi);

  // Giữ callback mới nhất mà không đưa nó vào deps, tránh mở lại camera mỗi lần
  // component render lại với một hàm mới.
  useEffect(() => {
    onLoiRef.current = onLoi;
  });

  useEffect(() => {
    if (!bat) {
      setLoi(null);
      return;
    }

    let huy = false;
    let stream: MediaStream | null = null;

    const dung = () => {
      stream?.getTracks().forEach((t) => t.stop());
      stream = null;
    };

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: truoc ? 'user' : 'environment' } })
      .then((s) => {
        stream = s;
        if (huy) {
          dung();
          return;
        }
        setLoi(null);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch((err: unknown) => {
        if (huy) return;
        const ten = err instanceof Error ? err.name : '';
        setLoi(
          ten === 'NotAllowedError'
            ? 'Em chưa cho phép dùng camera. Hãy bấm vào biểu tượng ổ khoá trên thanh địa chỉ và chọn "Cho phép".'
            : ten === 'NotFoundError'
              ? 'Máy này không tìm thấy camera nào.'
              : 'Không mở được camera. Trang phải chạy trên HTTPS thì trình duyệt mới cho phép.',
        );
        onLoiRef.current?.();
      });

    return () => {
      huy = true;
      dung();
    };
  }, [bat, truoc]);

  return { videoRef, loi };
}
