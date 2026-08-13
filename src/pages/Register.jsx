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

      if (authError) throw authError;

      if (!data || !data.user) {
        throw new Error("Registration failed. Please try again.");
      }

      if (data.session) {
        alert(
          `Registration successful! Registered as ${
            formData.role === "teacher" ? "Teacher/Instructor" : "Student"
          }.`,
        );
        navigate("/dashboard");
      } else {
        alert(
          "Registration successful! Please check your email inbox to confirm your account before logging in.",
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
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-slate-900 flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-xl mx-auto mb-5">
            3MTT
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Join 3MTT
          </h1>
          <p className="text-slate-400 mt-3 max-w-xs text-sm">
            Create your account and start tracking attendance with our QR
            system.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {[
              "QR-powered attendance scanning",
              "Role-based student & teacher portals",
              "Real-time attendance analytics",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500/50 flex items-center justify-center text-violet-300 text-xs font-bold shrink-0">
                  ✓
                </div>
                <span className="text-slate-400 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow">
              3M
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">3MTT</div>
              <div className="text-slate-500 text-xs">QR Attendance System</div>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900">
            Create your account
          </h2>
          <p className="text-slate-500 mt-1 mb-6 text-sm">
            Fill in the details below to get started.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex gap-2.5">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "student" }))
                  }
                  className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all duration-150 ${
                    formData.role === "student"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "teacher" }))
                  }
                  className={`py-3 px-4 rounded-xl font-semibold text-sm border-2 transition-all duration-150 ${
                    formData.role === "teacher"
                      ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-100"
                      : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                  }`}
                >
                  👨‍🏫 Instructor
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-slate-900 placeholder-slate-400 transition"
                required
              />
            </div>

            {/* Matric Number (Students only) */}
            {formData.role === "student" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  3MTT Matric Number
                </label>
                <input
                  type="text"
                  name="matricNumber"
                  placeholder="Enter your matric number"
                  value={formData.matricNumber}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-slate-900 placeholder-slate-400 transition"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-slate-900 placeholder-slate-400 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min. 6 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-white p-3 pr-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-slate-900 placeholder-slate-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold hover:text-indigo-600 focus:outline-none px-2 py-1 bg-slate-100 hover:bg-indigo-50 rounded-lg transition"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-white p-3 pr-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-slate-900 placeholder-slate-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold hover:text-indigo-600 focus:outline-none px-2 py-1 bg-slate-100 hover:bg-indigo-50 rounded-lg transition"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-indigo-600"
              />
              <label htmlFor="agree" className="text-sm text-slate-600">
                I agree to the{" "}
                <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                  Terms & Conditions
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agree || loading}
              className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-md ${
                agree && !loading
                  ? formData.role === "teacher"
                    ? "bg-violet-600 hover:bg-violet-700 hover:shadow-violet-200 hover:shadow-lg"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-lg"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-slate-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
