import { useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function GenerateQR() {
  const [title, setTitle] = useState("3MTT Class Session");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSession = async (e) => {
    e?.preventDefault();
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
            title: title.trim() || "3MTT Attendance Session",
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
      setError(err.message || "Unable to create attendance session in database.");
    } finally {
      setLoading(false);
    }
  };

  const qrPayload = JSON.stringify({
    session_code: sessionId,
    title: title || "3MTT Class",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700/50 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">3MTT QR Attendance</h1>
            <p className="text-slate-400 text-xs mt-0.5">Instructor QR Generator</p>
          </div>
          <Link
            to="/dashboard"
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg font-medium text-sm transition border border-slate-600"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
          <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-violet-200">
            Teacher Session Tools
          </span>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Generate Session QR Code
          </h2>

          <p className="text-slate-500 mt-1 mb-6 text-sm">
            Create an official attendance session. Display this QR code on screen or print it for students to scan.
          </p>

          <form onSubmit={generateSession} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course / Session Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Web Development - Week 4"
              className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400 shadow-sm transition"
                required
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-md ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
              }`}
            >
              {loading ? "Creating Session..." : "⚡ Generate QR Code"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-left flex gap-2.5 text-sm">
              <span>⚠️</span>
              <div>
                <p className="font-semibold">Error creating attendance session</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Generated QR Code Display */}
          {sessionId && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="inline-block bg-white p-6 border-2 border-indigo-100 rounded-2xl shadow-sm">
                <QRCode value={qrPayload} size={240} />
              </div>

              <h3 className="font-bold text-gray-800 mt-5 text-lg">
                Active Session: {title}
              </h3>

              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-900 border border-indigo-200 px-4 py-2 rounded-xl mt-3 font-mono font-bold text-sm">
                <span className="text-slate-500">Code:</span>
                <span className="text-indigo-700">{sessionId}</span>
              </div>

              <p className="text-sm text-emerald-600 font-semibold mt-4 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Session Ready for Student Scans
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Students scan this QR code using their phone camera on the Scan QR page to mark attendance.
              </p>
            </div>
          )}

          <Link
            to="/attendance"
            className="block mt-6 text-indigo-600 font-semibold hover:underline text-sm"
          >
            ← View Attendance Log Records
          </Link>
        </div>
      </main>
    </div>
  );
}
