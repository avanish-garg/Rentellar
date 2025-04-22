import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const siteLinks = {
    'Main Pages': [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Explore', path: '/explore' },
    ],
    'User Account': [
      { name: 'Login', path: '/login' },
      { name: 'Sign Up', path: '/signup' },
      { name: 'Profile', path: '/profile' },
      { name: 'Forgot Password', path: '/forgetpass' },
    ],
    'Rental': [
      { name: 'Categories', path: '/categories' },
      { name: 'Listings', path: '/listings' },
      { name: 'Add Item', path: '/add-item' },
      { name: 'Cart', path: '/cart' },
      { name: 'Checkout', path: '/checkout' },
    ]
  };

  return (
    <div className="bg-emerald-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(siteLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-emerald-200 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-emerald-800 text-center text-emerald-200">
          <p>&copy; {new Date().getFullYear()} Aptorent. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap; 