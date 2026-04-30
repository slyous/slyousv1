import { motion } from 'motion/react';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ui/ProductCard';
import Button from '@/src/components/ui/Button';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-20 border-b border-white/5 pb-12">
          <div>
            <span className="status-label-themed">Your Selection</span>
            <h1 className="text-4xl md:text-6xl font-serif text-white italic">Saved Diamonds</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-muted mb-2">Total Items</p>
            <p className="text-3xl text-bright-gold font-sans">{wishlist.length}</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-8 relative">
              <Heart className="w-10 h-10 text-muted" />
              <div className="absolute inset-0 rounded-full border border-bright-gold/20 animate-ping" />
            </div>
            <h2 className="text-2xl font-serif text-white mb-4">Your Wishlist is Empty</h2>
            <p className="text-ivory/60 max-w-sm mb-12">
              Browse our collection of hand-selected diamonds to start creating your personal wishlist.
            </p>
            <Link to="/diamonds">
              <Button variant="gold" size="lg" className="px-12">Explore Collection</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((diamond) => (
              <ProductCard key={diamond.id} diamond={diamond} />
            ))}
          </div>
        )}

        {/* Suggested Actions */}
        {wishlist.length > 0 && (
          <div className="mt-32 p-12 lg:p-24 bg-graphite/20 border border-white/5 rounded-section-card flex flex-col lg:flex-row items-center justify-between gap-12 backdrop-blur-md">
            <div className="max-w-xl">
              <h3 className="text-3xl md:text-4xl font-serif text-white italic mb-6">Ready to proceed?</h3>
              <p className="text-ivory/60 leading-relaxed">
                Schedule a private viewing to see these pieces in person, or continue to your collection to finalize your acquisition.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 w-full lg:w-fit">
              <Link to="/cart">
                <Button className="w-full md:w-fit px-12 h-14 bg-bright-gold text-void border-bright-gold hover:bg-transparent hover:text-bright-gold translate-y-0 hover:-translate-y-1 transition-all">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Go To Collection
                </Button>
              </Link>
              <Button variant="outline" className="w-full md:w-fit px-12 h-14 border-white/10 hover:border-white/30 translate-y-0 hover:-translate-y-1 transition-all">
                Contact Concierge
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
