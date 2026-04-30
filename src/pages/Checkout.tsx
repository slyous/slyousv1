import { Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { mockDiamonds } from '@/src/data/mockData';
import { formatCurrency } from '@/src/lib/utils';
import Button from '@/src/components/ui/Button';

const Checkout = () => {
  const subtotal = mockDiamonds[0].price + mockDiamonds[3].price;

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
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-serif text-white italic mb-8 border-b border-white/5 pb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Email Address</label>
                  <input type="email" placeholder="email@example.com" className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Phone Number</label>
                  <input type="tel" placeholder="+234 ..." className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-serif text-white italic mb-8 border-b border-white/5 pb-4">Shipping Destination</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Full Name</label>
                  <input type="text" placeholder="Abba Abdulsalam" className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">Street Address</label>
                  <input type="text" placeholder="123 Luxury Avenue" className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">City</label>
                    <input type="text" placeholder="Lagos" className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-text">State / Province</label>
                    <input type="text" placeholder="Lagos State" className="w-full bg-graphite/30 border border-white/10 rounded-sharp py-3 px-4 text-white focus:outline-none focus:border-bright-gold" />
                  </div>
                </div>
              </div>
            </section>

            <Link to="/order-confirmation">
              <Button size="lg" className="w-full h-16 mt-8">Continue to Payment</Button>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-graphite/30 rounded-section-card p-10 sticky top-32 border border-white/5">
            <h2 className="text-2xl font-serif text-white italic mb-10">Order Summary</h2>
            
            <div className="space-y-8 mb-10 pb-10 border-b border-white/5">
              {[mockDiamonds[0], mockDiamonds[3]].map((diamond) => (
                <div key={diamond.id} className="flex gap-6">
                  <div className="w-20 h-20 bg-white rounded-card p-2 flex-shrink-0">
                    <img src={diamond.images[0]} alt={diamond.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-sans text-sm font-medium mb-1">{diamond.name}</h4>
                    <p className="text-[10px] font-mono tracking-widest text-muted-text uppercase">{diamond.carat}CT · {diamond.shape}</p>
                    <p className="text-bright-gold text-sm mt-2">{formatCurrency(diamond.price)}</p>
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
                <span className="text-emerald-400 font-mono text-[10px] uppercase">Complimentary</span>
              </div>
              <div className="flex justify-between text-white font-medium text-lg pt-4">
                <span>Total</span>
                <span className="text-bright-gold">{formatCurrency(subtotal)}</span>
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
