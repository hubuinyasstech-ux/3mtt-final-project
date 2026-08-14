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

  return (
    <aside className="w-60 bg-[#20203C] border-r border-slate-700/50 p-4 min-h-[calc(100vh-57px)] shadow-lg flex flex-col">
      {/* Portal Label */}
      <div className="mb-5 px-3">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block ${
            role === "teacher"
              ? "bg-[#F0A901]/20 text-[#F0A901] border border-[#F0A901]/30"
              : "bg-[#008751]/20 text-[#56C760] border border-[#008751]/30"
          }`}
        >
          {role === "teacher" ? "🏫 Instructor Portal" : "🎓 Fellow Portal"}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1.5">
        {activeLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#008751] text-white shadow-md shadow-emerald-950/40 border border-emerald-400/20"
                  : "text-slate-300 hover:bg-[#292D4A] hover:text-white"
              }`
            }
          >
            <span className="text-base">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom info */}
      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <p className="text-[10px] text-slate-400 px-3 font-medium">3MTT Attendance System</p>
      </div>
    </aside>
  );
}
