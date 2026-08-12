import React from "react";
import { Link } from "react-router-dom";
import QRScanner from "../components/QRScanner";
import { recordAttendance } from "../services/db";

export default function ScanQR() {
  const [last, setLast] = React.useState(null);

  const handleScan = async (decoded) => {
    setLast(decoded);
    try {
      await recordAttendance({ student_id: decoded, status: "Present" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">3MTT QR Attendance</h1>

          <Link
            to="/dashboard"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>

          <QRScanner onScan={handleScan} />

          {last && (
            <div className="mt-4 text-sm text-gray-700">Last: {last}</div>
          )}
        </div>
      </main>
    </div>
  );
}
