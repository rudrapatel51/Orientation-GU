import React from "react";

const Succes = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Card Container */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="green"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome to the Prom Night,
          </p>

          {/* User Information */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Your Details
            </h3>
            {/* <div className="text-sm text-gray-600">
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
            </div> */}
          </div>

          {/* Call to Action */}
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
            onClick={() => alert("You can now explore the platform!")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Succes;