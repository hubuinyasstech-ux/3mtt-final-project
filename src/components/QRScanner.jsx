import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const divRef = useRef();
  const scannerRef = useRef();
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  useEffect(() => {
    const id = divRef.current;
    if (!id) return;

    const html5QrCode = new Html5Qrcode(id.id || "qr-reader");
    scannerRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          const rear = devices.find((d) => /back|rear/i.test(d.label));
          const defaultId = rear ? rear.id : devices[0].id;
          setSelectedCameraId(defaultId);
        }
      })
      .catch((err) => console.error("QR camera error", err));

  // Start scanner when selectedCameraId is set
  useEffect(() => {
    if (!selectedCameraId) return;
    const html5QrCode = new Html5Qrcode(divRef.current.id || "qr-reader");
    scannerRef.current = html5QrCode;
    html5QrCode
      .start(selectedCameraId, { fps: 10, qrbox: 250 },
        (decoded) => onScan?.(decoded),
        (error) => { /* ignore per-frame errors */ }
      )
      .catch((err) => console.error("QR start error", err));
    return () => {
      if (scannerRef.current) scannerRef.current.stop().catch(() => {});
    };
  }, [selectedCameraId, onScan]);

  return (
<div id="qr-reader" ref={divRef} className="relative w-full">
      {/* Camera toggle button */}
      {cameras.length > 1 && (
        <button
          onClick={() => {
            const currentIdx = cameras.findIndex((c) => c.id === selectedCameraId);
            const nextIdx = (currentIdx + 1) % cameras.length;
            setSelectedCameraId(cameras[nextIdx].id);
          }}
          className="absolute top-2 right-2 bg-white/70 text-slate-800 px-3 py-1 rounded-md text-sm hover:bg-white transition"
        >
          Switch Camera
        </button>
      )}
    </div>
  );
}
