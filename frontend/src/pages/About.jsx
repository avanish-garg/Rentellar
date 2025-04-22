import React, { useState, useEffect } from "react";
import FrontNavbar from "../components/FrontNavbar";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import bgImage1 from "../assets/bg1.jpg";
import { Link } from "react-router-dom";

// Theme colors - Green theme (matching Home page)
const theme = {
  primary: "#10B981", // emerald-500
  secondary: "#059669", // emerald-600
  accent: "#34D399", // emerald-400
  text: "#FFFFFF",
  dark: "#064E3B", // emerald-900
  light: "#A7F3D0", // emerald-200
  overlay: "rgba(6, 78, 59, 0.8)",
};

function About() {
  const { language } = useLanguage();
  const t = translations[language].about;
  const [isLoaded, setIsLoaded] = useState(false);
  const [animations, setAnimations] = useState({
    header: false,
    mission: false,
    team: false,
    story: false,
    values: false,
  });

  // Preload background image
  useEffect(() => {
    const loadImage = async () => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = bgImage1;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    };
    
    loadImage().then(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setAnimations(prev => ({ ...prev, header: true }));
      }, 300);
    });
  }, []);

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Animate sections as they come into view
      const animateSectionIfVisible = (sectionId, animationKey) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top < viewportHeight * 0.8) {
            setAnimations(prev => ({ ...prev, [animationKey]: true }));
          }
        }
      };
      
      animateSectionIfVisible("mission-section", "mission");
      animateSectionIfVisible("team-section", "team");
      animateSectionIfVisible("story-section", "story");
      animateSectionIfVisible("values-section", "values");
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading state
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
          <p className="text-2xl font-medium text-white">Loading About Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navbar with custom theme */}
      <FrontNavbar fixedTheme={theme} />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20">
        {/* Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            style={{
              backgroundImage: `url(${bgImage1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              filter: "brightness(0.6)",
            }}
            className="absolute inset-0"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${theme.overlay} 0%, rgba(5, 150, 105, 0.7) 100%)`,
            }}
          />
        </div>
        
        {/* Hero Content */}
        <div 
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ease-out ${
            animations.header ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
              {t.title} <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">AptoRent</span>
            </h1>
            <p className="mt-6 text-xl text-gray-100 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section 
        id="mission-section"
        className="py-20 bg-white"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            animations.mission ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold" style={{ color: theme.dark }}>{t.ourMission}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto mt-4 mb-6 rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed">
              {t.missionText}
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full" style={{ backgroundColor: theme.light }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: theme.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold" style={{ color: theme.dark }}>Community</h3>
                <p className="mt-2 text-gray-600">Building trusted connections between renters and owners.</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full" style={{ backgroundColor: theme.light }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: theme.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold" style={{ color: theme.dark }}>Sustainability</h3>
                <p className="mt-2 text-gray-600">Reducing waste through sharing rather than buying.</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full" style={{ backgroundColor: theme.light }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: theme.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold" style={{ color: theme.dark }}>Affordability</h3>
                <p className="mt-2 text-gray-600">Making quality items accessible without the high purchase cost.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section 
        id="team-section"
        className="py-20 bg-gradient-to-b from-emerald-900 to-green-900 text-white"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            animations.team ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">Our Team</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-300 to-green-300 mx-auto mt-4 mb-6 rounded-full"></div>
            <p className="mt-4 text-lg text-emerald-200">Meet the passionate people behind Aptorent</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Avanish Garg",
                role: "Team Lead",
                bio: "With over 10 years in tech and sharing economy startups, Avanish founded Aptorent to revolutionize rental access."
              },
              {
                name: "Aastha Kanade",
                role: "Developer",
                bio: "Former Senior Developer at major tech companies, Aastha leads our technology vision and platform infrastructure."
              },
              {
                name: "Bharat Doshi",
                role: "Developer",
                bio: "Sam brings extensive experience in marketplace operations and customer support management."
              },
              {
                name: "Devanshi Lakhotia",
                role: "Developer",
                bio: "Taylor crafts our brand voice and growth strategies with a background in digital marketing."
              }
            ].map((member, index) => (
              <div key={index} className="bg-emerald-800 bg-opacity-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-emerald-300 font-medium">{member.role}</p>
                  <p className="mt-3 text-gray-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section 
        id="story-section"
        className="py-20 bg-white"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            animations.story ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold" style={{ color: theme.dark }}>Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto mt-4 mb-6 rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto" style={{ color: "#374151" }}>
              <p>
                Aptorent began in 2023 when our founder, Alex, moved to a new city and found himself needing to furnish a temporary apartment. The expensive options and lack of quality rentals inspired a vision: what if there was a platform where people could easily find high-quality rental items without the commitment of purchasing?
              </p>
              
              <p>
                Starting with just a small network of furniture owners willing to rent out their extra pieces, Aptorent quickly gained attention as both renters and owners discovered the mutual benefits. Our platform grew from a handful of listings in one city to thousands across the country.
              </p>
              
              <p>
                Today, we're proud to serve a diverse community of users who share our values of sustainability, quality, and community. Whether you're renting out items you don't use daily or finding exactly what you need without the burden of ownership, Aptorent is building a future where access trumps excess.
              </p>
              
              <div className="mt-10 space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: theme.light }}>
                    <span className="text-2xl font-bold" style={{ color: theme.primary }}>01</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>2023: Launch</h3>
                    <p className="text-gray-600">Founded in Seattle with 50 listings and 100 users</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: theme.light }}>
                    <span className="text-2xl font-bold" style={{ color: theme.primary }}>02</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>2023: Expansion</h3>
                    <p className="text-gray-600">Expanded to 5 major cities with 1,000+ listings</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: theme.light }}>
                    <span className="text-2xl font-bold" style={{ color: theme.primary }}>03</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>2024: Innovation</h3>
                    <p className="text-gray-600">Launched mobile app and verification system</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: theme.light }}>
                    <span className="text-2xl font-bold" style={{ color: theme.primary }}>04</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>Today</h3>
                    <p className="text-gray-600">10,000+ active users and growing nationwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section 
        id="values-section"
        className="py-20 bg-gray-50"
      >
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
            animations.values ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold" style={{ color: theme.dark }}>Our Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto mt-4 mb-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-md" style={{ backgroundColor: theme.primary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>Efficiency</h3>
                <p className="mt-2 text-gray-600">We build technology that eliminates friction and makes the rental process seamless for everyone involved.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-md" style={{ backgroundColor: theme.primary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>Trust & Safety</h3>
                <p className="mt-2 text-gray-600">We prioritize creating a safe platform with verified users, secure payments, and comprehensive insurance.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-md" style={{ backgroundColor: theme.primary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>Fairness</h3>
                <p className="mt-2 text-gray-600">Our platform balances the needs of renters and owners with transparent pricing and reasonable policies.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center rounded-md" style={{ backgroundColor: theme.primary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold" style={{ color: theme.dark }}>Environmental Impact</h3>
                <p className="mt-2 text-gray-600">Every rental on our platform represents a step toward a more sustainable consumption model.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Rental Revolution?</h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            Whether you're looking to rent items or share your own, Aptorent makes it simple, secure, and sustainable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/categories"
              className="px-8 py-4 rounded-full bg-white text-emerald-700 font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Browse Rentals
            </Link>
            <Link 
              to="/add-item"
              className="px-8 py-4 rounded-full border-2 border-white bg-transparent text-white font-medium text-lg hover:bg-white hover:text-emerald-700 transform hover:scale-105 transition-all duration-300"
            >
              List Your Items
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-emerald-900 text-emerald-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Aptorent</h3>
              <p className="text-sm">
                Reimagining the rental experience with a platform that connects people and possessions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/listings" className="hover:text-white transition-colors">Listings</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-emerald-200 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-emerald-800 text-center text-sm">
            <p>© 2024 Aptorent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About; 