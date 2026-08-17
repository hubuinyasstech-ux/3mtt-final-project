import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [activeTab, setActiveTab] = useState("about"); // 'about' | 'registerGuide' | 'loginGuide'

  useEffect(() => {
    if (!lockoutUntil) return;

    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= lockoutUntil) {
        setLockoutUntil(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const remainingLockout = lockoutUntil
    ? Math.max(0, Math.ceil((lockoutUntil - now) / 1000))
    : 0;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (remainingLockout > 0) {
      setError(`Too many failed attempts. Please wait ${remainingLockout}s.`);
      return;
    }

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Main Section: Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel — Brand Info & System Guide */}
        <div className="lg:w-1/2 bg-[#20203C] text-white p-6 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#008751]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-2 bg-[#008751] rounded-2xl flex items-center justify-center text-white text-base font-extrabold shadow-xl border border-emerald-400/20">
                3MTT
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                  3MTT Nigeria
                </h1>
                <p className="text-slate-300 text-xs mt-1 font-medium">
                  3 Million Technical Talent Initiative
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Smart QR Attendance Portal
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed max-w-lg">
                Official attendance tracking system built for 3MTT training
                cohorts across Nigeria. Verify class presence seamlessly using
                encrypted QR code technology.
              </p>
            </div>
          </div>

          {/* Interactive Guide Tabs */}
          <div className="relative z-10 mt-8 mb-6">
            <div className="flex items-center gap-2 border-b border-slate-700/70 pb-3 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  activeTab === "about"
                    ? "bg-[#008751] text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                💡 System Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("registerGuide")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  activeTab === "registerGuide"
                    ? "bg-[#008751] text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                📝 How to Register
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("loginGuide")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  activeTab === "loginGuide"
                    ? "bg-[#008751] text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                🔑 How to Log In & Mark
              </button>
            </div>

            {/* Tab Content 1: System Info */}
            {activeTab === "about" && (
              <div className="bg-[#292D4A]/80 border border-slate-700/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📷</span>
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Real-Time QR Verification
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-normal">
                      Instructors generate a dynamic session QR code; fellows
                      scan with their phone camera to instantly log attendance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-700/50">
                  <span className="text-xl">🎓</span>
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Dual Role Portals
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-normal">
                      Dedicated dashboards tailored specifically for 3MTT
                      Fellows (students) and Instructors (teachers).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content 2: How to Register */}
            {activeTab === "registerGuide" && (
              <div className="bg-[#292D4A]/80 border border-slate-700/70 rounded-2xl p-5 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#008751] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                    1
                  </span>
                  <span>
                    Click <strong className="text-white">Create Account</strong>{" "}
                    below or navigate to Register.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#008751] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                    2
                  </span>
                  <span>
                    Select your role:{" "}
                    <strong className="text-white">🎓 3MTT Fellow</strong> or{" "}
                    <strong className="text-white">👨‍🏫 Instructor</strong>.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#008751] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                    3
                  </span>
                  <span>
                    Enter your Full Name, 3MTT Fellow ID, Email, and Password.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-[#008751] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                    4
                  </span>
                  <span>
                    Check your email inbox to confirm your account, then log in!
                  </span>
                </div>
              </div>
            )}

            {/* Tab Content 3: How to Log In & Mark */}
            {activeTab === "loginGuide" && (
              <div className="bg-[#292D4A]/80 border border-slate-700/70 rounded-2xl p-5 space-y-3 text-xs text-slate-200">
                <div>
                  <h4 className="font-extrabold text-[#56C760] mb-1">
                    For Fellows (Students):
                  </h4>
                  <p className="text-slate-300 leading-normal">
                    Sign in with your email & password → Click{" "}
                    <strong>📷 Scan QR Code</strong> → Point camera at the
                    teacher's screen to mark PRESENT.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-700/50">
                  <h4 className="font-extrabold text-[#F0A901] mb-1">
                    For Instructors (Teachers):
                  </h4>
                  <p className="text-slate-300 leading-normal">
                    Sign in → Click <strong>⚡ Generate QR Code</strong> → Type
                    session title → Display live code for your cohort.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="relative z-10 text-[11px] text-slate-400">
            Hubu-InyassTech 3mtt Fellow
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Form Title */}
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Account Sign In
              </h3>
              <p className="text-slate-500 mt-1 text-xs sm:text-sm">
                Enter your registered credentials to access your portal.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 text-xs sm:text-sm flex gap-2.5">
                <span className="mt-0.5">⚠️</span>
                <div>
                  <span>{error}</span>
                  {attempts > 0 && attempts < 5 && remainingLockout === 0 && (
                    <p className="text-[11px] text-rose-700 font-semibold mt-1">
                      Failed attempt {attempts}/5. 5 failed attempts will lock account for 2 mins.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Lockout Warning */}
            {remainingLockout > 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-4 text-xs sm:text-sm flex gap-2.5">
                <span className="mt-0.5">⏳</span>
                <span>{`Too many attempts. Please wait ${remainingLockout} seconds.`}</span>
              </div>
            )}

            {/* Sign In Form */}
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
                    className="w-full border border-slate-200 bg-[#ffffff] p-3.5 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent text-slate-900 text-sm placeholder-slate-400 shadow-sm transition"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || remainingLockout > 0}
                className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all duration-200 shadow-md ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : remainingLockout > 0
                      ? "bg-rose-400 cursor-not-allowed"
                      : "bg-[#008751] hover:bg-[#26a65b] shadow-emerald-950/20"
                }`}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {/* Registration Prompt */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                New to the 3MTT Attendance System?
              </p>
              <Link
                to="/Register"
                className="mt-2 inline-block w-full py-3 rounded-2xl bg-white border border-[#008751] text-[#008751] hover:bg-emerald-50 font-bold text-xs sm:text-sm transition shadow-sm"
              >
                📝 Create New Account (Fellow or Instructor)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
