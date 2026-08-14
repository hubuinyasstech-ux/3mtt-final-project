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
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="bg-slate-900 border-b border-slate-700/60 px-6 py-3 flex items-center justify-between shadow-md">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow">
            3mtt
          </div>
          <div>
            <div className="text-white font-extrabold text-sm tracking-tight leading-none">
              3MTT
            </div>
            <div className="text-slate-400 text-xs font-medium leading-none mt-0.5">
              QR Attendance
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* User info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-slate-200 text-xs font-semibold leading-none">
                  {displayName}
                </div>
                <div className="text-slate-400 text-xs mt-0.5 capitalize">
                  {role || "user"}
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                  role === "teacher"
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                }`}
              >
                {role === "teacher" ? "Instructor" : "Student"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-700 hover:bg-red-600/80 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all duration-200 border border-slate-600 hover:border-red-500/50"
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="text-slate-400 text-sm">Not signed in</div>
        )}
      </div>
    </header>
  );
}
