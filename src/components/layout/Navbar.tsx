import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import Button from '../ui/Button';
import { useWishlist } from '@/src/context/WishlistContext';
import { useAuth } from '@/src/context/AuthContext';
import { signInWithGoogle, auth } from '@/src/lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Diamonds', path: '/diamonds' },
    { name: 'Collections', path: '/collections' },
    { name: 'Certification', path: '/certification' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-6 lg:px-12',
        isScrolled ? 'bg-void/90 backdrop-blur-md py-4' : 'bg-transparent'
      )}
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
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
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden sm:flex items-center gap-6 text-ivory/70">
            <button className="hover:text-white transition-colors">
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
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => signOut(auth)}
                  className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-colors"
                >
                  Logout
                </button>
                <div className="w-8 h-8 rounded-full border border-dark-gold/30 overflow-hidden">
                  <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>

          <Link to="/cart">
            <div className="nav-pill-themed text-ivory/80 group hover:text-white">
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Cart (2)</span>
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
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
            className="fixed inset-0 bg-void z-40 lg:hidden flex flex-col items-center justify-center gap-12"
          >
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
            <div className="flex gap-8 text-white pt-8 border-t border-white/10 w-48 justify-center">
              <Search className="w-6 h-6" />
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="relative">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-crimson text-white text-[8px] flex items-center justify-center rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <User className="w-6 h-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
