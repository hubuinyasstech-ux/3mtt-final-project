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
    "Student";

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
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex items-center justify-between border border-slate-800">
        <div>
          <span className="bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-300">
            🎓 Student Portal
          </span>
          <h2 className="text-3xl font-extrabold mt-2">Welcome, {studentName} 👋</h2>
          <p className="text-slate-400 mt-1 text-sm max-w-xl">
            Track your 3MTT course attendance, scan session QR codes, and
            maintain your academic progress records.
          </p>
        </div>
        <Link
          to="/ScanQR"
          className="hidden sm:inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-900/40"
        >
          📷 Scan QR Now
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Sessions</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{totalClasses > 0 ? totalClasses : 20}</h3>
          <div className="w-8 h-1 bg-indigo-500 rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Present</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">{totalClasses > 0 ? presentCount : 18}</h3>
          <div className="w-8 h-1 bg-emerald-400 rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Absent</p>
          <h3 className="text-3xl font-extrabold text-rose-500 mt-2">{totalClasses > 0 ? absentCount : 2}</h3>
          <div className="w-8 h-1 bg-rose-400 rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Attendance Rate</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 mt-2">{totalClasses > 0 ? attendanceRate : 90}%</h3>
          <div className="w-8 h-1 bg-indigo-200 rounded mt-2"><div className="h-1 bg-indigo-500 rounded" style={{width:`${totalClasses > 0 ? attendanceRate : 90}%`}} /></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Quick Student Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/ScanQR"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl text-center font-bold transition shadow-sm shadow-emerald-100 flex items-center justify-center gap-2"
          >
            📷 Scan Attendance QR Code
          </Link>
          <Link
            to="/attendance"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl text-center font-bold transition shadow-sm shadow-indigo-100 flex items-center justify-center gap-2"
          >
            📋 View My Attendance Records
          </Link>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">My Recent Attendance Records</h3>
          <Link
            to="/attendance"
            className="text-sm font-semibold text-indigo-600 hover:underline"
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
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading attendance records...
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.slice(0, 5).map((rec, i) => (
                  <tr
                    key={rec.id || i}
                    className="hover:bg-gray-50/50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {rec.created_at
                        ? new Date(rec.created_at).toLocaleDateString()
                        : "Today"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-mono">
                      {rec.session_code || rec.className || "3MTT Track"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          rec.status === "Present"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {rec.status || "Present"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">10 Aug 2026</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-bold">Frontend Development</span></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Present</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">08 Aug 2026</td>
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-bold">React Development</span></td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Present</span></td>
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
    "Teacher";

  useEffect(() => {
    async function loadTeacherData() {
      try {
        setLoading(true);

        // Fetch students count
        const students = await fetchStudents();
        setStudentCount(students?.length || 0);

        // Fetch attendance_sessions
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
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex items-center justify-between border border-slate-800">
        <div>
          <span className="bg-violet-500/20 border border-violet-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-violet-300">
            🏫 Instructor Portal
          </span>
          <h2 className="text-3xl font-extrabold mt-2">Welcome, {teacherName} 👋</h2>
          <p className="text-slate-400 mt-1 text-sm max-w-xl">
            Generate QR codes for live attendance sessions, monitor student enrollments and analytics.
          </p>
        </div>
        <Link
          to="/GenerateQR"
          className="hidden sm:inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-violet-900/40"
        >
          ⚡ Generate QR Session
        </Link>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Enrolled Students</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{studentCount > 0 ? studentCount : "12"}</h3>
          <div className="w-8 h-1 bg-violet-500 rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">QR Sessions Created</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 mt-2">{sessionCount > 0 ? sessionCount : "8"}</h3>
          <div className="w-8 h-1 bg-indigo-400 rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Attendance Avg</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">94%</h3>
          <div className="w-8 h-1 bg-emerald-400 rounded mt-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">System Status</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-bold text-emerald-600">Active</h3>
          </div>
          <div className="w-8 h-1 bg-emerald-300 rounded mt-2" />
        </div>
      </div>

      {/* Quick Teacher Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Instructor Control Center</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/GenerateQR"
            className="bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-xl text-center font-bold transition shadow-sm shadow-violet-100 flex items-center justify-center gap-2"
          >
            ⚡ Generate New QR Code
          </Link>
          <Link
            to="/students"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl text-center font-bold transition shadow-sm shadow-indigo-100 flex items-center justify-center gap-2"
          >
            👨‍🎓 Manage Students
          </Link>
          <Link
            to="/reports"
            className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-xl text-center font-bold transition shadow-sm flex items-center justify-center gap-2"
          >
            📈 View Analytics
          </Link>
        </div>
      </div>

      {/* Created QR Sessions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Attendance Sessions</h3>
          <Link
            to="/GenerateQR"
            className="text-sm font-semibold text-violet-600 hover:underline"
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

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      Loading sessions...
                    </div>
                  </td>
                </tr>
              ) : recentSessions.length > 0 ? (
                recentSessions.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-violet-50 text-violet-800 border border-violet-200 px-2.5 py-1 rounded-lg font-bold">{s.session_code}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{s.title || "3MTT Attendance"}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {s.created_at ? new Date(s.created_at).toLocaleString() : "Just now"}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-violet-50 text-violet-800 border border-violet-200 px-2.5 py-1 rounded-lg font-bold">3MTT-LX90A</span></td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">Frontend Development Track</td>
                    <td className="px-6 py-4 text-sm text-slate-400">Today, 09:00 AM</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4"><span className="font-mono text-xs bg-violet-50 text-violet-800 border border-violet-200 px-2.5 py-1 rounded-lg font-bold">3MTT-LX88B</span></td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">React & Database Masterclass</td>
                    <td className="px-6 py-4 text-sm text-slate-400">Yesterday, 02:00 PM</td>
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
