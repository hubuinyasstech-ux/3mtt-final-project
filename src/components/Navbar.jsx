import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold">3MTT</div>
        <div className="text-sm text-gray-600">QR Attendance</div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-sm text-gray-700">{user.email}</div>

            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-50 text-red-700 rounded"
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
