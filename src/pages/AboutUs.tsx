import { motion } from 'motion/react';

const AboutUs = () => {
  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="status-label-themed inline-block mb-4">Our Heritage</span>
          <h1 className="text-5xl font-serif text-white italic mb-6">Redefining the Diamond Experience</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="space-y-6 text-ivory/80 leading-relaxed font-sans">
            <p>
              Founded with a singular vision, we sought to strip away the opacity of the traditional diamond industry. We believe that acquiring a diamond should be as luminous and clear as the stone itself.
            </p>
            <p>
              Our curators traverse the globe, establishing direct relationships with ethically sound cutting facilities. We bypass intermediaries, curating an inventory that meets only the most stringent standards of cut, color, and clarity.
            </p>
            <p>
              We don't just sell diamonds; we provide an education in light performance. Every piece in our collection represents the pinnacle of human craftsmanship meeting nature's most enduring creation.
            </p>
          </div>
          <div className="relative aspect-[3/4] rounded-card overflow-hidden">
             <img src="https://images.unsplash.com/photo-1599643478514-4a820c56b8ea?auto=format&fit=crop&q=80&w=1000" alt="Diamond cutting" className="w-full h-full object-cover brightness-75 grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
