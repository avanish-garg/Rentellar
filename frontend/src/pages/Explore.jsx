import React from 'react';
import { Link } from 'react-router-dom';

const Explore = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <header className="py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>All Categories</span>
            </button>
            <Link to="/" className="text-xl font-bold">
              <span className="text-emerald-400">Apto</span>rent
            </Link>
          </div>
          <div className="text-right">
            <Link to="/listings/new" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg font-medium ml-4">
              New Listing
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Explore</h1>
        
        {/* Search Bar */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search for items, collections, and more"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-4 px-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Link to="/category/tools-equipment" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1550963295-019d8a8a61c5" 
                alt="Tools & Equipment"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">🔧 Tools & Equipment</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Power tools, Gardening tools, Construction tools</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/electronics-gadgets" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1617376881716-044c8c11424a" 
                alt="Electronics & Gadgets"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">📸 Electronics & Gadgets</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Cameras, Drones, Projectors, Gaming consoles</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/sports-outdoor" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b" 
                alt="Sports & Outdoor Gear"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">🚴 Sports & Outdoor</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Bicycles, Camping gear, Fishing equipment</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/event-party" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819" 
                alt="Event & Party Supplies"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">🎉 Event & Party</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Sound systems, DJ equipment, Decorations</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/office-work" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1497215842964-222b430dc094" 
                alt="Office & Work Essentials"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">💼 Office & Work</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Laptops, Printers, Whiteboards, Speakerphones</p>
              </div>
            </div>
          </Link>

          <Link to="/category/travel-adventure" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800" 
                alt="Travel & Adventure"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">🧳 Travel & Adventure</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Travel bags, Strollers, Adapters, GoPros</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/costumes-fashion" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1605082755169-f0e46cc031aa" 
                alt="Costumes & Fashion"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">🎭 Costumes & Fashion</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Party costumes, Wedding attire, Accessories</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/home-furniture" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126" 
                alt="Home & Furniture"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">🏠 Home & Furniture</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Air mattresses, Furniture, Kitchen appliances</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/learning-educational" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06" 
                alt="Learning & Educational Tools"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">📚 Learning & Educational</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Musical instruments, Scientific kits, Language tools</p>
              </div>
            </div>
          </Link>
          
          <Link to="/category/miscellaneous" className="block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1616163691772-4a0896c5a7a1" 
                alt="Miscellaneous & Unique Items"
                className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                <h3 className="font-medium text-center">🎯 Miscellaneous</h3>
                <p className="text-xs text-center text-gray-300 mt-1">Metal detectors, Photography props, Board games</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Section */}
        <h2 className="text-2xl font-bold mb-6">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link to="/product/washing-machine" className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-4">
              <div className="h-40 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1610557892470-55d9e80c0bce" 
                  alt="Washing Machine"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">Washing Machine</h3>
              <p className="text-gray-400 text-sm">Popular among students and bachelors in rented flats</p>
            </div>
          </Link>
          
          <Link to="/product/dslr-camera" className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-4">
              <div className="h-40 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32" 
                  alt="DSLR Camera"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">DSLR Camera</h3>
              <p className="text-gray-400 text-sm">In demand for weddings, travel, and content creation</p>
            </div>
          </Link>
          
          <Link to="/product/trekking-tent" className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-4">
              <div className="h-40 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4" 
                  alt="Trekking Tent"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">Trekking Tent</h3>
              <p className="text-gray-400 text-sm">Ideal for weekend getaways and trekking enthusiasts</p>
            </div>
          </Link>
          
          <Link to="/product/dj-speaker-system" className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-4">
              <div className="h-40 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89" 
                  alt="DJ Speaker System"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">DJ Speaker System</h3>
              <p className="text-gray-400 text-sm">Perfect for house parties and small events</p>
            </div>
          </Link>
          
          <Link to="/product/laptop" className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-4">
              <div className="h-40 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853" 
                  alt="Laptop"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">Laptop</h3>
              <p className="text-gray-400 text-sm">Required for remote work, freelancing, and online classes</p>
            </div>
          </Link>
          
          <Link to="/product/wheelchair" className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-4">
              <div className="h-40 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1568772574335-30431a7d4981" 
                  alt="Wheelchair"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">Wheelchair</h3>
              <p className="text-gray-400 text-sm">Useful for temporary medical needs, post-surgery recovery</p>
            </div>
          </Link>
          
          <Link to="/product/drone" className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-4">
              <div className="h-40 rounded-lg mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507582020474-9a35b7d455d9" 
                  alt="Drone"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">Drone</h3>
              <p className="text-gray-400 text-sm">Popular for aerial photography and creative projects</p>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/new-arrivals" className="flex items-center text-gray-400 hover:text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            New Arrivals
          </Link>
          
          <Link to="/trending" className="flex items-center text-gray-400 hover:text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Trending
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Explore; 