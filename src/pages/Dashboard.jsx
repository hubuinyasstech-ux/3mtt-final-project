import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">3MTT QR Attendance</h1>
          <p className="text-blue-100 text-sm">Student Dashboard</p>
        </div>
        <button
          onClick={() => alert("Logout will b connected to Supabasse later.")}
          className="bg-white text-blue-700 px-4 py-2 rounded-lg
         font-medium hover:bg-blue-50"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xlmmx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome, Student 👋
          </h2>
          <p className="text-gray-500 mt-2">
            Manage your 3MTT attendance from your dashboard. Scan QR codes, view
            your attendance history, and stay updated with your classes.
          </p>
        </div>

        {/* Statistics  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Classes */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Classes</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">20</h3>
          </div>

          {/* Present */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm"> Present</p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">18</h3>
          </div>

          {/* Absent */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Absent</p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">2</h3>
          </div>

          {/* Attendance Rate */}
          <div className=" bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Attendance Rate</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-2"> 90%</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Quick Action</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="./Attendance.jsx"
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center font-medium transition"
            >
              View Attendance
            </Link>

            <Link
              to="/scan"
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-medium transition text-center"
            >
              Scan QR Code
            </Link>
          </div>
        </div>

        {/* Recent Attandence */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {" "}
              Recent Attendance
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
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
                <tr className="border-t">
                  <td className="px-6 py-4">10 Aug 2026</td>
                  <td className="px-6 py-4">Frontend Development</td>
                  <td className="px-6 py-4">09:00 AM</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Present
                    </span>
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="px-6 py-4 ">08 Aug 2026</td>
                  <td className="px-6 py-4">React Development</td>
                  <td className="px-6 py-4">09:00 AM</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Present
                    </span>
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="px-6 py-4"> 06 Aug 2026</td>
                  <td className="px-6 py-4 ">JavaScript</td>
                  <td className="px-6 py-4">09:00 AM</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium ">
                      Absent
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
