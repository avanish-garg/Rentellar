import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const Education = () => {
  const { language } = useLanguage();
  const t = translations[language].education || { 
    title: 'Education',
    subtitle: 'Learn about rental best practices'
  };
  
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);
  
  // Add blog state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "How I Saved Money by Renting Instead of Buying",
      author: "Priya Singh",
      date: "10 May 2023",
      content: "Last month, I needed a specialized tool for a home project. Instead of buying it for ₹8,000, I rented it for just ₹900! Not only did I save money, but I also didn't have to worry about storage afterward.",
      image: "https://images.pexels.com/photos/1450903/pexels-photo-1450903.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 2,
      title: "My Experience as a First-Time Lender",
      author: "Rahul Sharma",
      date: "24 Apr 2023",
      content: "I was hesitant to lend my camera equipment, but after trying it out, I've made ₹15,000 in three months from gear that was just sitting at home. Plus, I've connected with other photography enthusiasts!",
      image: "https://images.pexels.com/photos/3805983/pexels-photo-3805983.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      title: "Sharing Economy Helped Me During Festival Season",
      author: "Ananya Patel",
      date: "15 Mar 2023",
      content: "During Diwali, I borrowed decorations and traditional outfits instead of buying new ones. It was eco-friendly and budget-friendly! Will definitely do this for more festivals.",
      image: "https://images.pexels.com/photos/2253916/pexels-photo-2253916.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]);
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    content: "",
    image: ""
  });
  
  // Handle new blog input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({
      ...newBlog,
      [name]: value
    });
  };
  
  // Add new blog
  const handleSubmitBlog = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newBlog.title || !newBlog.author || !newBlog.content) {
      alert("Please fill all required fields");
      return;
    }
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
    
    const blogToAdd = {
      id: blogs.length + 1,
      title: newBlog.title,
      author: newBlog.author,
      date: formattedDate,
      content: newBlog.content,
      image: newBlog.image || "https://images.pexels.com/photos/3943876/pexels-photo-3943876.jpeg?auto=compress&cs=tinysrgb&w=600" // default image
    };
    
    setBlogs([...blogs, blogToAdd]);
    setNewBlog({
      title: "",
      author: "",
      content: "",
      image: ""
    });
    
    setShowBlogForm(false);
    
    // Scroll to blog section
    document.getElementById('user-blogs').scrollIntoView({ behavior: 'smooth' });
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
  
  useEffect(() => {
    setIsVisible(true);
    
    // Add staggered card animations on initial load
    const cards = document.querySelectorAll('.tip-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('card-visible');
      }, 100 + index * 50);
    });
  }, []);
  
  // Renter tips
  const renterTips = [
    {
      title: "Respect the Property",
      description: "Handle items with care. Avoid misuse or damage.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Timely Returns",
      description: "Return items on time. Inform lenders of delays.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Stay Transparent",
      description: "Discuss concerns promptly. Confirm terms upfront.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      )
    },
    {
      title: "Report Damages",
      description: "Be honest about damages. Offer to cover repairs if needed.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Maintain Cleanliness",
      description: "Return items in good condition. Ensure proper hygiene.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      )
    },
    {
      title: "Adhere to Terms",
      description: "Follow guidelines. Respect all rental terms & policies.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Honor Providers",
      description: "Be punctual and cooperative. Value their time and effort.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      )
    },
    {
      title: "Accurate Information",
      description: "Clearly state your service needs. Ensure transparent communication.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
  ];
  
  // Lender tips
  const lenderTips = [
    {
      title: "Accurate Descriptions",
      description: "Provide honest details. Upload clear photos.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Fair Pricing",
      description: "Set competitive rates. State clear terms.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Maintain Quality",
      description: "Ensure items are well functional. Conduct inspections if needed.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Prompt Communication",
      description: "Respond quickly. Offer guidance if needed.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Transparency",
      description: "Explain deposit, refund, and damage policies.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Resolve with Care",
      description: "Handle issues calmly. Find fair solutions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Quality Services",
      description: "Deliver professional experiences. Ensure customer satisfaction.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    },
    {
      title: "Set Clear Expectations",
      description: "Outline service timelines, terms, and responsibilities.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-gray-900 text-white">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-blue-500" 
          style={{ width: `${scrollProgress * 100}%`, transition: 'width 0.1s' }}
        />
      </div>
      
      {/* Hero Section */}
      <div className="pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-emerald-600/10 to-transparent opacity-60" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-600/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-white">
                Education Center
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle || "Learn how to make the most of your rental experience"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Educational Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div 
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-10"
          }`}
        >
          {/* User Etiquettes Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
                User Etiquettes
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Guidelines for positive interactions in our sharing community
            </p>
          </div>
          
          {/* Being a Good Renter Card */}
          <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-10 mb-20 shadow-xl border border-white/10">
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-2xl font-bold py-4 px-10 rounded-xl shadow-lg transform -translate-y-14">
                Being a good renter
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {renterTips.map((tip, index) => (
                <div 
                  key={index} 
                  className="tip-card opacity-0 backdrop-blur-sm bg-white/90 rounded-2xl overflow-hidden text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/20"
                >
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-blue-50 rounded-full p-5 mb-5 shadow-inner">
                      {tip.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Being a Good Lender Card */}
          <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-10 mb-20 shadow-xl border border-white/10">
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-2xl font-bold py-4 px-10 rounded-xl shadow-lg transform -translate-y-14">
                Being a good lender
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {lenderTips.map((tip, index) => (
                <div 
                  key={index} 
                  className="tip-card opacity-0 backdrop-blur-sm bg-white/90 rounded-2xl overflow-hidden text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-white/20"
                >
                  <div className="p-8 flex flex-col items-center text-center">
                    <div className="bg-green-50 rounded-full p-5 mb-5 shadow-inner">
                      {tip.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Environmental Awareness Section */}
          <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-10 mb-20 shadow-xl border border-white/10">
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white text-2xl font-bold py-4 px-10 rounded-xl shadow-lg transform -translate-y-14">
                Environmental Awareness
              </div>
            </div>
            
            <div className="mb-10">
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Participating in a sharing economy has significant environmental benefits. By renting instead of buying, 
                we reduce waste, conserve resources, and minimize our carbon footprint.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-green-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Reduces Consumption</h3>
                  <p className="text-gray-300">Sharing items decreases the need for new products, saving natural resources and energy used in manufacturing.</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-green-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Minimizes Waste</h3>
                  <p className="text-gray-300">Extending product lifecycles through sharing helps reduce landfill waste and pollution.</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-green-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Lowers Carbon Footprint</h3>
                  <p className="text-gray-300">Sharing items locally reduces transportation emissions associated with shipping new products.</p>
                </div>
              </div>
            </div>
            
            {/* Environmental Impact Content Section - Replacing Videos */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Environmental Impact of Sharing Economy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-green-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Extended Product Lifespan</h3>
                  <p className="text-gray-300 mb-4">The average household drill is used for just 12-13 minutes in its entire lifetime. Through sharing, items can be used to their full potential instead of sitting idle.</p>
                  <div className="text-sm text-emerald-400 font-semibold">
                    Did you know? Extending the lifespan of all clothing by just 9 months would reduce carbon, waste and water footprints by 20-30% each.
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-green-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Resource Conservation</h3>
                  <p className="text-gray-300 mb-4">When communities share resources, there's less demand for new production. This conserves raw materials and reduces energy consumption in manufacturing processes.</p>
                  <div className="text-sm text-emerald-400 font-semibold">
                    Key fact: A single shared car can replace between 9-13 privately owned vehicles on the road.
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-green-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Economic Benefits</h3>
                  <p className="text-gray-300 mb-4">The sharing economy creates value from underutilized assets while promoting more sustainable consumption patterns and providing income opportunities.</p>
                  <div className="text-sm text-emerald-400 font-semibold">
                    Insight: The global sharing economy is projected to grow to $335 billion by 2025, with environmental benefits increasing proportionally.
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-green-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Community Building</h3>
                  <p className="text-gray-300 mb-4">Sharing platforms strengthen communities by connecting people with shared interests and values, promoting trust and collaborative consumption.</p>
                  <div className="text-sm text-emerald-400 font-semibold">
                    Research shows: Communities with strong sharing networks demonstrate greater resilience during economic and environmental challenges.
                  </div>
                </div>
              </div>
              <div className="mt-10 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-center">Take Action Today</h3>
                <p className="text-center text-gray-300 mb-4">
                  Every time you choose to rent instead of buy, you're contributing to a more sustainable future. 
                  Start small by sharing tools, sports equipment, or special occasion items.
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => setShowBlogForm(true)}
                    className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Start Your Sharing Journey
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Blogs Section */}
          <div id="user-blogs" className="backdrop-blur-lg bg-white/5 rounded-3xl p-10 mb-20 shadow-xl border border-white/10">
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-2xl font-bold py-4 px-10 rounded-xl shadow-lg transform -translate-y-14">
                User Blog Section
              </div>
            </div>
            
            <div className="mb-10">
              <p className="text-xl text-gray-300 mb-8 leading-relaxed text-center">
                Read inspiring stories from our community members about their sharing experiences
              </p>
              
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogs.map((blog) => (
                  <div key={blog.id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all overflow-hidden">
                    {blog.image && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-110" 
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-white">{blog.title}</h3>
                      <div className="flex justify-between mb-4 text-sm text-gray-400">
                        <span>{blog.author}</span>
                        <span>{blog.date}</span>
                      </div>
                      <p className="text-gray-300 mb-4">{blog.content}</p>
                      <button className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Blog submission modal */}
          {showBlogForm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-gray-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="p-6 bg-gradient-to-r from-green-600 to-teal-600">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">Share Your Experience</h3>
                    <button 
                      onClick={() => setShowBlogForm(false)}
                      className="text-white hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <form onSubmit={handleSubmitBlog} className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Blog Title *</label>
                    <input 
                      type="text" 
                      name="title"
                      value={newBlog.title}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                      placeholder="Enter your blog title"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Your Name *</label>
                    <input 
                      type="text" 
                      name="author"
                      value={newBlog.author}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Image URL (Optional)</label>
                    <input 
                      type="text" 
                      name="image"
                      value={newBlog.image}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Your Story *</label>
                    <textarea 
                      name="content"
                      value={newBlog.content}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                      placeholder="Share your experience with the community..."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setShowBlogForm(false)}
                      className="bg-gray-600 text-white px-5 py-2 rounded-lg mr-3 hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Share My Story
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
        
        .card-visible {
          opacity: 1;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }
        
        .aspect-w-16 {
          position: relative;
          padding-bottom: 56.25%;
        }
        
        .aspect-w-16 iframe {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default Education; 