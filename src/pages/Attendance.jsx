import { Link } from "react-router-dom";

export default function Attendance() {
  const attendanceRecords = [
    {
      id: 1,
      date: "10 Aug 2026",
      className: "Frontend Development",
      time: "09:00 AM",
      status: "Present",
    },
    {
      id: 2,
      date: "08 Aug 2026",
      className: "React Development",
      time: "09:00 AM",
      status: "Present",
    },
    {
      id: 3,
      date: "06 Aug 2026",
      className: "JavaScript",
      time: "09:00 AM",
      status: "Absent",
    },
    {
      id: 4,
      date: "04 Aug 2026",
      className: "HTML & CSS",
      time: "09:00 AM",
      status: "Present",
    },
  ];

  const presentCount = attendanceRecords.filter(
    (record) => record.status === "Present",
  ).length;

  const absentCount = attendanceRecords.filter(
    (record) => record.status === "Absent",
  ).length;

  const totalClasses = attendanceRecords.length;

  const attendanceRate =
    totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">3MTT QR Attendance</h1>

            <p className="text-blue-100 text-sm">Attendance Records</p>
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
          <h2 className="text-3xl font-bold text-gray-800">My Attendance</h2>

          <p className="text-gray-500 mt-2">
            View your attendance history and attendance rate.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Classes</p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {totalClasses}
            </h3>
          </div>

          {/* Present */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Present</p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
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
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">
              Attendance History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    #
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Class
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Time
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={record.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{index + 1}</td>

                    <td className="px-6 py-4 text-gray-700">{record.date}</td>

                    <td className="px-6 py-4 text-gray-700">
                      {record.className}
                    </td>

                    <td className="px-6 py-4 text-gray-700">{record.time}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
