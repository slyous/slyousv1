import { motion } from 'motion/react';

const Careers = () => {
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="status-label-themed inline-block mb-4">Join Us</span>
          <h1 className="text-4xl font-serif text-white italic mb-4">Careers</h1>
          <p className="text-ivory/70 text-lg">Shape the future of luxury jewelry and diamond curation.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
           <div className="text-center py-16 border border-white/10 border-dashed rounded-2xl bg-white/5">
              <h2 className="text-2xl font-serif text-white mb-4">No Open Positions</h2>
              <p className="text-ivory/60 mb-6">We are not currently hiring, but we are always looking to connect with passionate gemologists, designers, and luxury retail professionals.</p>
              <p className="text-sm font-mono text-muted">Please check back later or follow our LinkedIn for updates.</p>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;
