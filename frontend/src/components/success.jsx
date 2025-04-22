import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginmain.jpg";
import bgVideo from "../assets/bgvideo1.mp4";

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 3000);

    // Countdown display
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to make content more visible */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

      <div className="relative w-full max-w-4xl flex bg-white rounded-lg shadow-lg overflow-hidden mx-4 z-20">
        {/* Left Side - Illustration */}
        <div className="hidden md:block w-1/2 bg-cover bg-center relative">
          <img
            src={loginImage}
            alt="Illustration"
            className="w-full h-full object-cover object-right"
          />
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-green-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-green-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-medium text-gray-700 text-center">
              You have been successfully signed up.
            </h2>

            {/* Countdown */}
            <p className="text-gray-500">
              Redirecting to home in {countdown} seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success; 