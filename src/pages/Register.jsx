import { supabase } from "../service/supabase";
import React from "react";
import { Link } from "react-router-dom";
export default function Register() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    matricNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  //Supabase client initialization

  const [agree, setAgree] = React.useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (!agree) {
      alert("Please accept the Terms and Conditions. ");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    //User with Supabase Authentication
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      alert(error.message);
      return;
    }
    if (!data.user) {
      alert("Unable to create user. Please try again.");
    }
    // save additional user data to the "users" table in Supabase
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        full_name: formData.fullName,
        matric_number: formData.matricNumber,
        email: formData.email,
      },
    ]);

    if (dbError) {
      alert(dbError.message);
      return;
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6">
          Register 3MTT Attendance
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4 "
            required
          />
          <input
            type="text"
            name="matricNumber"
            value={formData.matricNumber}
            onChange={handleChange}
            placeholder="3MTT Matric No "
            className="w-full border p-3 rounded mb-4"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4 "
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4 "
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4 "
            required
          />

          <div className="flex items-start gap-2 mb-5">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />

            <label htmlFor="agree" className="text-sm">
              I agree to the{" "}
              <span className="text-blue-600 cursor-pointer">
                {" "}
                Terms & Conditions
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agree}
            className={`w-full py-3 rounded text-white transition ${
              agree
                ? "bg-green-600 hover:bg-green-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
