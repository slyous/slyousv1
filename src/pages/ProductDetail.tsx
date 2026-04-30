import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  ChevronRight, 
  Maximize2,
  FileText,
  Heart
} from 'lucide-react';
import { mockDiamonds } from '@/src/data/mockData';
import { formatCurrency, cn } from '@/src/lib/utils';
import Button from '@/src/components/ui/Button';
import Badge from '@/src/components/ui/Badge';
import { useState } from 'react';
import { useWishlist } from '@/src/context/WishlistContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const diamond = mockDiamonds.find(d => d.slug === slug) || mockDiamonds[0];
  const [activeImage, setActiveImage] = useState(diamond.images[0]);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const active = isInWishlist(diamond.id);

  return (
    <div className="bg-void min-h-screen pt-24 pb-32">
      {/* Breadcrumb */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-8">
        <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-text">
          <Link to="/" className="hover:text-ivory">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/diamonds" className="hover:text-ivory">Diamonds</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-bright-gold">{diamond.name}</span>
        </nav>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Media */}
          <div className="w-full lg:w-[55%] space-y-8">
            <div className="relative aspect-square bg-white rounded-card overflow-hidden group cursor-zoom-in">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={activeImage} 
                alt={diamond.name} 
                className="w-full h-full object-contain mix-blend-multiply p-12"
              />
              <div className="absolute bottom-6 right-6">
                <button className="p-3 bg-void/10 backdrop-blur-md rounded-full text-void hover:bg-void hover:text-white transition-all">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-6 left-6">
                 {diamond.isNew && <Badge variant="ivory" className="px-4 py-1.5 shadow-xl">New Arrival</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {diamond.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "aspect-square rounded-card overflow-hidden bg-white p-2 border-2 transition-all",
                    activeImage === img ? "border-dark-gold" : "border-transparent"
                  )}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Purchase */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <div className="mb-10 space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                {diamond.name}
              </h1>
              <p className="text-lg text-ivory/60 font-sans leading-relaxed italic">
                {diamond.carat} Carat · {diamond.cut} Cut · {diamond.color} Color · {diamond.clarity} Clarity
              </p>
            </div>

            {/* Price & Certification */}
            <div className="mb-12 space-y-8">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl md:text-5xl font-sans font-medium text-bright-gold">
                  {formatCurrency(diamond.price)}
                </span>
                {diamond.originalPrice && (
                  <span className="text-xl text-muted-text line-through">
                    {formatCurrency(diamond.originalPrice)}
                  </span>
                )}
              </div>

              <div className="bg-graphite/30 rounded-section-card p-6 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-card bg-white p-2 flex items-center justify-center">
                    <span className="text-void font-bold text-lg">{diamond.certification.lab}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-text mb-1">Authentic Certificate</p>
                    <p className="text-white font-mono text-sm tracking-widest">{diamond.certification.number}</p>
                  </div>
                </div>
                <Link to="#" className="text-bright-gold flex items-center gap-2 text-xs uppercase tracking-widest font-sans hover:underline">
                  <FileText className="w-4 h-4" />
                  View Report
                </Link>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 mb-12">
              <Button size="lg" className="flex-1 h-16 text-lg">Add To Collection</Button>
              <button 
                onClick={() => toggleWishlist(diamond)}
                className={cn(
                  "w-16 h-16 rounded-card border flex items-center justify-center transition-all duration-300",
                  active 
                    ? "bg-crimson/10 border-crimson text-crimson" 
                    : "border-white/10 text-ivory/60 hover:border-crimson/50 hover:text-crimson/50"
                )}
              >
                <Heart className={cn("w-6 h-6", active && "fill-current")} />
              </button>
            </div>
            <Button variant="outline" size="lg" className="w-full h-16 border-white/10 hover:border-white/30 mb-12">
              Book A Private Viewing
            </Button>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-8 mb-12">
              {[
                { icon: ShieldCheck, label: 'GIA Certified' },
                { icon: Truck, label: 'Insured Delivery' },
                { icon: RotateCcw, label: '30-Day Returns' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 text-center">
                  <item.icon className="w-5 h-5 text-dark-gold" />
                  <span className="text-[9px] uppercase tracking-widest text-ivory/60 font-mono">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Details Accordion (Simplified) */}
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-serif italic text-xl mb-4 border-b border-white/5 pb-2">Description</h4>
                <p className="text-ivory/60 font-sans leading-relaxed">{diamond.description}</p>
              </div>
              
              <div className="pt-8">
                <div className="flex items-center gap-3 text-bright-gold group cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-sans uppercase tracking-widest border-b border-bright-gold/30 pb-1 group-hover:border-bright-gold transition-all">
                    Need Guidance? Chat with an expert
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specification Table */}
        <div className="mt-32 pt-32 border-t border-white/5">
          <h2 className="text-3xl font-serif text-white mb-16 italic text-center">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 max-w-5xl mx-auto">
            {[
              { label: 'Stock Number', value: diamond.id.padStart(6, '0') },
              { label: 'Carat Weight', value: diamond.carat },
              { label: 'Cut Grade', value: diamond.cut },
              { label: 'Color Grade', value: diamond.color },
              { label: 'Clarity Grade', value: diamond.clarity },
              { label: 'Shape', value: diamond.shape },
              { label: 'Certification', value: `${diamond.certification.lab} Certified` },
              { label: 'Polish', value: 'Excellent' },
              { label: 'Symmetry', value: 'Excellent' },
              { label: 'Fluorescence', value: 'None' }
            ].map((spec, idx) => (
              <div key={idx} className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-[11px] uppercase tracking-widest text-muted-text font-mono">{spec.label}</span>
                <span className="text-ivory font-sans">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
