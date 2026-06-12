import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/";
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Login failed");
      return;
    }

login(data.user);

// save token if backend sends it
if (data.accessToken || data.token) {
        const token = data.accessToken || data.token;
        localStorage.setItem("accessToken", token);
      }

toast.success("Signed in successfully!");

// redirect
navigate(redirectTo, { replace: true });

  } catch (error) {
    toast.error("Server error. Please try again.");
    console.error(error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8f5f0]">
      
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md md:max-w-lg 
        bg-white 
        rounded-2xl 
        shadow-xl 
        p-8 md:p-10 space-y-6 
        border border-gray-200"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-black">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Sign in to continue your booking
        </p>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-700 block mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg 
            border border-gray-300 
            bg-[#fafafa] 
            focus:outline-none focus:ring-2 focus:ring-black
            transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-700 block mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg 
            border border-gray-300 
            bg-[#fafafa] 
            focus:outline-none focus:ring-2 focus:ring-black
            transition"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold 
          bg-black text-white 
          hover:bg-gray-900 
          transition-all duration-300 shadow-md"
        >
          Sign In
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-black font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;