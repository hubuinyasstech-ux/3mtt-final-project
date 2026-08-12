import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/attendance", label: "Attendance" },
  { to: "/ScanQR", label: "Scan QR" },
  { to: "/GenerateQR", label: "Generate QR" },
  { to: "/students", label: "Students" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-gray-50 border-r p-4 min-h-[calc(100vh-56px)]">
      <nav className="flex flex-col gap-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
