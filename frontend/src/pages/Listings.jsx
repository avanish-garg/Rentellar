import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// Import images from assets
import diningChair from "../assets/diningchair.jpg";
import sofas from "../assets/sofas.jpg";
import table from "../assets/table.jpg";
import livingRoom from "../assets/Living Room.jpg";
import diningRoom from "../assets/Dining Room.jpg";
import cowhideSwivel from "../assets/Cow-Hide Swivel.jpg";
import acaiaOutdoor from "../assets/Acaia Outdoor.jpg";
import furnitureKit from "../assets/Furniture Moving Kit.jpg";
import bg1 from "../assets/bg1.jpg";

// Theme colors - Green theme
const greenTheme = {
  primary: "#10B981", // emerald-500
  secondary: "#059669", // emerald-600
  accent: "#34D399", // emerald-400
  text: "#FFFFFF",
  dark: "#064E3B", // emerald-900
  light: "#A7F3D0", // emerald-200
  overlay: "rgba(6, 78, 59, 0.8)",
  primaryHover: "#059669", // emerald-600
};

// Custom NavbarListings component just for Listings page
const NavbarListings = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Add scroll event listener to create navbar animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-gray-900'} transition-all duration-300 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <h1 className="text-2xl font-bold text-white">
                <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300">Apto</span>
                <span className="group-hover:text-gray-300 transition-colors duration-300">rent</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent hover:border-emerald-400/30">
              Home
            </Link>
            <Link to="/listings" className="text-emerald-400 border-b-2 border-emerald-400 px-3 py-2 text-sm font-medium">
              Listings
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent hover:border-emerald-400/30">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-emerald-400 px-3 py-2 text-sm font-medium transition-all duration-300 border-b-2 border-transparent hover:border-emerald-400/30">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="text-gray-300 border border-gray-700 hover:border-emerald-400 hover:text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10"
            >
              Log In
            </button>
            <button
              className="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/20 transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 focus:outline-none transition-transform duration-300"
              aria-label="Toggle menu"
            >
              {!isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-emerald-400 block px-3 py-2 text-base font-medium transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/listings" 
              className="text-emerald-400 font-medium block px-3 py-2 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Listings
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-emerald-400 block px-3 py-2 text-base font-medium transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-emerald-400 block px-3 py-2 text-base font-medium transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5 space-x-3">
              <button
                className="w-full text-gray-300 border border-gray-700 hover:text-emerald-400 hover:border-emerald-400 px-4 py-2 rounded-lg text-base font-medium my-2 transition-all duration-300"
              >
                Log In
              </button>
            </div>
            <div className="px-5 py-2">
              <button
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg text-base font-medium transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Listings = () => {
  const [activeTab, setActiveTab] = useState("LATEST PRODUCTS");
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const reviewsRef = useRef(null);
  const autoplayRef = useRef(null);
  const imageSliderRef = useRef(null);
  const [animatedElements, setAnimatedElements] = useState({});
  
  // Review form state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    role: "",
    rating: 5,
    content: "",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg" // Default avatar
  });
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Interior Designer",
      rating: 5,
      date: "2 weeks ago",
      content: "I rented furniture for a photoshoot and the quality exceeded my expectations. The entire process was smooth and the delivery was on time."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Business Owner",
      rating: 5,
      date: "3 weeks ago",
      content: "As a business owner, I needed to furnish my office quickly. Aptorent saved me thousands compared to buying new, and the quality was excellent."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      role: "Event Planner",
      rating: 5,
      date: "1 month ago",
      content: "I've used Aptorent for multiple events and the furniture always arrives in pristine condition. Their selection is unmatched!"
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      role: "Apartment Renter",
      rating: 4,
      date: "2 months ago",
      content: "Renting furniture for my new apartment was so convenient. The delivery team was professional and setup everything perfectly."
    },
    {
      id: 5,
      name: "Priya Patel",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      role: "Home Stager",
      rating: 5,
      date: "2 weeks ago",
      content: "As a home stager, I rely on quality furniture. Aptorent always delivers beautiful pieces that help sell homes faster."
    },
    {
      id: 6,
      name: "David Thompson",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "Student",
      rating: 5,
      date: "1 month ago",
      content: "Perfect solution for my college apartment! Affordable and stylish furniture without the commitment of buying."
    },
    {
      id: 7,
      name: "Sophia Martinez",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      role: "Photographer",
      rating: 5,
      date: "3 weeks ago",
      content: "The quality of their furniture makes for amazing backdrops in my photography sessions. Always impressed with their service."
    },
    {
      id: 8,
      name: "Robert Kim",
      avatar: "https://randomuser.me/api/portraits/men/64.jpg",
      role: "Real Estate Agent",
      rating: 4,
      date: "1 month ago",
      content: "I recommend Aptorent to all my clients who need temporary furnishing. They never disappoint and the process is hassle-free."
    },
    {
      id: 9,
      name: "Olivia Johnson",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      role: "Young Professional",
      rating: 5,
      date: "2 weeks ago",
      content: "Moving frequently for work made buying furniture impractical. Aptorent has been a game-changer for my lifestyle."
    },
    {
      id: 10,
      name: "Daniel Garcia",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      role: "Film Director",
      rating: 5,
      date: "1 month ago",
      content: "The variety of styles available helped us create the perfect set for our indie film. Will definitely use again."
    },
    {
      id: 11,
      name: "Aisha Khan",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      role: "Event Coordinator",
      rating: 5,
      date: "3 weeks ago",
      content: "I organized a corporate event and needed elegant furniture. Aptorent provided exactly what we needed and made the event look professional."
    },
    {
      id: 12,
      name: "Thomas Wright",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
      role: "Home Owner",
      rating: 4,
      date: "2 months ago",
      content: "During our home renovation, we rented furniture for our temporary living space. Made the transition so much easier."
    },
    {
      id: 13,
      name: "Leila Nguyen",
      avatar: "https://randomuser.me/api/portraits/women/48.jpg",
      role: "Small Business Owner",
      rating: 5,
      date: "1 month ago",
      content: "The flexibility of rental terms helped us furnish our startup office as we grew. Couldn't be happier with the service."
    },
    {
      id: 14,
      name: "Marcus Johnson",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      role: "Contractor",
      rating: 5,
      date: "2 weeks ago",
      content: "I recommend Aptorent to clients who need staging furniture. Their quality and reliability are consistently excellent."
    },
    {
      id: 15,
      name: "Nina Patel",
      avatar: "https://randomuser.me/api/portraits/women/76.jpg",
      role: "Interior Design Student",
      rating: 4,
      date: "3 weeks ago",
      content: "Used Aptorent for my final design project. The furniture pieces were modern and exactly what I needed for my portfolio."
    },
    {
      id: 16,
      name: "Carlos Rodriguez",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      role: "Corporate Event Manager",
      rating: 5,
      date: "1 month ago",
      content: "We host quarterly corporate events and always turn to Aptorent. Their consistent quality and timeliness is impressive."
    },
    {
      id: 17,
      name: "Jasmine Williams",
      avatar: "https://randomuser.me/api/portraits/women/39.jpg",
      role: "Newlywed",
      rating: 5,
      date: "2 months ago",
      content: "My husband and I rented furniture while saving for our dream pieces. The quality was so good, we're taking our time to buy now!"
    },
    {
      id: 18,
      name: "Tyler Stevens",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      role: "Airbnb Host",
      rating: 5,
      date: "3 weeks ago",
      content: "I furnish all my Airbnb properties with Aptorent. My guests always compliment the stylish and comfortable furniture."
    },
    {
      id: 19,
      name: "Rachel Cohen",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
      role: "TV Producer",
      rating: 4,
      date: "1 month ago",
      content: "We used Aptorent for a TV show set and were impressed with the quality and variety. Made our production look high-end on a budget."
    },
    {
      id: 20,
      name: "Hiro Tanaka",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      role: "International Student",
      rating: 5,
      date: "2 weeks ago",
      content: "As an international student, buying furniture wasn't practical. Aptorent provided everything I needed with just a few clicks."
    }
  ]);

  // Premium carousel images
  const premiumItems = [
    {
      id: 1,
      name: "Professional DSLR Camera",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200",
      tag: "Premium"
    },
    {
      id: 2,
      name: "Studio Lighting Kit",
      image: "https://images.unsplash.com/photo-1598908314732-07113901949e?q=80&w=1200",
      tag: "Featured"
    },
    {
      id: 3,
      name: "Modern Lounge Furniture",
      image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1200",
      tag: "Limited"
    },
    {
      id: 4,
      name: "Professional DJ Equipment",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
      tag: "Pro Audio"
    },
    {
      id: 5,
      name: "Event Decor Package",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200",
      tag: "New"
    }
  ];

  // Animation Observer setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedElements(prev => ({
            ...prev,
            [entry.target.dataset.id]: true
          }));
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('[data-animation]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto scroll reviews every 5 seconds
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setActiveReviewIndex(prevIndex => (prevIndex + 1) % 5); // 5 pages of reviews (4 reviews per page)
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  // Pause autoplay on hover
  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  // Resume autoplay when mouse leaves
  const resumeAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    autoplayRef.current = setInterval(() => {
      setActiveReviewIndex(prevIndex => (prevIndex + 1) % 5);
    }, 5000);
  };

  // Auto scroll product images every 3 seconds
  useEffect(() => {
    const startImageSlider = () => {
      imageSliderRef.current = setInterval(() => {
        setActiveImageIndex(prevIndex => (prevIndex + 1) % premiumItems.length);
      }, 3000);
    };
    
    startImageSlider();
    
    return () => {
      if (imageSliderRef.current) {
        clearInterval(imageSliderRef.current);
      }
    };
  }, [premiumItems.length]);

  // Pause image autoplay on hover
  const pauseImageAutoplay = () => {
    if (imageSliderRef.current) {
      clearInterval(imageSliderRef.current);
    }
  };

  // Resume image autoplay when mouse leaves
  const resumeImageAutoplay = () => {
    if (imageSliderRef.current) {
      clearInterval(imageSliderRef.current);
    }
    imageSliderRef.current = setInterval(() => {
      setActiveImageIndex(prevIndex => (prevIndex + 1) % premiumItems.length);
    }, 3000);
  };

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem("customerReviews");
    if (savedReviews) {
      setReviewsList(JSON.parse(savedReviews));
    }
  }, []);

  // Save reviews to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem("customerReviews", JSON.stringify(reviewsList));
  }, [reviewsList]);

  // Handle review form input changes
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  // Handle star rating click
  const handleRatingClick = (rating) => {
    setNewReview({
      ...newReview,
      rating
    });
  };

  // Submit review form
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    // Create new review object
    const submittedReview = {
      id: reviewsList.length + 1,
      name: newReview.name,
      avatar: newReview.avatar,
      role: newReview.role,
      rating: newReview.rating,
      date: "Just now",
      content: newReview.content
    };
    
    // Add new review to the list
    const updatedReviews = [submittedReview, ...reviewsList];
    setReviewsList(updatedReviews);
    
    // Reset form and close modal
    setNewReview({
      name: "",
      email: "",
      role: "",
      rating: 5,
      content: "",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg"
    });
    setIsReviewModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavbarListings />
      
      {/* Hero Section with staggered animations */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden min-h-[600px] flex items-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl border border-gray-700/30">
          <div 
            className="max-w-lg relative z-10 p-12 animate-fadeInUp" 
            data-animation="fadeInUp"
            data-id="hero-content"
          >
            <div className="mb-8 animate-fadeInLeft" style={{animationDelay: '0.2s'}}>
              <p className="text-gray-400">AptoRent</p>
              <p className="text-gray-400">Premium Collection</p>
            </div>
            <p className="uppercase text-sm font-semibold mb-4 text-emerald-400 animate-fadeInLeft" style={{animationDelay: '0.4s'}}>Professional Equipment</p>
            <h1 className="text-6xl font-light mb-6 text-white animate-fadeInLeft" style={{animationDelay: '0.6s'}}>
              Premium
              <br />
              Rentals
            </h1>
            <Link 
              to="/explore" 
              className="inline-block bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 animate-fadeInUp"
              style={{animationDelay: '0.8s'}}
            >
              Shop now →
            </Link>
            
            {/* Product Showcase - Small thumbnails */}
            <div className="mt-8 grid grid-cols-5 gap-2 animate-fadeInUp" style={{animationDelay: '1s'}}>
              {premiumItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`bg-gray-800/70 rounded-lg p-1 transform transition-all hover:scale-105 cursor-pointer ${activeImageIndex === index ? 'ring-2 ring-emerald-400' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-12 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Image Carousel */}
          <div 
            className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center animate-fadeInRight" 
            style={{animationDelay: '0.3s'}}
            onMouseEnter={pauseImageAutoplay}
            onMouseLeave={resumeImageAutoplay}
          >
            <div className="relative w-full max-w-xl mr-0 overflow-hidden">
              <div className="absolute -z-10 right-0 top-0 w-full h-full bg-gray-700/30 backdrop-blur-xl rounded-2xl transform scale-110 translate-x-16 -translate-y-8 animate-pulse"></div>
              
              {/* Image Slider */}
              <div className="relative w-full h-[550px] overflow-hidden rounded-xl shadow-2xl">
                <div 
                  className="flex h-full transition-all duration-500" 
                  style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                  {premiumItems.map((item) => (
                    <div key={item.id} className="min-w-full w-full h-full flex-shrink-0 relative flex items-center justify-center">
                      <div className="w-full h-full overflow-hidden">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute bottom-8 left-8 bg-gray-900/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium text-lg shadow-lg">
                          {item.name}
                        </div>
                        <div className="absolute top-8 right-8 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg font-medium">
                          {item.tag}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button 
                  onClick={() => setActiveImageIndex(prev => (prev === 0 ? premiumItems.length - 1 : prev - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-emerald-500/80 transition-all duration-300 shadow-lg z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setActiveImageIndex(prev => (prev === premiumItems.length - 1 ? 0 : prev + 1))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full text-white hover:bg-emerald-500/80 transition-all duration-300 shadow-lg z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              
                {/* Pagination Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
                  {premiumItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        activeImageIndex === index ? 'bg-emerald-400 w-8' : 'bg-gray-600 w-3 hover:bg-gray-500'
                      }`}
                      aria-label={`View product ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-12 text-[120px] font-light text-gray-700 opacity-30 select-none animate-fadeIn" style={{animationDelay: '1s'}}>
            01
          </div>
        </div>
      </div>

      {/* Shop by Categories with hover effects */}
      <div className="container mx-auto px-4 py-16">
        <div 
          className="flex items-center gap-8 mb-12 animate-fadeInUp"
          data-animation="fadeInUp"
          data-id="categories-header"
        >
          <div>
            <h2 className="text-2xl font-semibold text-white">Shop</h2>
            <p className="text-gray-400">by categories</p>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <Link 
            to="/categories" 
            className="text-sm text-emerald-400 ml-auto hover:text-emerald-300 transition-colors duration-300 flex items-center group"
          >
            All categories 
            <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Home Appliances', image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce" },
            { name: 'Electronics & Gadgets', image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1200" },
            { name: 'Furniture', image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" },
          ].map((category, idx) => (
            <div 
              key={category.name}
              className="group relative overflow-hidden rounded-xl cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${0.2 * idx}s` }}
              data-animation="fadeInUp"
              data-id={`category-${idx}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-70"></div>
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-xl font-semibold text-white mb-1">{category.name}</h3>
                <p className="text-emerald-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">Explore →</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-[300px] rounded-lg overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094" alt="Office & Work" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-all duration-300">
              <div className="text-center text-white">
                <p className="text-sm mb-2">25% OFF ALL ITEMS</p>
                <h3 className="text-3xl font-light mb-4">Office & Work</h3>
                <Link to="/explore" className="bg-emerald-500 px-6 py-2 rounded hover:bg-emerald-600 transition-all duration-300">
                  Shop now
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819" alt="Event & Party" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-all duration-300">
              <div className="text-center text-white">
                <p className="text-sm mb-2">25% OFF ALL ITEMS</p>
                <h3 className="text-3xl font-light mb-4">Event & Party</h3>
                <Link to="/explore" className="bg-emerald-500 px-6 py-2 rounded hover:bg-emerald-600 transition-all duration-300">
                  Shop now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-white">Hot Products</h2>
          <div className="flex gap-6">
            {["LATEST PRODUCTS", "TOP RATED", "BEST SELLERS"].map((tab) => (
              <button
                key={tab}
                className={`text-sm ${
                  activeTab === tab ? "text-emerald-400 font-medium" : "text-gray-400"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <a href="#" className="text-sm text-emerald-400 hover:text-emerald-300">All products →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "DSLR Camera",
              price: "₹800/day",
              image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
              rating: 4.5,
              reviews: 12,
              timer: "50h : 14h : 44m : 52s"
            },
            {
              name: "Washing Machine",
              price: "₹199/day",
              image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce",
              rating: 4.2,
              reviews: 8,
              tag: "HOT"
            },
            {
              name: "DJ Speaker System",
              price: "₹999/day",
              image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89",
              rating: 4.8,
              reviews: 15,
              tag: "NEW"
            },
            {
              name: "Professional Drone",
              price: "₹1,200/day",
              image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9",
              rating: 4.6,
              reviews: 10
            }
          ].map((product, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="relative mb-4">
                <div className="h-48 rounded-lg overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {product.tag && (
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                    {product.tag}
                  </span>
                )}
              </div>
              <h3 className="font-medium mb-2 text-white">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-medium">{product.price}</span>
                {product.timer && (
                  <span className="text-xs text-gray-400">{product.timer}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section - Before Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-emerald-400 max-w-2xl mx-auto">Read genuine reviews from our customers who have experienced our furniture rental service firsthand.</p>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4"></div>
        </div>

        {/* Reviews Carousel */}
        <div 
          ref={reviewsRef}
          className="relative overflow-hidden"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
        >
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeReviewIndex * 100}%)` }}
          >
            {[0, 1, 2, 3, 4].map((pageIndex) => (
              <div key={pageIndex} className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviewsList.slice(pageIndex * 4, pageIndex * 4 + 4).map((review) => (
                  <div 
                    key={review.id}
                    className="bg-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20 hover:bg-gray-800/90"
                  >
                    <div className="flex items-start mb-4">
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-12 h-12 rounded-full mr-4 border-2 border-emerald-400 object-cover"
                      />
                      <div>
                        <h4 className="text-white font-medium">{review.name}</h4>
                        <p className="text-emerald-400 text-sm">{review.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-400 text-xs ml-2">{review.date}</span>
                    </div>
                    
                    <p className="text-gray-300 italic mb-3">"{review.content}"</p>
                    
                    <div className="pt-3 border-t border-gray-700">
                      <p className="text-emerald-400 text-sm">Verified Customer</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <button
                key={index}
                onClick={() => setActiveReviewIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeReviewIndex === index ? 'bg-emerald-400 w-6' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                aria-label={`Go to review page ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation arrows */}
          <button 
            onClick={() => setActiveReviewIndex(prev => (prev === 0 ? 4 : prev - 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/80 p-2 rounded-r-lg text-white hover:bg-emerald-600 transition-colors duration-300 hidden md:block"
            aria-label="Previous reviews"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={() => setActiveReviewIndex(prev => (prev === 4 ? 0 : prev + 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/80 p-2 rounded-l-lg text-white hover:bg-emerald-600 transition-colors duration-300 hidden md:block"
            aria-label="Next reviews"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Call-to-action */}
        <div className="text-center mt-10">
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Leave Your Review
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Share Your Experience</h3>
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name*</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newReview.name}
                      onChange={handleReviewInputChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Your Email*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newReview.email}
                      onChange={handleReviewInputChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Your Role/Occupation</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={newReview.role}
                    onChange={handleReviewInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Student, Designer, Business Owner, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Rating*</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingClick(rating)}
                        className="focus:outline-none"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-8 w-8 ${rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Your Review*</label>
                  <textarea
                    id="content"
                    name="content"
                    value={newReview.content}
                    onChange={handleReviewInputChange}
                    required
                    rows={5}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Share your experience with our products or services..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Free Shipping",
              desc: "Free Shipping on all orders",
              icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            },
            {
              title: "Money Guarantee",
              desc: "30 Days money back",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            },
            {
              title: "Online Support 24/7",
              desc: "Technical Support 24/7",
              icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            },
            {
              title: "Secure Payment",
              desc: "All cards accepted",
              icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">{feature.title}</p>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listings;
