import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

const Authenticity = () => {
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-graphite border border-white/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-bright-gold" />
          </div>
          <h1 className="text-4xl font-serif text-white italic mb-4">Authenticity Guarantee</h1>
          <p className="text-ivory/70 text-lg">Every diamond we offer is rigorously inspected and certified.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-gold max-w-none space-y-8"
        >
          <div className="bg-graphite/40 border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-serif text-white mb-4">Certified Excellence</h2>
            <p className="text-ivory/80 leading-relaxed">
              We exclusively source diamonds that have been independently graded by the Gemological Institute of America (GIA), the industry's most respected and rigorous grading laboratory. Your purchase is accompanied by a physical and digital certificate detailing the precise characteristics of your stone.
            </p>
          </div>
          
          <div className="bg-graphite/40 border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-serif text-white mb-4">Ethical Sourcing</h2>
            <p className="text-ivory/80 leading-relaxed">
              We are committed to conflict-free sourcing. Each diamond in our collection adheres strictly to the Kimberley Process standards. We go beyond compliance to ensure our supply chain respects both human rights and the environment.
            </p>
          </div>

          <div className="bg-graphite/40 border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-serif text-white mb-4">Laser Inscription</h2>
            <p className="text-ivory/80 leading-relaxed">
              For your security and peace of mind, the vast majority of our diamonds feature a microscopic laser inscription on the girdle, matching the unique certification number provided in your dossier.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Authenticity;
