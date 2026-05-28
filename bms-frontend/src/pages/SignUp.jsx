import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:9000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("Account created successfully!");

      // auto login user after signup
      login(data.user);

      navigate("/");

    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
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
          Create Account
        </h2>

        <p className="text-center text-gray-500 text-sm">
          Sign up to start booking movies
        </p>

        {/* Name */}
        <div>
          <label className="text-sm text-gray-700 block mb-1">Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg 
            border border-gray-300 
            bg-[#fafafa] 
            focus:outline-none focus:ring-2 focus:ring-black
            transition"
          />
        </div>

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
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold 
          bg-black text-white 
          hover:bg-gray-900 
          transition-all duration-300 shadow-md disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-black font-medium hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;