import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.full_name || user?.email;
  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="bg-[#20203C] border-b border-slate-700/60 px-6 py-3.5 flex items-center justify-between shadow-md">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1.5 bg-[#008751] rounded-xl flex items-center justify-center text-white text-xs font-extrabold shadow-md border border-emerald-400/20">
            3MTT
          </div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-tight leading-none flex items-center gap-1.5">
              3MTT <span className="text-[#F0A901] text-xs font-semibold">Nigeria</span>
            </div>
            <div className="text-slate-300 text-xs font-medium leading-none mt-1">
              QR Attendance Portal
            </div>
          </div>
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#008751] text-white flex items-center justify-center text-xs font-extrabold shadow-sm border border-emerald-400/30">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-slate-100 text-xs font-bold leading-none">
                  {displayName}
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5 capitalize">
                  {role || "Student"}
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  role === "teacher"
                    ? "bg-[#F0A901]/20 text-[#F0A901] border border-[#F0A901]/30"
                    : "bg-[#008751]/20 text-[#56C760] border border-[#008751]/40"
                }`}
              >
                {role === "teacher" ? "Instructor" : "Fellow"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-slate-800/90 hover:bg-rose-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 border border-slate-700 hover:border-rose-500/50"
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="text-slate-400 text-xs font-medium">Not signed in</div>
        )}
      </div>
    </header>
  );
}
