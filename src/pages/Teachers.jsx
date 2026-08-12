import React from "react";
import { Link } from "react-router-dom";

export default function Teachers() {
  const teachers = [
    { id: 1, name: "Dr. Ada Lovelace", email: "ada@3mtt.edu" },
    { id: 2, name: "Dr. Grace Hopper", email: "grace@3mtt.edu" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Teachers</h1>

          <Link
            to="/dashboard"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Teacher List</h2>

          <ul>
            {teachers.map((t) => (
              <li key={t.id} className="py-2 border-b flex justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.email}</div>
                </div>

                <div className="text-sm text-gray-500">(readonly)</div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
