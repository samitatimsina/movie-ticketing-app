import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FaTimesCircle className="text-red-500 text-6xl" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. This may happen due to
          network issues or payment gateway failure.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Go to Home
          </button>
        </div>

        {/* Support Note */}
        <p className="text-xs text-gray-400 mt-5">
          If money was deducted, it will be refunded automatically within a few minutes.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailure;