import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FrontNavbar from "../components/FrontNavbar";
import Sitemap from "../components/Sitemap";
import Sarthi from "../components/Sarthi";
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../translations';
import officeparty from "../assets/officeparty.jpg";
import garba from "../assets/garba.jpg";
import hall1 from "../assets/hall1.jpg";
import acaiaOutdoor from "../assets/Acaia Outdoor.jpg";

// Theme colors - Green theme
const theme = {
  primary: "#10B981", // emerald-500
  secondary: "#059669", // emerald-600
  accent: "#34D399", // emerald-400
  text: "#FFFFFF",
  dark: "#064E3B", // emerald-900
  light: "#A7F3D0", // emerald-200
  overlay: "rgba(6, 78, 59, 0.8)",
};

function Home() {
  const { language } = useLanguage();
  const { user, loading: userLoading } = useUser();
  const { loading: authLoading } = useAuth();
  const t = translations[language].home;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const reviewsRef = useRef(null);
  const ctaRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Animation states
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Preload background images
  useEffect(() => {
    const backgrounds = [garba, officeparty, hall1, acaiaOutdoor];
    const loadImages = async () => {
      try {
        const promises = backgrounds.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        });
        
        await Promise.all(promises);
        setIsLoaded(true);
        setTimeout(() => setHeroVisible(true), 300);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoaded(true); // Set loaded even if there's an error to prevent infinite loading
      }
    };
    
    loadImages();
  }, []);

  // Background slider
  useEffect(() => {
    if (!isLoaded) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isLoaded]);

  // Reviews slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % 13);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      if (heroRef.current) {
        const heroTop = heroRef.current.getBoundingClientRect().top;
        setHeroVisible(heroTop < window.innerHeight * 0.8);
      }
      
      if (featuresRef.current) {
        const featuresTop = featuresRef.current.getBoundingClientRect().top;
        setFeaturesVisible(featuresTop < window.innerHeight * 0.8);
      }
      
      if (statsRef.current) {
        const statsTop = statsRef.current.getBoundingClientRect().top;
        setStatsVisible(statsTop < window.innerHeight * 0.8);
      }
      
      if (reviewsRef.current) {
        const reviewsTop = reviewsRef.current.getBoundingClientRect().top;
        setReviewsVisible(reviewsTop < window.innerHeight * 0.8);
      }
      
      if (ctaRef.current) {
        const ctaTop = ctaRef.current.getBoundingClientRect().top;
        setCtaVisible(ctaTop < window.innerHeight * 0.8);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render until contexts are ready
  if (userLoading || authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-emerald-900">
        <div className="text-center">
          <div className="mb-6">
            <svg className="animate-spin h-16 w-16 mx-auto text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-2xl font-medium text-white">Loading Experience...</p>
        </div>
      </div>
    );
  }

  // Loading state for images
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-emerald-900">
        <div className="text-center">
          <div className="mb-6">
            <svg className="animate-spin h-16 w-16 mx-auto text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-2xl font-medium text-white">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Use FrontNavbar instead of Navbar */}
      <FrontNavbar />
      
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background Slider with Parallax */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[officeparty, garba, hall1, acaiaOutdoor].map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-2000 ease-in-out ${
                activeIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              style={{
                transform: `translate(${mousePosition.x / 35}px, ${mousePosition.y / 35}px)`,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "50% 50%",
                backgroundRepeat: "no-repeat",
                filter: "brightness(0.95) contrast(1.1)",
                height: "100vh",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transformOrigin: "center",
                willChange: "transform, opacity"
              }}
            />
          ))}
          
          {/* Subtle vignette effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)",
              mixBlendMode: "multiply"
            }}
          />
        </div>
        
        {/* Hero Content */}
        <div 
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center md:text-left md:max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-white">{t.welcome}</span>
              <br/>
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">
                {t.subtitle}
              </span>
            </h1>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/categories"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors text-lg font-medium"
              >
                {t.browseRentals}
              </Link>
              <Link 
                to="/add-item"
                className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white rounded-xl transition-colors text-lg font-medium"
              >
                {t.listItems}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 bg-gradient-to-b from-emerald-900 to-green-900"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Why Choose AptoRent</h2>
            <p className="mt-4 text-lg text-emerald-200">Simplified rental experience for both renters and owners</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Easy Discovery",
                description: "Find the perfect rental items with our powerful search and filtering options."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Verified Listings",
                description: "Every listing is verified for quality and accuracy to ensure a great experience."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Competitive Pricing",
                description: "Get the best value with transparent pricing and no hidden fees."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}
                style={{
                  animation: featuresVisible ? `fadeInUp ${0.3 + index * 0.1}s ease-out forwards` : 'none',
                  opacity: 0,
                }}
              >
                <div className="text-emerald-300 mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-emerald-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-20 bg-emerald-950"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { number: "15,000+", label: "Available Items" },
              { number: "32,000+", label: "Happy Renters" },
              { number: "99%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-emerald-800/50 to-green-800/50 backdrop-blur-md rounded-2xl p-10 text-center"
                style={{
                  animation: statsVisible ? `fadeInUp ${0.3 + index * 0.1}s ease-out forwards` : 'none',
                  opacity: 0,
                }}
              >
                <div 
                  className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-emerald-300 to-green-300 text-transparent bg-clip-text"
                >
                  {stat.number}
                </div>
                <div className="text-emerald-200 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <section 
        ref={reviewsRef}
        className="py-20 bg-gradient-to-b from-emerald-950 to-green-900"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            reviewsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">What Our Users Say</h2>
            <p className="mt-4 text-lg text-emerald-200">Real experiences from our community of renters and owners</p>
          </div>
          
          {/* Reviews Slider */}
          <div className="relative overflow-hidden">
            {/* Review Cards */}
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeReviewIndex * 33.33}%)` }}
            >
              {[
                {
                  name: "Sarah Johnson",
                  role: "Apartment Renter",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                  rating: 5,
                  text: "Finding furniture for my new apartment was so easy with Sarthi. The process was smooth from browsing to delivery, and the quality exceeded my expectations!",
                  animDelay: 0.1
                },
                {
                  name: "Michael Chen",
                  role: "Business Owner",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                  rating: 5,
                  text: "As a business owner, I needed to furnish my office quickly. Sarthi saved me thousands compared to buying new, and the quality was excellent. Highly recommend!",
                  animDelay: 0.2
                },
                {
                  name: "Priya Sharma",
                  role: "Event Planner",
                  avatar: "https://randomuser.me/api/portraits/women/63.jpg",
                  rating: 5,
                  text: "I use Sarthi for all my events now. The selection is amazing, and the delivery is always on time. It's transformed how I approach event planning!",
                  animDelay: 0.3
                },
                {
                  name: "David Wilson",
                  role: "College Student",
                  avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                  rating: 5,
                  text: "As a student, I couldn't afford to buy all the furniture I needed. Sarthi helped me furnish my dorm room affordably, and returning was super easy!",
                  animDelay: 0.1
                },
                {
                  name: "Aisha Patel",
                  role: "Home Stager",
                  avatar: "https://randomuser.me/api/portraits/women/28.jpg",
                  rating: 5,
                  text: "Sarthi is a game-changer for my home staging business. I can access high-quality furniture at a fraction of the cost of buying. My clients are always impressed!",
                  animDelay: 0.2
                },
                {
                  name: "James Rodriguez",
                  role: "Filmmaker",
                  avatar: "https://randomuser.me/api/portraits/men/45.jpg",
                  rating: 5,
                  text: "I used Sarthi to find camera equipment for my independent film. The selection was impressive and the rates were perfect for our tight budget.",
                  animDelay: 0.3
                },
                {
                  name: "Emily Zhang",
                  role: "First-time Renter",
                  avatar: "https://randomuser.me/api/portraits/women/90.jpg",
                  rating: 4,
                  text: "The customer service at Sarthi is exceptional! When I had an issue with my delivery, they resolved it immediately and even offered a discount on my next rental.",
                  animDelay: 0.1
                },
                {
                  name: "Omar Hassan",
                  role: "Wedding Planner",
                  avatar: "https://randomuser.me/api/portraits/men/36.jpg",
                  rating: 5,
                  text: "I've planned over 50 weddings using Sarthi's decor and furniture. Their selection helps me create unique experiences for each couple without breaking their budget.",
                  animDelay: 0.2
                },
                {
                  name: "Sophia Martinez",
                  role: "Interior Designer",
                  avatar: "https://randomuser.me/api/portraits/women/17.jpg",
                  rating: 5,
                  text: "As an interior designer, I appreciate the high-quality options Sarthi offers. It allows me to showcase different styles to clients before they commit to purchases.",
                  animDelay: 0.3
                },
                {
                  name: "Alex Thompson",
                  role: "Remote Worker",
                  avatar: "https://randomuser.me/api/portraits/men/29.jpg",
                  rating: 5,
                  text: "When I started working from home, I needed a proper office setup. Sarthi helped me try different ergonomic chairs and desks before investing in my permanent setup.",
                  animDelay: 0.1
                },
                {
                  name: "Tanvi Gupta",
                  role: "Small Business Owner",
                  avatar: "https://randomuser.me/api/portraits/women/38.jpg",
                  rating: 5,
                  text: "Sarthi helped me furnish my new café without the massive upfront costs. The flexible rental terms were perfect as my business grew and changed.",
                  animDelay: 0.2
                },
                {
                  name: "Lucas Nguyen",
                  role: "Photographer",
                  avatar: "https://randomuser.me/api/portraits/men/55.jpg",
                  rating: 5,
                  text: "The photography equipment on Sarthi is top-notch. I've been able to try different lenses and cameras before making expensive purchases. Such a valuable service!",
                  animDelay: 0.3
                },
                {
                  name: "Nadia Khatri",
                  role: "Home Renovator",
                  avatar: "https://randomuser.me/api/portraits/women/79.jpg",
                  rating: 5,
                  text: "During our home renovation, we used Sarthi for temporary furniture. The process was smooth, and it was much more comfortable than living with just the bare essentials.",
                  animDelay: 0.1
                }
              ].map((review, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/3 flex-shrink-0 p-4"
                >
                  <div 
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 group relative"
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4 ring-2 ring-emerald-400">
                        <img src={review.avatar} alt={review.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{review.name}</h3>
                        <p className="text-emerald-300 text-sm">{review.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    <div className="relative overflow-hidden">
                      <p className="text-emerald-100 italic mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">"{review.text}"</p>
                    </div>
                    
                    <div className="pt-4 border-t border-emerald-800/30 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-300 text-sm">Verified Renter</span>
                        <span className="text-emerald-300 text-sm">2 weeks ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slider Controls */}
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(Math.ceil(13/3))].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIndex(idx * 3)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(activeReviewIndex / 3) === idx 
                      ? 'bg-emerald-400 w-6' 
                      : 'bg-emerald-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            
            {/* View All Reviews Button */}
            <div className="mt-12 text-center">
              <button 
                className="px-6 py-3 rounded-full text-white font-medium transform hover:scale-105 transition-all duration-300 border border-emerald-400/30 hover:border-emerald-400/80 bg-white/5 backdrop-blur-sm"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 bg-gradient-to-t from-emerald-900 to-green-900"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-gradient-to-r from-emerald-800/40 to-green-800/40 backdrop-blur-lg rounded-3xl p-10 md:p-16 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to find your perfect rental?</h2>
            <p className="text-lg text-emerald-200 mb-10 max-w-3xl mx-auto">
              Join thousands of happy renters who found their perfect items on Sarthi. Start browsing today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/categories"
                className="px-8 py-4 rounded-full text-white font-medium text-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
                  boxShadow: `0 10px 20px -10px ${theme.primary}`,
                }}
              >
                Start Browsing
              </Link>
              
              <button 
                className="px-8 py-4 rounded-full font-medium text-lg border-2 text-white border-white bg-transparent hover:bg-white hover:text-emerald-900 transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sitemap Footer */}
      <Sitemap />
      
      {/* Sarthi Chat */}
      <Sarthi />
    </div>
  );
}

export default Home;
