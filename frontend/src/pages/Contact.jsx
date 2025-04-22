import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import FrontNavbar from "../components/FrontNavbar";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import contactImage from "../assets/contact.jpg";

// Contact page with enhanced animations and gradient theme
const Contact = () => {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formStatus, setFormStatus] = useState(null);
  const contentRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus('sending');
    
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1500);
  };
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      
      setScrollProgress(Math.min(scrollTop / documentHeight, 1));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation effects when component mounts
  useEffect(() => {
    setIsLoaded(true);
    
    // Animate the form fields with staggered timing
    const formElements = document.querySelectorAll('.animate-form-element');
    formElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('element-visible');
      }, 300 + (index * 150));
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-gray-900 text-white">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-green-500" 
          style={{ width: `${scrollProgress * 100}%`, transition: 'width 0.1s' }}
        />
      </div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-emerald-600/5 to-transparent opacity-70" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-600/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-teal-600/5 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      {/* Hero Section */}
      <div className="pt-28 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center transition-all duration-1000 ${
              isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-white">
                {t.title}
              </span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto my-6"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t.description || "We're here to help with any questions about our rental services."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Contact Form */}
          <div 
            className={`w-full lg:w-7/12 transition-all duration-1000 ${
              isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 shadow-xl border border-white/10 h-full">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">
                {t.getInTouch}
              </h2>
              
              {formStatus === 'success' ? (
                <div className="bg-green-400/10 backdrop-blur-md rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-4">{t.messageSent}</h3>
                  <p className="text-gray-300">
                    We've received your message and will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="animate-form-element opacity-0 transform translate-y-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="name">
                      {t.name}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 rounded-xl py-3 text-gray-100 transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div className="animate-form-element opacity-0 transform translate-y-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                      {t.email}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 rounded-xl py-3 text-gray-100 transition-all duration-300"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div className="animate-form-element opacity-0 transform translate-y-4">
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="message">
                      {t.message}
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 rounded-xl py-3 text-gray-100 transition-all duration-300"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="animate-form-element opacity-0 transform translate-y-4 pt-4">
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'sending' ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : t.send}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Right Column - Contact Details & Map */}
          <div 
            className={`w-full lg:w-5/12 transition-all duration-1000 ${
              isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-x-10"
            }`}
          >
            {/* Contact Info Card */}
            <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-8 shadow-xl border border-white/10 mb-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="bg-emerald-500/20 p-3 rounded-lg group-hover:bg-emerald-500/30 transition-all duration-300">
                    <svg className="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">Address</h3>
                    <p className="text-gray-300">{t.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition-all duration-300">
                    <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">Phone</h3>
                    <p className="text-gray-300">{t.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <div className="bg-teal-500/20 p-3 rounded-lg group-hover:bg-teal-500/30 transition-all duration-300">
                    <svg className="h-6 w-6 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white mb-1">Email</h3>
                    <p className="text-gray-300">{t.emailUs}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image or Map */}
            <div className="backdrop-blur-lg bg-white/5 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-center justify-center">
                <span className="bg-emerald-500/20 backdrop-blur-md rounded-lg px-6 py-3 text-white font-medium border border-emerald-500/30">
                  Visit Us
                </span>
              </div>
              <img 
                src={contactImage} 
                alt="Our location" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Social Media Links */}
      <div 
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 text-center transition-all duration-1000 ${
          isLoaded ? "opacity-100 transform-none" : "opacity-0 translate-y-10"
        }`}
      >
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">
          Find Us On Social Media
        </h3>
        
        <div className="flex justify-center space-x-6">
          {[
            { icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z", name: "Facebook", color: "bg-emerald-600/20" },
            { icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z", name: "Twitter", color: "bg-teal-500/20" },
            { icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z", name: "LinkedIn", color: "bg-green-600/20" },
            { icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z", name: "Instagram", color: "bg-emerald-700/20" }
          ].map((social, index) => (
            <a 
              key={index}
              href="#" 
              className={`${social.color} p-3 rounded-full hover:scale-110 transition-all duration-300`}
              aria-label={social.name}
            >
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d={social.icon}></path>
              </svg>
            </a>
          ))}
        </div>
      </div>
      
      {/* Add custom CSS for animations */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        .element-visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 10s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Contact; 