import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginmain.jpg";
import bgVideo from "../assets/bgvideo1.mp4";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Mock user data for demonstration
  const mockUsers = [
    { email: "test@example.com" }
  ];
  
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Check if email exists in mock database
    const userExists = mockUsers.some(user => user.email === email);
    
    if (userExists) {
      // Generate random 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000);
      console.log("Generated OTP:", generatedOTP); // For demonstration
      
      // In real application, send OTP to user's email
      setSuccess("OTP has been sent to your email address");
      setStep(2);
    } else {
      setError("Email address not found");
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // In real application, verify OTP from backend
    // For demo, any 6-digit number is accepted
    if (otp.length === 6) {
      setSuccess("OTP verified successfully");
      setStep(3);
    } else {
      setError("Invalid OTP");
    }
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    // In real application, update password in database
    console.log("Password reset successful");
    navigate("/password-success");
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };
  
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const goToLogin = () => {
    navigate("/login");
  };

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

        {/* Right Side - Reset Password Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              {step === 1 ? "Forgot Password" : step === 2 ? "Enter OTP" : "Reset Password"}
            </h2>
            <p className="text-gray-500 text-center mb-8">
              {step === 1 ? "Enter your email address" : step === 2 ? "Enter the OTP sent to your email" : "Set your new password"}
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                <p className="text-green-500 text-sm">{success}</p>
              </div>
            )}

            {step === 1 && (
              <form className="space-y-6" onSubmit={handleEmailSubmit}>
                <div>
                  <label className="text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
                >
                  Send OTP
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-6" onSubmit={handleOTPSubmit}>
                <div>
                  <label className="text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
                >
                  Verify OTP
                </button>
              </form>
            )}

            {step === 3 && (
              <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                <div>
                  <label className="text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
                      placeholder="New Password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="absolute right-3 top-2 text-gray-500 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
                      placeholder="Confirm Password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-2 text-gray-500 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
                >
                  Reset Password
                </button>
              </form>
            )}

            <div className="text-center mt-6">
              <button 
                onClick={goToLogin}
                className="text-orange-600 font-semibold"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword; 