import React from 'react'
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgetPassword from './components/forgetpass'
import Success from './components/success'
import PasswordSuccess from './components/PasswordSuccess'
import Listings from './pages/Listings'
import About from './pages/About'
import Contact from './pages/Contact'
import Categories from './pages/Categories'
import CategoryListings from './pages/CategoryListings'
import Explore from './pages/Explore'
import AddItem from './pages/AddItem'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ItemDetail from './pages/ItemDetail'
import Orders from './pages/Orders'
import Education from './pages/Education'
import { UserProvider } from './context/UserContext'
import { ItemProvider } from './context/ItemContext'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import FrontNavbar from './components/FrontNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import RentalList from './components/rental/RentalList'
import RentalDetail from './components/rental/RentalDetail'
import AddRental from './components/rental/AddRental'
import Sitemap from './components/Sitemap'

// Layout component with Navbar for all routes
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <FrontNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Sitemap />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ItemProvider>
            <LanguageProvider>
              <CartProvider>
                <Routes>
                  {/* Layout wrapper for all routes */}
                  <Route element={<Layout />}>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/signup" element={<Navigate to="/register" replace />} />
                    <Route path="/forgot-password" element={<ForgetPassword />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/password-success" element={<PasswordSuccess />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:id" element={<CategoryListings />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/item/:id" element={<ItemDetail />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/rentals" element={<RentalList />} />
                    <Route path="/rentals/:id" element={<RentalDetail />} />

                    {/* Protected routes */}
                    <Route
                      path="/add-item"
                      element={
                        <ProtectedRoute roles={['lender', 'admin']}>
                          <AddItem />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/add-rental"
                      element={
                        <ProtectedRoute roles={['lender', 'admin']}>
                          <AddRental />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
              </CartProvider>
            </LanguageProvider>
          </ItemProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
