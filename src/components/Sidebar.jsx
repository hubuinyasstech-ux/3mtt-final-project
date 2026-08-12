import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Sidebar() {
  const { role } = useAuth();

  const studentLinks = [
    { to: "/dashboard", label: "📊 Dashboard" },
    { to: "/ScanQR", label: "📷 Scan QR Code" },
    { to: "/attendance", label: "📋 My Attendance" },
  ];

  const teacherLinks = [
    { to: "/dashboard", label: "📊 Teacher Dashboard" },
    { to: "/GenerateQR", label: "⚡ Generate QR Code" },
    { to: "/students", label: "👨‍🎓 Manage Students" },
    { to: "/attendance", label: "📋 Attendance Records" },
    { to: "/teachers", label: "👨‍🏫 Teacher Roster" },
    { to: "/reports", label: "📈 Reports & Analytics" },
  ];

  const activeLinks = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <aside className="w-60 bg-white border-r p-4 min-h-[calc(100vh-56px)] shadow-sm">
      <div className="mb-4 px-3 text-xs font-semibold uppercase text-gray-400">
        {role === "teacher" ? "Teacher Portal" : "Student Portal"}
      </div>
      <nav className="flex flex-col gap-1.5">
        {activeLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? role === "teacher"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
