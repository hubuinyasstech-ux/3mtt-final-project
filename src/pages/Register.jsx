import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../service/supabase";

export default function Register() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    matricNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create the authentication account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,

        // Send student information to the database trigger
        options: {
          data: {
            full_name: formData.fullName.trim(),
            matric_number: formData.matricNumber.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Unable to create user account.");
      }

      alert(
        "Registration successful! Please check your email to confirm your account.",
      );

      setFormData({
        fullName: "",
        matricNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAgree(false);
    } catch (error) {
      console.error("Registration error:", error);

      alert(error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Register 3MTT Attendance
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Matric Number */}
          <input
            type="text"
            name="matricNumber"
            placeholder="3MTT Matric No"
            value={formData.matricNumber}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />

            <label htmlFor="agree" className="text-sm">
              I agree to the{" "}
              <span className="text-blue-600">Terms & Conditions</span>
            </label>
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={!agree || loading}
            className={`w-full py-3 rounded text-white transition ${
              agree && !loading
                ? "bg-green-600 hover:bg-green-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
