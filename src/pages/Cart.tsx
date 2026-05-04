import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import Button from '@/src/components/ui/Button';
import { useCart } from '@/src/context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-graphite/30 flex items-center justify-center text-muted-text mb-8">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-serif italic text-white mb-6">Your collection is empty</h1>
        <p className="text-ivory/60 font-sans max-w-sm mb-12">
          Discover our curated selection of fine diamonds and begin your legacy today.
        </p>
        <Link to="/diamonds">
          <Button variant="primary" size="lg">Browse Diamonds</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-void min-h-screen pt-32 pb-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-white italic mb-16">Your Collection</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* List */}
          <div className="flex-1 space-y-8">
            <div className="hidden md:grid grid-cols-6 gap-4 pb-6 border-b border-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-text">
              <div className="col-span-3">Item</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Price</div>
              <div className="text-right">Total</div>
            </div>

            {cart.map((item) => (
              <div key={item.diamond.id} className="grid grid-cols-1 md:grid-cols-6 gap-8 items-center pb-8 border-b border-white/5 group">
                {/* Product Info */}
                <div className="md:col-span-3 flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-card overflow-hidden p-2 flex-shrink-0">
                    <img src={item.diamond.images[0]} alt={item.diamond.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div>
                    <h3 className="text-white font-sans font-medium text-lg group-hover:text-bright-gold transition-colors">
                      {item.diamond.name}
                    </h3>
                    <p className="text-xs text-muted-text font-mono mt-1 uppercase tracking-widest">
                      {item.diamond.carat}CT · {item.diamond.cut} · {item.diamond.shape}
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.diamond.id)}
                      className="flex items-center gap-2 text-crimson font-mono text-[10px] uppercase tracking-widest mt-4 hover:opacity-80 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-4 bg-graphite/30 border border-white/5 rounded-pill px-4 py-2">
                    <button 
                      onClick={() => updateQuantity(item.diamond.id, item.quantity - 1)}
                      className="text-ivory hover:text-bright-gold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-mono text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.diamond.id, item.quantity + 1)}
                      className="text-ivory hover:text-bright-gold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right hidden md:block">
                  <p className="text-ivory/60 font-sans">{formatCurrency(item.diamond.price)}</p>
                </div>

                {/* Total */}
                <div className="text-right">
                  <p className="text-bright-gold font-sans font-medium text-lg">
                    {formatCurrency(item.diamond.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-graphite/30 border border-white/5 rounded-section-card p-8 sticky top-32">
              <h2 className="text-2xl font-serif text-white italic mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center text-ivory/60 font-sans">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-ivory/60 font-sans">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">Complimentary</span>
                </div>
                <div className="flex justify-between items-center text-ivory/60 font-sans">
                  <span>Insurance</span>
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">Complimentary</span>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center text-white">
                  <span className="text-lg font-serif">Total</span>
                  <span className="text-2xl font-sans font-medium text-bright-gold">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full h-14" size="lg">
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-mono text-muted-text uppercase tracking-widest mb-4">Secure Bank Wire Transfer</p>
                <div className="flex justify-center gap-4 opacity-40">
                  {/* Providing a generic bank building icon for wire transfer visual trust */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="21" width="18" height="2"/><path d="M21 11v8"/><path d="M3 11v8"/><path d="M7 11v8"/><path d="M11 11v8"/><path d="M15 11v8"/><path d="M19 11v8"/><path d="m12 2-9 5v4h18V7l-9-5z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
