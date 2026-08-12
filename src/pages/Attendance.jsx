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
          // Teacher sees all attendance logs
          const { data, error } = await supabase
            .from("attendance")
            .select("*")
            .order("created_at", { ascending: false });
          if (!error && data) {
            setRecords(data);
          }
        } else {
          // Student sees their own attendance
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

  const presentCount = displayRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = displayRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const totalClasses = displayRecords.length;

  const attendanceRate =
    totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">3MTT QR Attendance</h1>

            <p className="text-blue-100 text-sm">
              {role === "teacher"
                ? "Global Attendance Log & Records"
                : "My Attendance History"}
            </p>
          </div>

          <Link
            to="/dashboard"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {role === "teacher" ? "All Student Attendance Logs" : "My Attendance"}
          </h2>

          <p className="text-gray-500 mt-2">
            {role === "teacher"
              ? "Monitor and review live attendance logs recorded across all QR sessions."
              : "View your attendance history, scanned sessions, and overall attendance rate."}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Sessions</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {totalClasses}
            </h3>
          </div>

          {/* Present */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Present</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">
              {presentCount}
            </h3>
          </div>

          {/* Absent */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Absent</p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">
              {absentCount}
            </h3>
          </div>

          {/* Rate */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Attendance Rate</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {attendanceRate}%
            </h3>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              Attendance Records Log
            </h3>
            {role === "student" && (
              <Link
                to="/ScanQR"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
              >
                + Scan QR Code
              </Link>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    #
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Session Code
                  </th>
                  {role === "teacher" && (
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Student ID
                    </th>
                  )}
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : (
                  displayRecords.map((record, index) => (
                    <tr key={record.id || index} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {record.created_at
                          ? new Date(record.created_at).toLocaleString()
                          : "Recently"}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-mono font-bold">
                        {record.session_code || "3MTT-TRACK"}
                      </td>
                      {role === "teacher" && (
                        <td className="px-6 py-4 text-gray-700 font-mono text-sm">
                          {record.student_id || "Student"}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === "Present"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
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
