import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Sidebar() {
  const { role } = useAuth();

  const studentLinks = [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/ScanQR", icon: "📷", label: "Scan QR Code" },
    { to: "/attendance", icon: "📋", label: "My Attendance" },
  ];

  const teacherLinks = [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/GenerateQR", icon: "⚡", label: "Generate QR Code" },
    { to: "/students", icon: "👨‍🎓", label: "Manage Students" },
    { to: "/attendance", icon: "📋", label: "Attendance Records" },
    { to: "/teachers", icon: "👨‍🏫", label: "Teacher Roster" },
    { to: "/reports", icon: "📈", label: "Reports & Analytics" },
  ];

  const activeLinks = role === "teacher" ? teacherLinks : studentLinks;

  const accentActive =
    role === "teacher"
      ? "bg-violet-600 text-white shadow-sm shadow-violet-900/40"
      : "bg-indigo-600 text-white shadow-sm shadow-indigo-900/40";

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-700/50 p-4 min-h-[calc(100vh-56px)] shadow-md flex flex-col">
      {/* Portal Label */}
      <div className="mb-5 px-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            role === "teacher"
              ? "bg-violet-500/15 text-violet-400 border border-violet-500/25"
              : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
          }`}
        >
          {role === "teacher" ? "🏫 Instructor Portal" : "🎓 Student Portal"}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {activeLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? accentActive
                  : "text-slate-400 hover:bg-slate-700/60 hover:text-slate-100"
              }`
            }
          >
            <span className="text-base">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom divider */}
      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <p className="text-[10px] text-slate-500 px-3">3MTT Attendance v1.0</p>
      </div>
    </aside>
  );
}
