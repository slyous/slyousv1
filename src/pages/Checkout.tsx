import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Truck, Zap, Clock } from 'lucide-react';
import { formatCurrency, cn } from '@/src/lib/utils';
import Button from '@/src/components/ui/Button';
import { useCart } from '@/src/context/CartContext';
import { useToast } from '@/src/context/ToastContext';
import { useAuth } from '@/src/context/AuthContext';
import { fetchApi } from '@/src/lib/api';
import { OrderStatus } from '@/src/types';

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard', cost: 0, time: '5-7 business days', icon: Truck },
];

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map(item => ({ id: item.diamond.id, name: item.diamond.name, price: item.diamond.price, quantity: item.quantity, images: item.diamond.images })),
        totalPrice: subtotal + selectedShipping.cost,
        shipping: {
          fullName,
          street: streetAddress,
          city,
          state,
          postalCode,
          country
        },
        phone
      };

      const res = await fetchApi('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create order');
      const orderData = await res.json();
      const orderId = orderData.orderId;
      const orderNumber = orderData.orderNumber;

      if (email) {
        try {
          // Fire and forget email
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({
              to: email,
              subject: `Order Confirmation - Veloura Diamonds #${orderNumber}`,
              text: `Thank you for your order!\n\nYour order #${orderNumber} has been successfully placed. We will contact you shortly with wire transfer instructions.\n\nTotal: ${formatCurrency(total)}\n\nTrack your order at: ${window.location.origin}/track-order/${orderId}?email=${encodeURIComponent(email)}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FFFFFF; padding: 40px; border-radius: 8px;">
                   <h1 style="color: #D4AF37; font-family: Georgia, serif; font-style: italic;">Veloura Diamonds</h1>
                   <h2 style="font-size: 18px; margin-bottom: 20px;">Order Confirmation</h2>
                   <p style="color: #EAEAEA; line-height: 1.6;">Thank you for your acquisition. Your order <strong style="font-family: monospace;">#${orderNumber}</strong> has been successfully placed.</p>
                   <p style="color: #EAEAEA; line-height: 1.6;">Please complete your wire transfer to begin processing. You will receive an email from our concierge desk with explicit wire instructions shortly.</p>
                   <h3 style="color: #D4AF37; margin-top: 30px; font-size: 16px;">Acquisition Summary</h3>
                   <p style="color: #A0A0A0;">Total: ${formatCurrency(total)}</p>
                   <a href="${window.location.origin}/track-order/${orderId}?email=${encodeURIComponent(email)}" style="display: inline-block; margin-top: 30px; padding: 12px 24px; background: #D4AF37; color: #0A0A0A; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Your Order</a>
                </div>
              `
            })
          });
        } catch (e) {
          console.error("Failed to send order placed notification", e);
        }
      }

      showToast("Order placed successfully!", "success");
      clearCart();
      navigate(`/checkout/wire/${orderId}`);
    } catch (error) {
      console.error('Order creation error:', error);
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = subtotal + selectedShipping.cost;

  return (
    <div className="bg-void min-h-screen pt-32 pb-32 px-6 lg:px-12">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">
        
        {/* Left: Forms */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4 mb-12">
            <Link to="/cart" className="text-muted-text hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-serif text-white italic">Secure Checkout</h1>
          </div>

          {/* Progress Stepper */}
          <div className="flex items-center gap-6 mb-16 px-4 py-6 bg-graphite/20 rounded-card border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-bright-gold text-void flex items-center justify-center font-mono text-sm font-bold">1</div>
              <span className="text-xs uppercase tracking-widest text-white">Shipping</span>
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-8 h-8 rounded-full bg-graphite text-ivory flex items-center justify-center font-mono text-sm font-bold border border-white/10">2</div>
              <span className="text-xs uppercase tracking-widest text-ivory">Payment</span>
            </div>
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-8 h-8 rounded-full bg-graphite text-ivory flex items-center justify-center font-mono text-sm font-bold border border-white/10">3</div>
              <span className="text-xs uppercase tracking-widest text-ivory">Review</span>
            </div>
          </div>

          {/* Shipping Form */}
          <form onSubmit={handlePlaceOrder} className="space-y-12">
            <section>
              <h3 className="text-xl font-serif text-white italic mb-8 border-b border-white/5 pb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com" 
                    className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+ 1 ..." 
                    className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-serif text-white italic mb-8 border-b border-white/5 pb-4">Shipping Destination</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Street Address</label>
                  <input 
                    type="text" 
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Luxury Avenue" 
                    className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">City</label>
                    <input 
                      type="text" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York" 
                      className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">State / Province</label>
                    <input 
                      type="text" 
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="NY" 
                      className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Postal Code</label>
                    <input 
                      type="text" 
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10001" 
                      className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Country</label>
                    <input 
                      type="text" 
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States of America" 
                      className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" 
                    />
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-serif text-white italic mb-8 border-b border-white/5 pb-4">Shipping Method</h3>
              <div className="space-y-4">
                {SHIPPING_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedShipping(option)}
                    className={cn(
                      "w-full flex items-center justify-between p-6 rounded-section-card border transition-all text-left",
                      selectedShipping.id === option.id 
                        ? "bg-bright-gold/5 border-bright-gold" 
                        : "bg-graphite/20 border-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        selectedShipping.id === option.id ? "bg-bright-gold/20 text-bright-gold" : "bg-white/5 text-muted-text"
                      )}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">{option.name}</p>
                        <p className="text-xs text-muted-text font-mono">{option.time}</p>
                      </div>
                    </div>
                    <div>
                      {option.cost === 0 ? (
                        <span className="text-emerald-400 font-mono text-xs uppercase">Complimentary</span>
                      ) : (
                        <span className="text-bright-gold">{formatCurrency(option.cost)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-16 mt-8" 
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? 'Confirming Order...' : 'Proceed to Wire Transfer'}
            </Button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-graphite/30 rounded-section-card p-10 sticky top-32 border border-white/5">
            <h2 className="text-2xl font-serif text-white italic mb-10">Order Summary</h2>
            
            <div className="space-y-8 mb-10 pb-10 border-b border-white/5">
              {cart.map((item) => (
                <div key={item.diamond.id} className="flex gap-6">
                  <div className="w-20 h-20 bg-white rounded-card p-2 flex-shrink-0">
                    <img src={item.diamond.images[0]} alt={item.diamond.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-sans text-sm font-medium mb-1">{item.diamond.name}</h4>
                    <p className="text-[10px] font-mono tracking-widest text-muted-text uppercase">{item.diamond.carat}CT · {item.diamond.shape} x{item.quantity}</p>
                    <p className="text-bright-gold text-sm mt-2">{formatCurrency(item.diamond.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-ivory/60 text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ivory/60 text-sm">
                <span>Secure Shipping</span>
                {selectedShipping.cost === 0 ? (
                  <span className="text-emerald-400 font-mono text-[10px] uppercase">Complimentary</span>
                ) : (
                  <span className="text-ivory">{formatCurrency(selectedShipping.cost)}</span>
                )}
              </div>
              <div className="flex justify-between text-white font-medium text-lg pt-4">
                <span>Total</span>
                <span className="text-bright-gold">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="p-4 bg-void/30 rounded-card border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bright-gold/10 flex items-center justify-center text-bright-gold">
                  <ChevronRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-white font-medium">GIA Certified & Insured</p>
                  <p className="text-[10px] text-muted-text">Every shipment is tracked and fully insured.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
