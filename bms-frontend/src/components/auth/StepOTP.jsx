import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

const StepOTP = ({ email, hash }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/v1/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          hash, // ✅ must come from previous step
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.auth) {
        login(data.user); // ✅ update global auth
        toast.success("OTP verified!");

        navigate("/profile");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Enter OTP
      </h2>

      <p className="text-center text-sm text-gray-500">
        OTP sent to {email}
      </p>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="border px-4 py-3 rounded-md outline-none"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full text-white bg-black py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
};

export default StepOTP;