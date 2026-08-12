import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const divRef = useRef();
  const scannerRef = useRef();

  useEffect(() => {
    const id = divRef.current;
    if (!id) return;

    const html5QrCode = new Html5Qrcode(id.id || "qr-reader");
    scannerRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            (decoded) => onScan?.(decoded),
            (error) => {
              // ignore per-frame errors
            },
          );
        }
      })
      .catch((err) => console.error("QR camera error", err));

    return () => {
      if (scannerRef.current) scannerRef.current.stop().catch(() => {});
    };
  }, [onScan]);

  return <div id="qr-reader" ref={divRef} className="w-full" />;
}
