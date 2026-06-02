import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ShieldAlert, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Button from '../ui/Button';
import { useWishlist } from '@/src/context/WishlistContext';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
      navigate(`/diamonds?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collection', path: '/diamonds' },
    { name: 'Certification', path: '/authenticity' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'About', path: '/about-us' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-6 lg:px-12',
        isScrolled ? 'bg-void/90 backdrop-blur-md py-4' : 'bg-transparent'
      )}
    >
      <div className="relative z-50 max-w-[1920px] mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="relative z-50">
          <h1 className="text-2xl lg:text-3xl font-serif italic text-white tracking-tight">
            Veloura
          </h1>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'text-[13px] uppercase tracking-[0.2em] font-sans transition-colors',
                  isActive ? 'text-bright-gold' : 'text-ivory/70 hover:text-white'
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'text-[13px] uppercase tracking-[0.2em] font-sans transition-colors',
                  isActive ? 'text-bright-gold' : 'text-ivory/70 hover:text-white'
                )
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden sm:flex items-center gap-6 text-ivory/70">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="hover:text-white transition-colors relative group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-crimson text-white text-[8px] flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/track-order" className="hover:text-white transition-colors relative group">
              <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-graphite border border-white/10 px-2 py-1 rounded text-[8px] uppercase tracking-widest text-ivory opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Track Order</span>
            </Link>
            {user ? (
              <div className="relative group/user">
                <button className="w-8 h-8 rounded-full border border-dark-gold/30 overflow-hidden hover:border-bright-gold transition-colors block cursor-pointer bg-bright-gold/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-bright-gold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                </button>
                
                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-graphite border border-white/10 rounded-card shadow-2xl py-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-xs text-white font-medium truncate">{user.name || 'Guest'}</p>
                    <p className="text-[10px] text-muted-text truncate">{user.email}</p>
                  </div>
                  <Link to="/account" className="flex items-center gap-3 px-4 py-2 text-ivory hover:text-white hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Account Settings</span>
                  </Link>
                  <Link to="/account?tab=orders" className="flex items-center gap-3 px-4 py-2 text-ivory hover:text-white hover:bg-white/5 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">Order History</span>
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-crimson hover:bg-crimson/10 transition-colors border-t border-white/5 mt-2 text-left">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hover:text-white transition-colors block"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative group">
            <div className="nav-pill-themed text-ivory/80 hover:text-white">
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Cart</span>
              {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-bright-gold text-void text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white relative z-50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-void z-[100] lg:hidden flex flex-col items-center justify-center gap-12"
          >
            <button
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-serif italic text-white hover:text-bright-gold transition-colors"
              >
                {link.name}
              </NavLink>
            ))}
            {isAdmin && (
               <NavLink
                 to="/admin"
                 onClick={() => setMobileMenuOpen(false)}
                 className="text-2xl font-serif italic text-white hover:text-bright-gold transition-colors"
               >
                 Admin
               </NavLink>
            )}
            <div className="flex gap-8 text-white pt-8 border-t border-white/10 w-48 justify-center">
              <button onClick={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }}>
                <Search className="w-6 h-6" />
              </button>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="relative">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-crimson text-white text-[8px] flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              {user ? (
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="relative w-6 h-6 rounded-full border border-dark-gold/30 overflow-hidden flex items-center justify-center bg-bright-gold/20">
                  <span className="text-[10px] font-bold text-bright-gold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void/90 backdrop-blur-md z-[110] flex items-center justify-center p-6"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 lg:top-12 lg:right-12 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-2xl">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search diamonds, collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-white/20 text-white text-3xl lg:text-5xl font-serif italic py-4 pl-0 pr-12 focus:outline-none focus:border-bright-gold placeholder-white/30 transition-colors"
                  />
                  <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-bright-gold transition-colors">
                    <Search className="w-8 h-8" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
