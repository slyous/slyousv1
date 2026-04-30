import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Package, MapPin, Truck, ArrowRight } from 'lucide-react';
import Button from '@/src/components/ui/Button';

const OrderConfirmation = () => {
  return (
    <div className="bg-void min-h-screen pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-xl mx-auto">
        {/* Diamond Ring Pulse Animation */}
        <div className="relative mb-16">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-bright-gold rounded-full filter blur-3xl opacity-20"
          />
          <div className="relative w-32 h-32 mx-auto">
             <div className="absolute inset-0 border-4 border-dark-gold/20 rounded-full animate-[spin_10s_linear_infinite]" />
             <div className="absolute inset-2 border-2 border-bright-gold rounded-full" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-12 h-12 text-bright-gold" />
             </div>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif text-white italic mb-6"
        >
          Your diamond is on its way.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 inline-block px-8 py-3 bg-graphite/20 border border-white/5 rounded-card"
        >
          <span className="text-[10px] font-mono text-muted-text uppercase tracking-widest mr-4">Order ID</span>
          <span className="text-white font-mono tracking-widest">#VLR-2026-9932</span>
        </motion.div>

        {/* Timeline */}
        <div className="grid grid-cols-3 gap-4 mb-20">
          {[
            { icon: Check, label: 'Confirmed', active: true },
            { icon: Package, label: 'Packed', active: false },
            { icon: Truck, label: 'Dispatched', active: false }
          ].map((step, idx) => (
            <div key={idx} className={cn("flex flex-col items-center gap-4", step.active ? "opacity-100" : "opacity-30")}>
              <div className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                step.active ? "border-bright-gold bg-bright-gold/10 text-bright-gold" : "border-white/10 text-white"
              )}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-white">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button size="lg" className="px-12">
            Track Your Order
            <MapPin className="w-4 h-4 ml-2" />
          </Button>
          <Link to="/">
            <Button variant="ghost" size="lg" className="text-ivory hover:text-white group">
              Continue Browsing
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <p className="mt-24 text-ivory/40 font-sans text-sm italic">
          A confirmation email has been sent to your address. <br />
          Thank you for choosing Veloura.
        </p>
      </div>
    </div>
  );
};

// Helper for conditional classes inside simple component if not importing lib for single use
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default OrderConfirmation;
