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
            formData.role === "teacher" ? "Teacher/Instructor" : "Fellow/Student"
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Left 3MTT Brand Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#20203C] flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#008751]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-[#008751] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-xl mx-auto mb-5 border border-emerald-400/20">
            3M
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Join 3MTT
          </h1>
          <p className="text-slate-300 mt-3 max-w-xs text-sm">
            Create your fellow or instructor account and start tracking attendance.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {[
              "QR-powered attendance verification",
              "Role-based Fellow & Instructor portals",
              "Real-time cohort & course analytics",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#008751]/30 border border-[#008751]/60 flex items-center justify-center text-[#56C760] text-xs font-bold flex-shrink-0">
                  ✓
                </div>
                <span className="text-slate-300 text-xs sm:text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#008751] rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow">
              3M
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">3MTT Nigeria</div>
              <div className="text-slate-500 text-xs">QR Attendance System</div>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900">
            Create account
          </h2>
          <p className="text-slate-500 mt-1 mb-6 text-xs sm:text-sm">
            Fill in your details to register on the 3MTT platform.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 text-xs sm:text-sm flex gap-2.5">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "student" }))
                  }
                  className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all duration-150 ${
                    formData.role === "student"
                      ? "bg-[#008751] text-white border-[#008751] shadow-md shadow-emerald-950/20"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#008751]/50 hover:bg-emerald-50/50"
                  }`}
                >
                  🎓 3MTT Fellow
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "teacher" }))
                  }
                  className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all duration-150 ${
                    formData.role === "teacher"
                      ? "bg-[#20203C] text-white border-[#20203C] shadow-md shadow-slate-900/20"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  👨‍🏫 Instructor
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-white p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-xs sm:text-sm placeholder-slate-400 shadow-sm transition"
                required
              />
            </div>

            {/* Matric / ID Number */}
            {formData.role === "student" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3MTT Fellow ID / Matric Number
                </label>
                <input
                  type="text"
                  name="matricNumber"
                  placeholder="e.g. 3MTT-FELLOW-1024"
                  value={formData.matricNumber}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-white p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-xs sm:text-sm placeholder-slate-400 shadow-sm transition"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-white p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-xs sm:text-sm placeholder-slate-400 shadow-sm transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min. 6 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-white p-3.5 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-xs sm:text-sm placeholder-slate-400 shadow-sm transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold hover:text-[#008751] focus:outline-none px-2 py-1 bg-slate-100 rounded-lg transition"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-white p-3.5 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-xs sm:text-sm placeholder-slate-400 shadow-sm transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold hover:text-[#008751] focus:outline-none px-2 py-1 bg-slate-100 rounded-lg transition"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#008751]"
              />
              <label htmlFor="agree" className="text-xs text-slate-600">
                I agree to the{" "}
                <span className="text-[#008751] font-bold hover:underline cursor-pointer">
                  3MTT Terms & Conditions
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agree || loading}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md ${
                agree && !loading
                  ? "bg-[#008751] hover:bg-[#26a65b] shadow-emerald-950/20"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-xs sm:text-sm text-center mt-6 text-slate-500">
            Already have an account?{" "}
            <Link to="/" className="text-[#008751] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
