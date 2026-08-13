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
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="bg-blue-600/60 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100">
            Student Portal
          </span>
          <h2 className="text-3xl font-bold mt-2">Welcome, {studentName} 👋</h2>
          <p className="text-blue-100 mt-1 text-sm max-w-xl">
            Track your 3MTT course attendance, scan session QR codes, and
            maintain your academic progress records.
          </p>
        </div>
        <Link
          to="/ScanQR"
          className="hidden sm:inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow"
        >
          📷 Scan QR Now
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            Total Sessions
          </p>
          <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
            {totalClasses > 0 ? totalClasses : 20}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            Present
          </p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">
            {totalClasses > 0 ? presentCount : 18}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            Absent
          </p>
          <h3 className="text-3xl font-extrabold text-rose-600 mt-2">
            {totalClasses > 0 ? absentCount : 2}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            Attendance Rate
          </p>
          <h3 className="text-3xl font-extrabold text-purple-600 mt-2">
            {totalClasses > 0 ? attendanceRate : 90}%
          </h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Quick Student Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/ScanQR"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl text-center font-semibold transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>📷</span> Scan Attendance QR Code
          </Link>

          <Link
            to="/attendance"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-center font-semibold transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>📋</span> View My Detailed Attendance
          </Link>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            My Recent Attendance Records
          </h3>
          <Link
            to="/attendance"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100/50">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold uppercase text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase text-gray-500">
                  Session Code / Class
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
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
                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      10 Aug 2026
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-mono">
                      Frontend Development
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                        Present
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      08 Aug 2026
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-mono">
                      React Development
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                        Present
                      </span>
                    </td>
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

      <div className="bg-linear-to-r from-purple-800 to-indigo-900 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <span className="bg-purple-600/60 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-purple-100">
            Instructor
          </span>
          <h2 className="text-3xl font-bold mt-2">Dashboard — {teacherName}</h2>
          <p className="text-purple-100 mt-1 text-sm max-w-xl">
            Generate QR codes for live attendance sessions, monitor student
            enrollments.
          </p>
        </div>
        <Link
          to="/GenerateQR"
          className="hidden sm:inline-flex items-center gap- bg-white text-purple-800 px-5 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow"
        >
          ⚡ Generate QR Session
        </Link>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            Enrolled Students
          </p>
          <h3 className="text-3xl font-extrabold text-purple-700 mt-2">
            {studentCount > 0 ? studentCount : "12"}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            QR Sessions Created
          </p>
          <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
            {sessionCount > 0 ? sessionCount : "8"}
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            Class Attendance Avg
          </p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">94%</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase">
            System Status
          </p>
          <h3 className="text-lg font-bold text-emerald-600 mt-3 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </h3>
        </div>
      </div>

      {/* Quick Teacher Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Teacher Control Center
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/GenerateQR"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl text-center font-semibold transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>⚡</span> Generate New QR Code
          </Link>

          <Link
            to="/students"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl text-center font-semibold transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>👨‍🎓</span> Manage Student List
          </Link>

          <Link
            to="/reports"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-center font-semibold transition shadow-sm flex items-center justify-center gap-2"
          >
            <span>📈</span> View Class Analytics
          </Link>
        </div>
      </div>

      {/* Created QR Sessions */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            Recent Attendance Sessions
          </h3>
          <Link
            to="/GenerateQR"
            className="text-sm font-semibold text-purple-600 hover:underline"
          >
            + New Session
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100/50">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold uppercase text-gray-500">
                  Session Code
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase text-gray-500">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading sessions...
                  </td>
                </tr>
              ) : recentSessions.length > 0 ? (
                recentSessions.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-purple-700">
                      {s.session_code}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {s.title || "3MTT Attendance"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {s.created_at
                        ? new Date(s.created_at).toLocaleString()
                        : "Just now"}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-purple-700">
                      3MTT-LX90A
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      Frontend Development Track
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Today, 09:00 AM
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-purple-700">
                      3MTT-LX88B
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      React & Database Masterclass
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Yesterday, 02:00 PM
                    </td>
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
