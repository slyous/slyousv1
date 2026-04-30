import { motion, HTMLMotionProps } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { Diamond } from '@/src/types';
import { cn, formatCurrency } from '@/src/lib/utils';
import Badge from './Badge';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/src/context/WishlistContext';

interface ProductCardProps extends HTMLMotionProps<'div'> {
  diamond: Diamond;
}

const ProductCard = ({ diamond, className, ...props }: ProductCardProps) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const active = isInWishlist(diamond.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'group relative bg-graphite/40 border border-white/5 rounded-card overflow-hidden transition-all duration-500 hover:border-bright-gold/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] h-full flex flex-col backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {diamond.isNew && <Badge variant="ivory" className="text-[9px]">New</Badge>}
        {diamond.sale && <Badge variant="gold" className="text-[9px]">Sale</Badge>}
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

      <Link to={`/diamonds/${diamond.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white/5 flex items-center justify-center p-12 group-hover:p-8 transition-all duration-700">
          <img
            src={diamond.images[0]}
            alt={diamond.name}
            className="w-full h-full object-contain mix-blend-screen brightness-110 group-hover:scale-115 transition-transform duration-1000 ease-luxury"
          />
          
          {/* Hover CTA */}
          <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-white text-[10px] tracking-[0.2em] uppercase font-sans">View Facets</span>
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[9px] font-mono text-muted uppercase tracking-widest mb-2">
            {diamond.carat}CT · {diamond.cut} · {diamond.shape}
          </p>
          <Link to={`/diamonds/${diamond.id}`}>
            <h3 className="text-ivory font-serif font-medium text-lg leading-tight group-hover:text-bright-gold transition-colors">
              {diamond.name}
            </h3>
          </Link>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-bright-gold font-sans font-medium text-xl">
              {formatCurrency(diamond.price)}
            </span>
            {diamond.originalPrice && (
              <span className="text-muted text-sm line-through">
                {formatCurrency(diamond.originalPrice)}
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted group-hover:border-bright-gold group-hover:text-bright-gold transition-all duration-300">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
