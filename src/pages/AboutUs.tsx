import { motion } from 'motion/react';
import { ArrowRight, Diamond } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-void min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/prop.jpg" 
            alt="Diamond store prop" 
            className="w-full h-full object-cover brightness-[0.3] grayscale-[0.5] object-[center_15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/20 via-transparent to-void"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="status-label-themed inline-block mb-6 tracking-[0.4em] text-bright-gold">Our Heritage</span>
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-8">
              Redefining the <br />
              <span className="italic text-white/90">Diamond Experience</span>
            </h1>
            <p className="text-xl text-ivory/70 max-w-2xl mx-auto font-sans font-light leading-relaxed">
              Where exceptional craftsmanship meets uncompromising ethical standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <div className="space-y-10">
              <div className="space-y-6 text-lg text-ivory/80 leading-relaxed font-sans font-light">
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
              <button className="cta-button-themed group">
                Discover Our Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-bright-gold/20 to-transparent rounded-card transform translate-x-4 translate-y-4"></div>
              <div className="relative aspect-[4/5] rounded-card overflow-hidden border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1599643478514-4a820c56b8ea?auto=format&fit=crop&q=80&w=1000" 
                  alt="Diamond cutting craftsmanship" 
                  className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-1000" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 bg-graphite/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="status-label-themed inline-block mb-4">Our Commitment</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white">The Pillars of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Ethical Sourcing",
                description: "Every stone is meticulously traced from mine to market, ensuring conflict-free origins and supporting local communities."
              },
              {
                title: "Master Craftsmanship",
                description: "Cut by artisans with decades of experience to maximize light performance, fire, and brilliance."
              },
              {
                title: "Transparent Pricing",
                description: "By eliminating intermediaries, we offer unparalleled value without compromising on the quality of our gems."
              }
            ].map((value, index) => (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-void border border-white/5 p-10 rounded-section-card hover:border-bright-gold/30 transition-colors duration-500 group"
              >
                <div className="w-12 h-12 rounded-full bg-graphite flex items-center justify-center mb-8 group-hover:bg-bright-gold/10 transition-colors">
                  <Diamond className="w-5 h-5 text-bright-gold" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-4">{value.title}</h3>
                <p className="text-ivory/60 font-sans leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
