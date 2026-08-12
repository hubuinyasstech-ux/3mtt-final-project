import { supabase } from "../service/supabase";

export async function fetchStudents() {
  const { data, error } = await supabase.from("students").select("*");
  if (error) throw error;
  return data;
}

export async function createStudent(student) {
  const { data, error } = await supabase.from("students").insert([student]);
  if (error) throw error;
  return data?.[0];
}

export async function updateStudent(id, updates) {
  const { data, error } = await supabase
    .from("students")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  return data?.[0];
}

export async function deleteStudent(id) {
  const { data, error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
  return data;
}

export async function fetchAttendance(student_id) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", student_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function recordAttendance(record) {
  const { data, error } = await supabase.from("attendance").insert([record]);
  if (error) throw error;
  return data?.[0];
}
