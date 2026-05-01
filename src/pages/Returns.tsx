import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Returns = () => {
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-graphite border border-white/10 flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-8 h-8 text-bright-gold" />
          </div>
          <h1 className="text-4xl font-serif text-white italic mb-4">Returns & Exchanges</h1>
          <p className="text-ivory/70 text-lg">Shop with absolute confidence with our 30-day return policy.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 text-ivory/80 leading-relaxed"
        >
           <div className="bg-graphite/40 border border-white/10 p-8 rounded-2xl">
              <h2 className="text-2xl font-serif text-white mb-4">30-Day Policy</h2>
              <p className="mb-4">
                We take pride in the quality of our diamonds. If for any reason you are not completely satisfied with your purchase, you may return it in its original, unworn condition within 30 days of the delivery date for a full refund or exchange.
              </p>
              <h3 className="text-lg font-serif text-bright-gold mb-2 mt-6">Conditions of Return</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Items must be returned in their original condition (unworn and unmodified).</li>
                <li>All original diamond certifications and documentation must be included. A replacement fee will apply for missing GIA certificates.</li>
                <li>Custom-designed rings and engraved items are final sale.</li>
              </ul>
           </div>

           <div className="bg-graphite/40 border border-white/10 p-8 rounded-2xl">
              <h2 className="text-2xl font-serif text-white mb-4">How to Return an Item</h2>
              <p className="mb-4">
                To initiate a return, please contact our concierge team. We will provide you with a pre-paid, fully insured FedEx return shipping label and detailed instructions on how to safely package your item.
              </p>
              <Link to="/contact" className="inline-block mt-4 border border-white/20 px-6 py-3 rounded-lg hover:bg-white hover:text-void transition-colors">
                Contact Concierge
              </Link>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Returns;
