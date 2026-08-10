import { useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";

export default function GenerateQR() {
  const [sessionId, setSessionId] = useState("");

  const generateSession = () => {
    const newSessionId = "3MTT-" + Date.now().toString(36).toUpperCase();

    setSessionId(newSessionId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">3MTT QR Attendance</h1>

            <p className="text-blue-100 text-sm">Attendance QR Generator</p>
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
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Generate Attendance QR Code
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Generate a unique QR code for today's attendance session.
          </p>

          <button
            onClick={generateSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Generate QR Code
          </button>

          {sessionId && (
            <div className="mt-8">
              <div className="flex justify-center">
                <div className="bg-white p-5 border rounded-lg">
                  <QRCode value={sessionId} size={250} />
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mt-6">
                Attendance Session
              </h3>

              <p className="bg-gray-100 p-3 rounded-lg mt-2 break-all">
                {sessionId}
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Students can now scan this QR code to mark their attendance.
              </p>
            </div>
          )}

          <Link
            to="/attendance"
            className="block mt-6 text-blue-600 hover:underline"
          >
            ← Back to Attendance
          </Link>
        </div>
      </main>
    </div>
  );
}
