import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);
  const [lockoutUntil, setLockoutUntil] = React.useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (loginError) {
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 5) {
            setLockoutUntil(Date.now() + 2 * 60 * 1000);
          }
          return newAttempts;
        });

        if (
          loginError.message
            ?.toLowerCase()
            .includes("invalid login credentials")
        ) {
          throw new Error(
            "Invalid email or password. If you recently registered, please check your email inbox to confirm your account first."
          );
        }
        throw loginError;
      }

      if (!data.user) {
        throw new Error("Unable to log in. Please try again.");
      }
      
      setAttempts(0);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel — 3MTT Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#20203C] flex-col items-center justify-center px-12 relative overflow-hidden">
        {/* Subtle green glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#008751]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-[#008751] rounded-3xl flex items-center justify-center text-white text-xl font-extrabold shadow-2xl border border-emerald-400/20 mx-auto mb-6">
            3MTT
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            3MTT Nigeria
          </h1>
          <p className="text-slate-300 text-base mt-3 max-w-sm">
            3 Million Technical Talent Initiative — Attendance Verification System.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "📷", label: "QR Scan" },
              { icon: "📊", label: "Analytics" },
              { icon: "🎓", label: "Fellow Portal" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#292D4A]/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-slate-300 text-xs font-semibold">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="px-2.5 py-1 bg-[#008751] rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow">
              3MTT
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm">3MTT Nigeria</div>
              <div className="text-slate-500 text-xs">QR Attendance Portal</div>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900">
            Welcome back
          </h2>
          <p className="text-slate-500 mt-1 mb-8 text-sm">
            Sign in to access your 3MTT dashboard.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 text-xs sm:text-sm flex gap-2.5">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {lockoutUntil && Date.now() < lockoutUntil && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-4 text-xs sm:text-sm flex gap-2.5">
              <span className="mt-0.5">⏳</span>
              <span>{`Too many attempts. Please wait ${Math.ceil((lockoutUntil - Date.now())/1000)} seconds.`}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full border border-slate-200 bg-white p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-sm placeholder-slate-400 shadow-sm transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#008751] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-slate-200 bg-white p-3.5 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-sm placeholder-slate-400 shadow-sm transition"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (lockoutUntil && Date.now() < lockoutUntil)}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all duration-200 shadow-md ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : (lockoutUntil && Date.now() < lockoutUntil)
                    ? "bg-rose-400 cursor-not-allowed"
                    : "bg-[#008751] hover:bg-[#26a65b] shadow-emerald-950/20"
              }`}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs sm:text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/Register"
              className="text-[#008751] font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
