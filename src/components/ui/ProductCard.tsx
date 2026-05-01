import { useState } from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight, X, Maximize2 } from 'lucide-react';
import { Diamond } from '@/src/types';
import { cn, formatCurrency } from '@/src/lib/utils';
import Badge from './Badge';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { useToast } from '@/src/context/ToastContext';

interface ProductCardProps extends HTMLMotionProps<'div'> {
  diamond: Diamond;
}

const ProductCard = ({ diamond, className, ...props }: ProductCardProps) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const active = isInWishlist(diamond.id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          'group relative bg-graphite/40 border border-white/5 rounded-card overflow-hidden transition-all duration-500 hover:border-bright-gold/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col backdrop-blur-sm h-full',
          className
        )}
        {...props}
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {diamond.isNew && <Badge variant="ivory" className="text-[9px]">New</Badge>}
          {diamond.sale && <Badge variant="gold" className="text-[9px]">Sale</Badge>}
          {diamond.marketPrice && diamond.marketPrice > diamond.price && (
            <Badge variant="gold" className="text-[8px] bg-bright-gold/20 border-bright-gold/30">
              {Math.round(((diamond.marketPrice - diamond.price) / diamond.marketPrice) * 100)}% Below Market
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(diamond);
          }}
          className={cn(
            "absolute top-4 right-4 z-20 p-2 transition-all duration-300 hover:scale-110",
            active ? "text-crimson" : "text-ivory/20 hover:text-crimson"
          )}
        >
          <Heart className={cn("w-5 h-5 transition-colors", active && "fill-current")} />
        </button>

        <Link to={`/diamonds/${diamond.slug || diamond.id}`} className="block relative h-[250px] shrink-0">
          {/* Image Container */}
          <div className="absolute inset-0 bg-white/5 flex items-center justify-center p-12 group-hover:p-8 transition-all duration-700">
            <img
              src={diamond.images && diamond.images.length > 0 ? diamond.images[0] : ''}
              alt={diamond.name}
              loading="lazy"
              className="w-full h-full object-contain mix-blend-screen brightness-110 group-hover:scale-115 transition-transform duration-1000 ease-luxury"
            />
            
            {/* Hover CTA */}
            <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-2">
                  <span className="text-white text-[10px] tracking-[0.2em] uppercase font-sans border-b border-transparent hover:border-white transition-colors cursor-pointer">
                    View Face
                  </span>
                  <span className="text-white/50">|</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsQuickViewOpen(true);
                    }}
                    className="flex items-center gap-1 text-white text-[10px] tracking-[0.2em] uppercase font-sans border-b border-transparent hover:border-white transition-colors"
                  >
                    Quick View <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <p className="text-[9px] font-mono text-muted uppercase tracking-widest mb-2">
              {diamond.carat}CT · {diamond.cut} · {diamond.shape}
            </p>
            <Link to={`/diamonds/${diamond.slug || diamond.id}`}>
              <h3 className="text-ivory font-serif font-medium text-lg leading-tight group-hover:text-bright-gold transition-colors">
                {diamond.name}
              </h3>
            </Link>
          </div>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-bright-gold font-sans font-medium text-xl">
                  {formatCurrency(diamond.price)}
                </span>
                {diamond.originalPrice && (
                  <span className="text-muted text-[10px] line-through">
                    {formatCurrency(diamond.originalPrice)}
                  </span>
                )}
              </div>
              {diamond.marketPrice && (
                <span className="text-[9px] text-muted-text font-mono uppercase tracking-widest">
                  Est. Val: {formatCurrency(diamond.marketPrice)}
                </span>
              )}
            </div>
            <Link to={`/diamonds/${diamond.slug || diamond.id}`} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted group-hover:border-bright-gold group-hover:text-bright-gold transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-void/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsQuickViewOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-void border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 text-ivory/50 hover:text-white bg-graphite/50 backdrop-blur-sm rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image */}
              <div className="w-full md:w-1/2 min-h-[300px] md:min-h-0 bg-white items-center justify-center p-12 relative flex shrink-0">
                <img
                  src={diamond.images && diamond.images.length > 0 ? diamond.images[0] : ''}
                  alt={diamond.name}
                  loading="lazy"
                  className="w-full h-full object-contain mix-blend-multiply max-h-[500px]"
                />
              </div>

              {/* Modal Details */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-graphite">
                <div className="mb-4">
                  {diamond.isNew && <Badge variant="ivory" className="mb-4 inline-block px-3 py-1 text-[10px]">New Arrival</Badge>}
                  <h2 className="text-3xl font-serif text-white italic mb-2">{diamond.name}</h2>
                  <div className="flex items-center gap-4 mb-2">
                    <p className="text-bright-gold font-sans font-medium text-2xl">{formatCurrency(diamond.price)}</p>
                    {diamond.marketPrice && (
                      <span className="text-muted-text text-sm font-mono border-l border-white/10 pl-4">
                        Estimated Market Value: {formatCurrency(diamond.marketPrice)}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-ivory/70 text-sm leading-relaxed mb-8">
                  {diamond.description}
                </p>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8 text-sm">
                  <div>
                    <span className="text-muted text-[10px] uppercase tracking-widest block mb-1">Carat</span>
                    <span className="text-ivory">{diamond.carat}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase tracking-widest block mb-1">Cut</span>
                    <span className="text-ivory">{diamond.cut}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase tracking-widest block mb-1">Color</span>
                    <span className="text-ivory">{diamond.color}</span>
                  </div>
                  <div>
                    <span className="text-muted text-[10px] uppercase tracking-widest block mb-1">Certificate</span>
                    <span className="text-bright-gold">{diamond.certification?.lab || 'GIA'} Official</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        addToCart(diamond);
                        showToast(`${diamond.name} added to cart`, 'success');
                      }}
                      className="flex-1 bg-white text-void py-4 px-6 rounded-lg font-medium hover:bg-bright-gold transition-colors text-center"
                    >
                      Add To Collection
                    </button>
                    <button
                      onClick={() => toggleWishlist(diamond)}
                      className={cn(
                        "w-14 shrink-0 border border-white/10 rounded-lg flex items-center justify-center transition-colors",
                        active ? "bg-crimson/10 border-crimson/30 text-crimson" : "hover:bg-white/5 text-ivory/50 hover:text-white"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", active && "fill-current")} />
                    </button>
                  </div>
                  <Link
                    to={`/diamonds/${diamond.slug || diamond.id}`}
                    onClick={() => setIsQuickViewOpen(false)}
                    className="text-center text-ivory/40 hover:text-white text-[10px] uppercase tracking-[0.2em] py-2 transition-colors"
                  >
                    View Detailed Grading Report
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
