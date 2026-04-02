import React, { useState } from "react";

const StepAccountCreation = ({ email, onComplete }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleCreateAccount = async () => {
    if (!name) {
      alert("Name is required");
      return;
    }

    try {
      const res = await fetch("/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        onComplete(data); // move to dashboard/login
      } else {
        alert(data.message || "Failed to create account");
      }
    } catch (err) {
      console.error("Account creation failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Create Your Account
      </h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="border px-4 py-3 rounded-md outline-none"
      />

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
        className="border px-4 py-3 rounded-md outline-none"
      />

      <button
        onClick={handleCreateAccount}
        className="w-full text-white bg-black py-2 rounded-md hover:bg-gray-800"
      >
        Create Account
      </button>
    </div>
  );
};

export default StepAccountCreation;