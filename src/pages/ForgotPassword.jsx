import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;

      setMessage(
        "Password reset link has been sent to your email address. Please check your inbox."
      );
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Unable to send reset password email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-lg mx-auto mb-4">
            🔑
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Forgot Password?
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Enter your registered email address and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-5 text-sm flex gap-2.5">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl mb-5 text-sm flex gap-2.5">
              <span>✅</span>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400 shadow-sm transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-md ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remembered your password?{" "}
            <Link
              to="/"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
