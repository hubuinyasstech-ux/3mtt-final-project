import React, { useEffect, useState } from "react";
import { fetchStudents, createStudent, deleteStudent } from "../services/db";
import StudentTable from "../components/StudentTable";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    matricNumber: "",
    email: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    try {
      const created = await createStudent({
        full_name: form.fullName,
        matric_number: form.matricNumber,
        email: form.email,
      });
      setStudents((s) => [created, ...s]);
      setForm({ fullName: "", matricNumber: "", email: "" });
    } catch (err) {
      console.error(err);
      alert(err.message || "Unable to create student");
    }
  }

  async function handleDelete(student) {
    if (!confirm(`Delete ${student.full_name || student.fullName}?`)) return;
    try {
      await deleteStudent(student.id);
      setStudents((s) => s.filter((x) => x.id !== student.id));
    } catch (err) {
      console.error(err);
      alert("Unable to delete student");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Students</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add Student</h2>

          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <input
              required
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) =>
                setForm((f) => ({ ...f, fullName: e.target.value }))
              }
              className="border p-2 rounded"
            />

            <input
              required
              placeholder="Matric number"
              value={form.matricNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, matricNumber: e.target.value }))
              }
              className="border p-2 rounded"
            />

            <div className="flex gap-2">
              <input
                required
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="border p-2 rounded flex-1"
              />

              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Add
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Student List</h2>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <StudentTable students={students} onDelete={handleDelete} />
          )}
        </div>
      </main>
    </div>
  );
}
