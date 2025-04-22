import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import signupImage from "../assets/signupmain.jpg";
import bgVideo from "../assets/bgvideo1.mp4";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    address: '',
    role: 'renter',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    console.log('Register component mounted');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting to register with data:', formData);
      const response = await register(formData);
      console.log('Registration successful:', response);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen pt-16">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to make content more visible */}
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

      <div className="relative w-full max-w-3xl flex flex-row-reverse bg-white rounded-lg shadow-lg overflow-hidden mx-4 z-20 my-6">
        {/* Right Side - Illustration */}
        <div className="hidden md:block w-1/2 bg-cover bg-center relative">
          <img
            src={signupImage}
            alt="Illustration"
            className="w-full h-full object-cover object-center"
            style={{ maxHeight: '600px' }}
          />
        </div>

        {/* Left Side - Signup Form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-900 text-center">Sign Up</h2>
          <p className="text-gray-500 text-center text-sm mb-4">Create your account</p>
           
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label className="text-gray-700 text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400 text-sm"
                placeholder="Your Name"
                required
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="text-gray-700 text-sm">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400 text-sm"
                placeholder="Username"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-gray-700 text-sm">Select Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400 appearance-none text-sm"
                  required
                >
                  <option value="renter">Renter</option>
                  <option value="lender">Lender</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-gray-700 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400 text-sm"
                placeholder="Email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-gray-700 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400 text-sm"
                  placeholder="Password"
                  required
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1.5 text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Blockchain Wallet Address Input */}
            <div>
              <label className="text-gray-700 text-sm">Wallet Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-gray-400 text-sm"
                placeholder="Enter your blockchain wallet address"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported networks: Ethereum, Bitcoin, Solana, and others
              </p>
            </div>

            {/* Signup Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition mt-4 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'CREATE'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-3 text-sm">
            Already have an account?{" "}
            <button 
              onClick={goToLogin}
              className="text-orange-600 font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 