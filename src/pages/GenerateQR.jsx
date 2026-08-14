import { useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function GenerateQR() {
  const [title, setTitle] = useState("3MTT Cohort Session");
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
      <header className="bg-[#20203C] border-b border-slate-700/50 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1.5 bg-[#008751] rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md border border-emerald-400/20">
              3MTT
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">3MTT QR Generator</h1>
              <p className="text-slate-300 text-xs mt-0.5">Instructor Session Management</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-xl font-medium text-xs transition"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 text-center">
          <span className="bg-[#F0A901]/20 text-[#F0A901] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[#F0A901]/30">
            Instructor Tools
          </span>

          <h2 className="text-2xl font-extrabold text-[#062324] mt-3">
            Generate Session QR Code
          </h2>

          <p className="text-slate-500 mt-1 mb-6 text-xs sm:text-sm">
            Create an official 3MTT attendance session. Display this QR code on screen or print it for fellows to scan.
          </p>

          <form onSubmit={generateSession} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Course / Session Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Development - Week 4"
                className="w-full border border-slate-200 bg-white p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-xs sm:text-sm placeholder-slate-400 shadow-sm transition"
                required
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-[#008751] hover:bg-[#26a65b] shadow-emerald-950/20"
              }`}
            >
              {loading ? "Creating Session..." : "⚡ Generate Session QR Code"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-left flex gap-2.5 text-xs sm:text-sm">
              <span className="mt-0.5">⚠️</span>
              <div>
                <p className="font-bold">Error creating session</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Generated QR Code Display */}
          {sessionId && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="inline-block bg-white p-6 border-2 border-[#c9edcc] rounded-3xl shadow-sm">
                <QRCode value={qrPayload} size={220} />
              </div>

              <h3 className="font-extrabold text-[#062324] mt-5 text-base sm:text-lg">
                Active Session: {title}
              </h3>

              <div className="inline-flex items-center gap-2 bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-4 py-2 rounded-xl mt-3 font-mono font-bold text-xs sm:text-sm">
                <span className="text-slate-500">Session Code:</span>
                <span className="text-[#008751]">{sessionId}</span>
              </div>

              <p className="text-xs sm:text-sm text-[#008751] font-bold mt-4 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008751] animate-pulse"></span>
                Live Session Ready for Scanning
              </p>

              <p className="text-xs text-slate-500 mt-1">
                3MTT fellows scan this QR code using their camera on the Scan QR page to mark attendance.
              </p>
            </div>
          )}

          <Link
            to="/attendance"
            className="block mt-6 text-[#008751] font-bold hover:underline text-xs sm:text-sm"
          >
            ← View Global Attendance Records
          </Link>
        </div>
      </main>
    </div>
  );
}
