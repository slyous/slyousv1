import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import DiamondCollection from './pages/DiamondCollection';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import WireTransferCheckout from './pages/WireTransferCheckout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AdminProducts from './pages/AdminProducts';
import AdminProductEdit from './pages/AdminProductEdit';
import Authenticity from './pages/Authenticity';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import AboutUs from './pages/AboutUs';
import Boutiques from './pages/Boutiques';
import Consultation from './pages/Consultation';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <WishlistProvider>
            <Router>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen selection:bg-bright-gold selection:text-void overflow-x-hidden">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/diamonds" element={<DiamondCollection />} />
                    <Route path="/diamonds/:slug" element={<ProductDetail />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/wire/:id" element={<WireTransferCheckout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/products/:id" element={<AdminProductEdit />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/track-order/:id" element={<TrackOrder />} />
                    <Route path="/authenticity" element={<Authenticity />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/boutique-locations" element={<Boutiques />} />
                    <Route path="/consultation" element={<Consultation />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </WishlistProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
