import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    fullName: "",
    matricNumber: "",
    role: "student",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!agree) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            matric_number:
              formData.role === "student" ? formData.matricNumber : "STAFF",
            role: formData.role,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!data || !data.user) {
        throw new Error("Registration failed. Please try again.");
      }

      if (data.session) {
        alert(
          `Registration successful! Registered as ${
            formData.role === "teacher" ? "Teacher/Instructor" : "Student"
          }.`
        );
        navigate("/dashboard");
      } else {
        alert(
          "Registration successful! Please check your email inbox to confirm your account before logging in."
        );
        setFormData({
          fullName: "",
          matricNumber: "",
          role: "student",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAgree(false);
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200 px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Register</h1>

        <p className="text-center text-gray-500 mb-6">
          3MTT QR Attendance System
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Account Type / Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "student" }))
                }
                className={`py-2 px-4 rounded-lg font-medium text-sm border text-center transition ${
                  formData.role === "student"
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "teacher" }))
                }
                className={`py-2 px-4 rounded-lg font-medium text-sm border text-center transition ${
                  formData.role === "teacher"
                    ? "bg-purple-600 text-white border-purple-600 shadow"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                👨‍🏫 Teacher / Admin
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Matric Number (Shown for Students) */}
          {formData.role === "student" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                3MTT Matric Number
              </label>

              <input
                type="text"
                name="matricNumber"
                placeholder="Enter your matric number"
                value={formData.matricNumber}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold hover:text-gray-700 focus:outline-none px-2 py-1 bg-gray-100 rounded"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold hover:text-gray-700 focus:outline-none px-2 py-1 bg-gray-100 rounded"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />

            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to the{" "}
              <span className="text-blue-600">Terms & Conditions</span>
            </label>
          </div>

          {/* Register */}
          <button
            type="submit"
            disabled={!agree || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              agree && !loading
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login */}
        <p className="text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
