import { useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function GenerateQR() {
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSession = async () => {
    setLoading(true);
    setError("");
    setSessionId("");

    try {
      const newSessionCode = "3MTT-" + Date.now().toString(36).toUpperCase();

      const { data, error: dbError } = await supabase
        .from("attendance_sessions")
        .insert([
          {
            session_code: newSessionCode,
            title: "3MTT Attendance",
          },
        ])
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setSessionId(data.session_code);
    } catch (err) {
      console.error("QR session error:", err);
      setError(err.message || "Unable to create attendance session.");
    } finally {
      setLoading(false);
    }
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
            Generate a unique QR code for an attendance session.
          </p>

          {/* Generate Button */}
          <button
            onClick={generateSession}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Session..." : "Generate QR Code"}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg text-left">
              <p className="font-semibold">Error creating attendance session</p>

              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {/* QR Code */}
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

              <p className="text-sm text-green-600 mt-4">
                Attendance session created successfully.
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Students can now scan this QR code.
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
