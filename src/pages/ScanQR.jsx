import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanQR() {
  const scannerRef = useRef(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          (decodedText) => {
            setResult(decodedText);
            setError("");

            scanner
              .stop()
              .catch((err) => console.error("Scanner stop error:", err));
          },
          () => {
            // Ignore QR scanning errors while searching for a code.
          },
        );
      } catch (err) {
        console.error("Scanner error:", err);
        setError(
          "Unable to access the camera. Please allow camera permission and try again.",
        );
      }
    };

    startScanner();

    return () => {
      if (scanner.isScanning) {
        scanner
          .stop()
          .catch((err) => console.error("Scanner cleanup error:", err));
      }
    };
  }, []);

  const scanAgain = async () => {
    setResult("");
    setError("");

    const scanner = scannerRef.current;

    if (!scanner) return;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        (decodedText) => {
          setResult(decodedText);
          setError("");

          scanner
            .stop()
            .catch((err) => console.error("Scanner stop error:", err));
        },
        () => {},
      );
    } catch (err) {
      console.error(err);
      setError("Unable to restart the scanner.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">3MTT QR Attendance</h1>

            <p className="text-blue-100 text-sm">QR Code Scanner</p>
          </div>

          <Link
            to="/dashboard"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Scan Attendance QR Code
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-6">
            Point your camera at the QR code provided by your instructor.
          </p>

          {/* QR Scanner */}
          <div
            id="qr-reader"
            className="w-full overflow-hidden rounded-lg"
          ></div>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Successful Scan */}
          {result && (
            <div className="mt-5 bg-green-100 border border-green-300 rounded-lg p-5">
              <h3 className="font-bold text-green-700 text-lg">
                QR Code Scanned Successfully!
              </h3>

              <p className="text-gray-700 mt-2">QR Code:</p>

              <p className="bg-white p-3 rounded mt-2 break-all">{result}</p>

              <button
                onClick={scanAgain}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                Scan Again
              </button>
            </div>
          )}

          {/* Back */}
          <Link
            to="/attendance"
            className="block text-center mt-6 text-blue-600 hover:underline"
          >
            ← Back to Attendance
          </Link>
        </div>
      </main>
    </div>
  );
}
