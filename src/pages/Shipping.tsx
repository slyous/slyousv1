import { motion } from 'motion/react';
import { Package } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-graphite border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-bright-gold" />
          </div>
          <h1 className="text-4xl font-serif text-white italic mb-4">Shipping Information</h1>
          <p className="text-ivory/70 text-lg">Secure, insured, and complimentary worldwide delivery.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-graphite/40 border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-serif text-white mb-4">Complimentary Secure Delivery</h2>
            <p className="text-ivory/80 leading-relaxed mb-4">
              We offer complimentary overnight shipping on all domestic orders and expedited shipping for international orders. Every package is fully insured from our vault to your door.
            </p>
            <ul className="list-disc list-inside text-ivory/70 space-y-2">
              <li>Domestic Orders: Overnight Fedex Priority (1 business day)</li>
              <li>International: DHL Express or Fedex International (2-4 business days)</li>
              <li>Signature Requirement: A signature is required for all deliveries regardless of any waivers you have on file with the carrier.</li>
            </ul>
          </div>
          
          <div className="bg-graphite/40 border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-serif text-white mb-4">Discreet Packaging</h2>
            <p className="text-ivory/80 leading-relaxed">
              We understand the importance of discretion, especially for engagements or gifts. Our shipping boxes are unmarked and make no mention of jewelry, diamonds, or the high value of their contents on the exterior.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Shipping;
