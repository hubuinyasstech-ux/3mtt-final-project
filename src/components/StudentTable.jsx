import React from "react";

export default function StudentTable({ students = [], onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">#</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
              Name
            </th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
              Matric
            </th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
              Email
            </th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4">{i + 1}</td>
              <td className="px-6 py-4">{s.full_name || s.fullName}</td>
              <td className="px-6 py-4">{s.matric_number || s.matricNumber}</td>
              <td className="px-6 py-4">{s.email}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onEdit?.(s)}
                  className="mr-2 text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete?.(s)}
                  className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
