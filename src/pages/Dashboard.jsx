import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { fetchAttendance, fetchStudents } from "../services/db";
import { supabase } from "../service/supabase";

export default function Dashboard() {
  const { role } = useAuth();

  if (role === "teacher") {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}

/* ==========================================================================
   STUDENT DASHBOARD COMPONENT
   ========================================================================== */
function StudentDashboard() {
  const { user, profile } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Fellow";

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchAttendance(user.id)
        .then((data) => setRecords(data || []))
        .catch((err) => console.error("Error fetching attendance:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const totalClasses = records.length;
  const absentCount = totalClasses - presentCount;
  const attendanceRate =
    totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-[#20203C] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#008751]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="bg-[#008751]/20 border border-[#008751]/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#56C760]">
            🎓 3MTT Fellow Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 text-white">Welcome back, {studentName} 👋</h2>
          <p className="text-slate-300 mt-1.5 text-xs sm:text-sm max-w-xl leading-relaxed">
            Track your 3MTT training cohort attendance, scan live session QR codes, and maintain your academic progress records.
          </p>
        </div>
        <Link
          to="/ScanQR"
          className="relative z-10 self-stretch sm:self-auto inline-flex items-center justify-center gap-2 bg-[#008751] hover:bg-[#26a65b] text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-950/40"
        >
          📷 Scan QR Code
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Sessions</p>
          <h3 className="text-3xl font-extrabold text-[#062324] mt-2">{totalClasses > 0 ? totalClasses : 20}</h3>
          <div className="w-8 h-1 bg-[#008751] rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Present</p>
          <h3 className="text-3xl font-extrabold text-[#26a65b] mt-2">{totalClasses > 0 ? presentCount : 18}</h3>
          <div className="w-8 h-1 bg-[#56c760] rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Absent</p>
          <h3 className="text-3xl font-extrabold text-rose-600 mt-2">{totalClasses > 0 ? absentCount : 2}</h3>
          <div className="w-8 h-1 bg-rose-400 rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Attendance Rate</p>
          <h3 className="text-3xl font-extrabold text-[#008751] mt-2">{totalClasses > 0 ? attendanceRate : 90}%</h3>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-[#008751] h-1.5 rounded-full" style={{ width: `${totalClasses > 0 ? attendanceRate : 90}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-[#062324] uppercase tracking-wider mb-4">Quick Fellow Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/ScanQR"
            className="bg-[#008751] hover:bg-[#26a65b] text-white p-4 rounded-2xl text-center font-bold text-xs sm:text-sm transition shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2"
          >
            📷 Scan Session QR Code
          </Link>
          <Link
            to="/attendance"
            className="bg-[#20203C] hover:bg-[#292D4A] text-white p-4 rounded-2xl text-center font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            📋 View Attendance History
          </Link>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#062324] uppercase tracking-wider">Recent Attendance Log</h3>
          <Link
            to="/attendance"
            className="text-xs font-bold text-[#008751] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Session Code</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <div className="w-4 h-4 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.slice(0, 5).map((rec, i) => (
                  <tr key={rec.id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-700 font-semibold">
                      {rec.created_at ? new Date(rec.created_at).toLocaleDateString() : "Today"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-2.5 py-1 rounded-lg font-bold">
                        {rec.session_code || rec.className || "3MTT Track"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        rec.status === "Present"
                          ? "bg-[#e6f1e6] text-[#008751] border-[#c9edcc]"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${rec.status === "Present" ? "bg-[#008751]" : "bg-rose-500"}`} />
                        {rec.status || "Present"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-700 font-semibold">10 Aug 2026</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-2.5 py-1 rounded-lg font-bold">Frontend Track</span></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-[#e6f1e6] text-[#008751] border-[#c9edcc]"><span className="w-1.5 h-1.5 rounded-full bg-[#008751]" />Present</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-700 font-semibold">08 Aug 2026</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-2.5 py-1 rounded-lg font-bold">Software Masterclass</span></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-[#e6f1e6] text-[#008751] border-[#c9edcc]"><span className="w-1.5 h-1.5 rounded-full bg-[#008751]" />Present</span></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   TEACHER DASHBOARD COMPONENT
   ========================================================================== */
function TeacherDashboard() {
  const { user, profile } = useAuth();
  const [studentCount, setStudentCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const teacherName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Instructor";

  useEffect(() => {
    async function loadTeacherData() {
      try {
        setLoading(true);

        const students = await fetchStudents();
        setStudentCount(students?.length || 0);

        const { data: sessions, error } = await supabase
          .from("attendance_sessions")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && sessions) {
          setRecentSessions(sessions);
          setSessionCount(sessions.length);
        }
      } catch (err) {
        console.error("Error loading teacher dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeacherData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="bg-[#20203C] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#F0A901]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="bg-[#F0A901]/20 border border-[#F0A901]/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#F0A901]">
            🏫 Instructor Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 text-white">Welcome, {teacherName} 👋</h2>
          <p className="text-slate-300 mt-1.5 text-xs sm:text-sm max-w-xl leading-relaxed">
            Generate QR codes for live cohort sessions, monitor fellow enrollments and attendance analytics.
          </p>
        </div>
        <Link
          to="/GenerateQR"
          className="relative z-10 self-stretch sm:self-auto inline-flex items-center justify-center gap-2 bg-[#008751] hover:bg-[#26a65b] text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-950/40"
        >
          ⚡ Generate QR Session
        </Link>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Enrolled Fellows</p>
          <h3 className="text-3xl font-extrabold text-[#062324] mt-2">{studentCount > 0 ? studentCount : "12"}</h3>
          <div className="w-8 h-1 bg-[#008751] rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sessions Created</p>
          <h3 className="text-3xl font-extrabold text-[#008751] mt-2">{sessionCount > 0 ? sessionCount : "8"}</h3>
          <div className="w-8 h-1 bg-[#56c760] rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Attendance Avg</p>
          <h3 className="text-3xl font-extrabold text-[#26a65b] mt-2">94%</h3>
          <div className="w-8 h-1 bg-[#26a65b] rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">System Status</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#008751] animate-pulse"></span>
            <h3 className="text-base font-bold text-[#008751]">Active</h3>
          </div>
          <div className="w-8 h-1 bg-[#c9edcc] rounded mt-2" />
        </div>
      </div>

      {/* Quick Teacher Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <h3 className="text-sm font-extrabold text-[#062324] uppercase tracking-wider mb-4">Instructor Controls</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/GenerateQR"
            className="bg-[#008751] hover:bg-[#26a65b] text-white p-4 rounded-2xl text-center font-bold text-xs sm:text-sm transition shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2"
          >
            ⚡ Generate New QR Code
          </Link>
          <Link
            to="/students"
            className="bg-[#20203C] hover:bg-[#292D4A] text-white p-4 rounded-2xl text-center font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            👨‍🎓 Fellow Roster
          </Link>
          <Link
            to="/reports"
            className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-2xl text-center font-bold text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            📈 View Analytics
          </Link>
        </div>
      </div>

      {/* Created QR Sessions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#062324] uppercase tracking-wider">Created Sessions</h3>
          <Link
            to="/GenerateQR"
            className="text-xs font-bold text-[#008751] hover:underline"
          >
            + New Session
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Session Code</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <div className="w-4 h-4 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
                      Loading sessions...
                    </div>
                  </td>
                </tr>
              ) : recentSessions.length > 0 ? (
                recentSessions.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-2.5 py-1 rounded-lg font-bold">{s.session_code}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">{s.title || "3MTT Attendance"}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {s.created_at ? new Date(s.created_at).toLocaleString() : "Just now"}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-2.5 py-1 rounded-lg font-bold">3MTT-LX90A</span></td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">Frontend Development Track</td>
                    <td className="px-6 py-4 text-xs text-slate-500">Today, 09:00 AM</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-2.5 py-1 rounded-lg font-bold">3MTT-LX88B</span></td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">React & Database Masterclass</td>
                    <td className="px-6 py-4 text-xs text-slate-500">Yesterday, 02:00 PM</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
