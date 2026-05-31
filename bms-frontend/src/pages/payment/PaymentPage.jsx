import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MockPayment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = params.get("bookingId");
  const amount = params.get("amount");

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuccess = async () => {
    if (!name) return alert("Please enter your name");

    setLoading(true);

    try {
      await fetch(
        `http://localhost:9000/api/v1/payment/verify/${bookingId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payerName: name }),
        }
      );

      setTimeout(() => {
        navigate("/profile/orders");
      }, 1200);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setLoading(false);
    }
  };

  const handleFail = () => {
    navigate("/payment/fail");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      
      {/* PAYMENT CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Bison Payment
          </h1>
          <p className="text-sm text-gray-500">
           Checkout
          </p>
        </div>

        {/* DETAILS BOX */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2">
          <p>
          <span className="font-semibold">Booking ID:</span>{" "}
          {bookingId || "2868686"}
        </p>

        <p>
          <span className="font-semibold">Amount:</span>{" "}
          Rs {amount || "500"}
        </p>
        </div>

        {/* NAME INPUT */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={handleSuccess}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <button
            onClick={handleFail}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 mt-4">
            Copyright to Samita Timsina and Prabdhi Pokharel
        </p>

      </div>
    </div>
  );
}