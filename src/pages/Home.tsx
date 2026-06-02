import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/src/components/ui/ProductCard';
import { cn } from '@/src/lib/utils';
import { fetchApi } from '@/src/lib/api';

const Home = () => {
  const [diamonds, setDiamonds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetchApi('/api/products?limit=5');
        if (res.ok) {
            const fetched = await res.json();
            setDiamonds(fetched);
        }
      } catch (error) {
        console.error("Error fetching featured diamonds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const waterMarkOpacity = useTransform(scrollYProgress, [0, 0.5], [0.05, 0]);
  const waterMarkScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const heroImages = [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598560917505-59a3ad55934d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <div className="bg-void relative">
      {/* Ghost Watermark */}
      <motion.div 
        style={{ opacity: waterMarkOpacity, scale: waterMarkScale }}
        className="ghost-text"
      >
        Diamond Store
      </motion.div>

      {/* Vertical Side Text */}
      <div className="vertical-text">
        Follow Us — Instagram &nbsp; Pinterest &nbsp; Twitter
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Tilted Cards Cluster */}
        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
          {heroImages.map((src, index) => {
            const rotations = [-12, -6, 0, 6, 12];
            const opacities = [0.4, 0.7, 1, 0.7, 0.4];
            const scales = [0.85, 0.95, 1.1, 0.95, 0.85];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotate: rotations[index] }}
                animate={{ 
                  opacity: opacities[index], 
                  y: 0, 
                  rotate: rotations[index],
                  scale: scales[index]
                }}
                transition={{ delay: index * 0.1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                  "hero-card absolute",
                  index === 2 ? "z-30 border-bright-gold" : "z-10"
                )}
                style={{
                  left: `${15 + (index * 15)}%`,
                  top: index % 2 === 0 ? '55%' : '45%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <img src={src} alt="Diamond Luxury" loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-40" />
              </motion.div>
            );
          })}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-24 left-12 md:left-24 z-40 max-w-lg">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="status-label-themed"
          >
            Latest Collection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-serif text-white mb-10 leading-tight"
          >
            Precision in <br /> 
            <span className="italic">Every Facet</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/diamonds" className="cta-button-themed w-fit group">
              Explore Diamonds
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bottom Status Bar */}
      <section className="border-t border-white/5 py-8 flex justify-between px-12 text-[10px] uppercase tracking-[3px] text-muted">
        <div>GIA Certified Diamonds</div>
        <div className="hidden md:block">Insured Global Delivery</div>
        <div>Lifetime Authenticity Guaranteed</div>
      </section>

      {/* Featured Diamonds Section */}
      <section className="py-32 px-6 lg:px-24">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-end justify-between mb-20">
            <div className="max-w-xl">
              <span className="status-label-themed">Featured Jewelry</span>
              <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                From Classic to <br />
                <span className="italic">Contemporary—</span>
              </h2>
            </div>
            <Link to="/diamonds" className="group flex items-center gap-2 text-bright-gold font-sans text-xs uppercase tracking-[0.2em] mb-4">
              See All Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-graphite/20 animate-pulse rounded-card" />
              ))
            ) : diamonds.length > 0 ? (
              diamonds.map((diamond) => (
                <ProductCard key={diamond.id} diamond={diamond} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-ivory/40 font-mono text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-card">
                No featured diamonds at the moment
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Us Crimson Section */}
      <section className="py-32 px-6 lg:px-24">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="relative aspect-square lg:aspect-auto rounded-section-card overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop" 
              alt="Editorial Jewelry" 
              loading="lazy"
              className="w-full h-full object-cover grayscale brightness-75"
            />
          </div>
          <div className="bg-crimson p-12 lg:p-24 rounded-section-card flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-48 h-48 text-white rotate-12" />
            </div>
            <span className="status-label-themed !text-white/60">Our Heritage</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white italic mb-10 leading-tight relative z-10 transition-transform group-hover:-translate-y-1">
              About Veloura
            </h2>
            <div className="space-y-6 text-white/90 font-sans text-lg relative z-10 leading-relaxed max-w-md">
              <p>
                At Veloura, we believe a diamond is more than a gem—it is a vessel for memory and a symbol of timeless grace. Born from a passion for the extraordinary.
              </p>
              <p>
                Every piece is thoughtfully crafted with precision, combining luxurious materials and contemporary design to capture the essence of understated glamour.
              </p>
            </div>
            <div className="mt-12 relative z-10">
              <button className="cta-button-themed border-white text-white hover:bg-white hover:text-crimson">
                Read Our Story
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
