import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6">
          3MTT Attendance System
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-900">
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/Register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
