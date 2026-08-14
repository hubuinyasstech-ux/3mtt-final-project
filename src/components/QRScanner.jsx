import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const divRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);
  const [cameraError, setCameraError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!mounted) return;

        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back/rear camera for scanning QR codes
          const rearIndex = devices.findIndex((d) =>
            /back|rear|environment/i.test(d.label)
          );
          setActiveCameraIndex(rearIndex !== -1 ? rearIndex : 0);
        } else {
          setCameraError("No camera found on this device.");
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Camera access error:", err);
        setCameraError(
          "Camera permission denied or camera not accessible. Please enable camera access in your browser settings."
        );
      }
    }

    initCamera();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!cameras.length || !divRef.current) return;

    const elementId = "qr-reader-target";
    const selectedCamera = cameras[activeCameraIndex];
    if (!selectedCamera) return;

    const html5QrCode = new Html5Qrcode(elementId);
    scannerInstanceRef.current = html5QrCode;

    const qrConfig = {
      fps: 10,
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdge * 0.7);
        return { width: qrboxSize, height: qrboxSize };
      },
      aspectRatio: 1.0,
    };

    html5QrCode
      .start(
        selectedCamera.id,
        qrConfig,
        (decodedText) => {
          if (onScan) onScan(decodedText);
        },
        () => {
          // Ignore individual frame parse errors
        }
      )
      .then(() => {
        setIsScanning(true);
        setCameraError("");
      })
      .catch((err) => {
        console.error("Error starting QR scanner:", err);
        setIsScanning(false);
        setCameraError("Failed to start camera feed: " + (err?.message || err));
      });

    return () => {
      if (scannerInstanceRef.current) {
        if (scannerInstanceRef.current.isScanning) {
          scannerInstanceRef.current
            .stop()
            .then(() => scannerInstanceRef.current?.clear())
            .catch((e) => console.warn("Failed to stop scanner gracefully:", e));
        } else {
          try {
            scannerInstanceRef.current.clear();
          } catch (e) {}
        }
      }
    };
  }, [cameras, activeCameraIndex, onScan]);

  const handleSwitchCamera = () => {
    if (cameras.length <= 1) return;
    const nextIndex = (activeCameraIndex + 1) % cameras.length;
    setActiveCameraIndex(nextIndex);
  };

  return (
    <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800">
      {cameraError ? (
        <div className="p-8 text-center text-slate-300 flex flex-col items-center justify-center min-h-[280px]">
          <div className="text-4xl mb-3">📷⚠️</div>
          <p className="text-sm font-medium text-rose-400 mb-2">Camera Unavailable</p>
          <p className="text-xs text-slate-400 max-w-xs">{cameraError}</p>
        </div>
      ) : (
        <>
          <div
            id="qr-reader-target"
            ref={divRef}
            className="w-full min-h-[280px] sm:min-h-[320px] bg-slate-950 flex items-center justify-center"
          />

          {/* Controls & Camera Info Overlay */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-700/60 font-medium flex items-center gap-1.5 shadow">
              <span className={`w-2 h-2 rounded-full ${isScanning ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              {cameras[activeCameraIndex]?.label
                ? cameras[activeCameraIndex].label.length > 22
                  ? cameras[activeCameraIndex].label.substring(0, 20) + "..."
                  : cameras[activeCameraIndex].label
                : "Camera Active"}
            </span>

            {cameras.length > 1 && (
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 border border-indigo-400/30"
              >
                🔄 Switch Camera ({activeCameraIndex + 1}/{cameras.length})
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
