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

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-xl font-extrabold text-blue-700">3MTT</div>
        <div className="h-4 w-px bg-gray-300"></div>
        <div className="text-sm font-medium text-gray-600">QR Attendance System</div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{displayName}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  role === "teacher"
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                {role === "teacher" ? "Teacher" : "Student"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="text-sm text-gray-600">Not signed in</div>
        )}
      </div>
    </header>
  );
}
