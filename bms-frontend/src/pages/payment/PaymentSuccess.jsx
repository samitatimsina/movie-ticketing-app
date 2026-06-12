import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleContinue = () => {
    // Show dialog
    setShowDialog(true);

    // After 1.5 seconds, redirect to homepage
    setTimeout(() => {
      navigate("/"); // redirect to homepage
    }, 1500);
  };
  useEffect(() => {
  const verifyPayment = async () => {
    const params = new URLSearchParams(window.location.search);

    const data = params.get("data");
    const bookingId = params.get("bookingId");

    if (!data || !bookingId) return;

    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${BASE_URL}/api/v1/booking/verify/${bookingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
      }
    );

    const result = await res.json();

    if(result.success) {
      navigate("/booking-history");
    }

    if (!result.success) {
      alert("Payment verification failed");
    }
  };

  verifyPayment();
}, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your payment. Click continue to go to the homepage.
      </p>
      <button
        onClick={handleContinue}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Continue
      </button>

      {/* Dialog box */}
      {showDialog && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg border border-green-400">
          <p className="text-green-600 font-semibold">Done! Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;