import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { fetchAttendance } from "../services/db";
import { supabase } from "../service/supabase";

export default function Attendance() {
  const { user, role } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        if (role === "teacher") {
          const { data, error } = await supabase
            .from("attendance")
            .select("*")
            .order("created_at", { ascending: false });
          if (!error && data) setRecords(data);
        } else {
          const data = await fetchAttendance(user.id);
          setRecords(data || []);
        }
      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, role]);

  const defaultRecords = [
    {
      id: "demo-1",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      session_code: "3MTT-DEV-01",
      status: "Present",
    },
    {
      id: "demo-2",
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      session_code: "3MTT-DEV-02",
      status: "Present",
    },
    {
      id: "demo-3",
      created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      session_code: "3MTT-DEV-03",
      status: "Absent",
    },
  ];

  const displayRecords = records.length > 0 ? records : defaultRecords;
  const presentCount = displayRecords.filter((r) => r.status === "Present").length;
  const absentCount = displayRecords.filter((r) => r.status === "Absent").length;
  const totalClasses = displayRecords.length;
  const attendanceRate =
    totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  const isTeacher = role === "teacher";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top header bar */}
      <header className="bg-[#20203C] text-white px-6 py-4 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white">
              {isTeacher ? "Global Attendance Logs" : "My Attendance Records"}
            </h1>
            <p className="text-slate-300 text-xs mt-0.5">
              {isTeacher
                ? "Global attendance log across all 3MTT QR sessions"
                : "Your personal cohort attendance history"}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl font-medium text-xs transition border border-slate-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Page title */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#062324]">
            {isTeacher ? "Fellow Attendance History" : "My Course Attendance"}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {isTeacher
              ? "Monitor live attendance logs recorded across all QR sessions."
              : "View your scanned sessions and overall attendance completion rate."}
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Sessions</p>
            <h3 className="text-3xl font-extrabold text-[#062324] mt-2">
              {totalClasses}
            </h3>
            <div className="w-8 h-1 bg-[#008751] rounded mt-2" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Present</p>
            <h3 className="text-3xl font-extrabold text-[#26a65b] mt-2">
              {presentCount}
            </h3>
            <div className="w-8 h-1 bg-[#56c760] rounded mt-2" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Absent</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-2">
              {absentCount}
            </h3>
            <div className="w-8 h-1 bg-rose-400 rounded mt-2" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-3xl font-extrabold text-[#008751] mt-2">
              {attendanceRate}%
            </h3>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div className="bg-[#008751] h-1.5 rounded-full" style={{ width: `${attendanceRate}%` }} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#062324] uppercase tracking-wider">
                Attendance Records Log
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                {displayRecords.length} record{displayRecords.length !== 1 ? "s" : ""} recorded
              </p>
            </div>
            {!isTeacher && (
              <Link
                to="/ScanQR"
                className="bg-[#008751] hover:bg-[#26a65b] text-white px-4 py-2 rounded-xl font-bold text-xs transition shadow-md shadow-emerald-950/10"
              >
                + Scan QR Code
              </Link>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    #
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Date & Time
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Session Code
                  </th>
                  {isTeacher && (
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Fellow ID
                    </th>
                  )}
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <div className="w-4 h-4 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
                        Loading attendance records...
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayRecords.map((record, index) => (
                    <tr
                      key={record.id || index}
                      className="hover:bg-slate-50/80 transition-colors duration-100"
                    >
                      <td className="px-6 py-4 text-xs text-slate-400 font-semibold">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-700 font-semibold">
                        {record.created_at
                          ? new Date(record.created_at).toLocaleString()
                          : "Recently"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-[#e6f1e6] text-[#008751] border border-[#c9edcc] px-2.5 py-1 rounded-lg font-bold">
                          {record.session_code || "3MTT-TRACK"}
                        </span>
                      </td>
                      {isTeacher && (
                        <td className="px-6 py-4 text-xs font-mono text-slate-500 max-w-xs truncate">
                          {record.student_id || "Fellow"}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            record.status === "Present"
                              ? "bg-[#e6f1e6] text-[#008751] border-[#c9edcc]"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              record.status === "Present"
                                ? "bg-[#008751]"
                                : "bg-rose-500"
                            }`}
                          />
                          {record.status || "Present"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
