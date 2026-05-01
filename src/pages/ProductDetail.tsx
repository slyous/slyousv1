import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft,
  Maximize2,
  FileText,
  Heart,
  Star,
  User as UserIcon,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, cn } from '@/src/lib/utils';
import Button from '@/src/components/ui/Button';
import Badge from '@/src/components/ui/Badge';
import React, { useState, useEffect } from 'react';
import { useWishlist } from '@/src/context/WishlistContext';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { useToast } from '@/src/context/ToastContext';
import { db, signInWithGoogle } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, where, limit } from 'firebase/firestore';
import { Review, CertificationLab } from '@/src/types';
import { handleFirestoreError, OperationType } from '@/src/lib/firestoreError';
import CertificationInfo from '@/src/components/CertificationInfo';

const ProductDetail = () => {
  const { slug } = useParams();
  const [diamond, setDiamond] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: '50%', y: '50%' });
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const active = diamond ? isInWishlist(diamond.id) : false;

  useEffect(() => {
    const fetchDiamond = async () => {
      setLoadingProduct(true);
      try {
        const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const raw = snapshot.docs[0].data() as any;
          const dData = {
            id: snapshot.docs[0].id,
            ...raw,
            certification: raw.certification || { lab: raw.certLab || 'GIA', number: raw.certNumber || 'N/A' }
          };
          setDiamond(dData);
          setActiveImage(dData.images?.[0] || '');
        } else {
          setDiamond(null);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'products');
        setDiamond(null);
      } finally {
        setLoadingProduct(false);
      }
    };
    if (slug) fetchDiamond();
  }, [slug]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x: `${x}%`, y: `${y}%` });
  };
  
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!diamond?.id) return;
    
    // In actual production, product ID from the route/db should be used.
    // Ensure we are subscribing to valid reviews collection path.
    const path = `products/${diamond.id}/reviews`;
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [diamond?.id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!comment.trim()) return;
    if (!diamond?.id) return;
    
    setIsSubmitting(true);
    const path = `products/${diamond.id}/reviews`;
    
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        authorName: user.displayName || 'Anonymous',
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      setComment('');
      setRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="bg-void min-h-screen pt-32 pb-32 flex flex-col items-center justify-center text-ivory">
        <div className="w-12 h-12 border-2 border-dark-gold/30 border-t-bright-gold rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-sans text-ivory/60 tracking-widest uppercase">Retrieving details...</p>
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className="bg-void min-h-screen pt-32 pb-32 flex flex-col items-center justify-center text-ivory text-center">
        <h2 className="text-3xl font-serif text-white mb-2">Product Not Found</h2>
        <p className="text-sm font-sans text-ivory/60 mb-6">The diamond you are looking for does not exist or has been removed.</p>
        <Link to="/diamonds" className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Return to Collection</Link>
      </div>
    );
  }

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
            <div className="relative aspect-square bg-white rounded-card overflow-hidden group">
              <div
                className="absolute inset-0 cursor-zoom-in z-10 touch-none flex items-center justify-between pointer-events-none"
              >
                {/* We'll handle prev/next via absolutely positioned buttons that have pointer-events-auto */}
              </div>
              
              <div
                className="w-full h-full cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => { setIsZoomed(false); setZoomPos({ x: '50%', y: '50%' }); }}
                onMouseMove={handleMouseMove}
              >
                <img 
                  key={activeImage}
                  src={activeImage} 
                  alt={diamond.name} 
                  loading="lazy"
                  className={cn(
                    "w-full h-full object-contain mix-blend-multiply transition-transform duration-200 ease-out",
                    isZoomed ? "scale-[2]" : "scale-100 p-12"
                  )}
                  style={{
                    transformOrigin: `${zoomPos.x} ${zoomPos.y}`
                  }}
                />
              </div>

              {/* Prev/Next Buttons */}
              {diamond.images?.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = diamond.images.indexOf(activeImage);
                      const nextIndex = currentIndex === 0 ? diamond.images.length - 1 : currentIndex - 1;
                      setActiveImage(diamond.images[nextIndex]);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-void/10 hover:bg-void/30 backdrop-blur-md rounded-full text-void transition-all opacity-0 group-hover:opacity-100 z-20 pointer-events-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = diamond.images.indexOf(activeImage);
                      const nextIndex = currentIndex === diamond.images.length - 1 ? 0 : currentIndex + 1;
                      setActiveImage(diamond.images[nextIndex]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-void/10 hover:bg-void/30 backdrop-blur-md rounded-full text-void transition-all opacity-0 group-hover:opacity-100 z-20 pointer-events-auto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                <div className="p-3 bg-void/10 backdrop-blur-md rounded-full text-void">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute top-6 left-6 pointer-events-none z-20">
                 {diamond.isNew && <Badge variant="ivory" className="px-4 py-1.5 shadow-xl">New Arrival</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-4">
              {diamond.images?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "aspect-square rounded-card overflow-hidden bg-white p-2 border-2 transition-all relative",
                    activeImage === img ? "border-dark-gold ring-2 ring-bright-gold/30 ring-offset-2 ring-offset-void" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`thumbnail ${idx}`} loading="lazy" className="w-full h-full object-contain mix-blend-multiply" />
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
                {diamond.marketPrice && (
                  <div className="flex flex-col">
                    <span className="text-[10px] items-center gap-1.5 uppercase tracking-widest text-muted-text flex">
                      <TrendingUp className="w-3 h-3 text-bright-gold" />
                      Est. Market Value
                    </span>
                    <span className="text-xl text-muted-text font-mono">
                      {formatCurrency(diamond.marketPrice)}
                    </span>
                  </div>
                )}
                {diamond.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-text">Original Price</span>
                    <span className="text-xl text-muted-text line-through font-mono">
                      {formatCurrency(diamond.originalPrice)}
                    </span>
                  </div>
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
              <Button size="lg" className="flex-1 h-16 text-lg" onClick={() => {
                addToCart(diamond);
                showToast(`${diamond.name} added to collection`, 'success');
              }}>
                Add To Collection
              </Button>
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
            {/* Need Guidance */}
            <div className="bg-graphite/30 border border-white/5 rounded-section-card p-6 mb-12 text-center">
              <p className="text-ivory/60 text-sm mb-4 font-sans leading-relaxed">
                Finding the perfect diamond is a journey. Our experts are here to help you navigate every step.
              </p>
              <button 
                onClick={() => window.open('https://wa.me/yournumber', '_blank')}
                className="text-bright-gold text-[10px] uppercase tracking-[0.2em] font-mono hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                Need Guidance? Chat with an expert
              </button>
            </div>

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
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={{ height: isDescriptionExpanded ? 'auto' : '100px' }}
                    className="overflow-hidden relative"
                  >
                    <p className="text-ivory/60 font-sans leading-relaxed">
                      {diamond.description}
                    </p>
                    {!isDescriptionExpanded && diamond.description?.length > 200 && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-void to-transparent pointer-events-none" />
                    )}
                  </motion.div>
                  {diamond.description?.length > 200 && (
                    <button 
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="mt-4 text-bright-gold text-[10px] uppercase tracking-[0.2em] font-mono hover:underline focus:outline-none"
                    >
                      {isDescriptionExpanded ? 'Collapse' : 'Read Full Description'}
                    </button>
                  )}
                </div>
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

        {/* Certification Section */}
        <div className="mt-32">
          <CertificationInfo 
            lab={diamond.certification.lab} 
            certNumber={diamond.certification.number} 
            certUrl={diamond.certification.url}
          />
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

        {/* Customer Reviews Section */}
        <div className="mt-32 pt-32 border-t border-white/5 max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-white mb-12 italic text-center">Customer Reviews</h2>
          
          {/* Submit Review Form */}
          {user ? (
            <div className="bg-graphite/20 border border-white/5 p-8 rounded-section-card mb-16 backdrop-blur-md">
              <h3 className="text-xl font-serif text-white mb-6">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={cn(
                            "w-6 h-6 transition-colors", 
                            rating >= star ? "text-bright-gold fill-bright-gold" : "text-white/20"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-3">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full bg-void border border-white/10 rounded-lg p-4 text-ivory/80 focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 transition-all outline-none resize-none h-32"
                    placeholder="Share your thoughts about this piece..."
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !comment.trim()} className="px-8">
                    {isSubmitting ? 'Submitting...' : 'Post Review'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-graphite/20 border border-white/5 p-8 rounded-section-card mb-16 text-center backdrop-blur-md">
              <Star className="w-8 h-8 text-dark-gold mx-auto mb-4" />
              <p className="text-ivory/60 mb-6">Please sign in to share your experience with this beautiful piece.</p>
              <Button onClick={signInWithGoogle} variant="outline" className="px-8 border-white/10 hover:border-white/30">
                Sign In to Review
              </Button>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-center text-ivory/40 italic">Be the first to review this piece.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-white/5 pb-8 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-muted-text" />
                      </div>
                      <div>
                        <p className="text-ivory font-medium font-sans text-sm">{review.authorName}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-text font-mono mt-0.5">
                          {review.createdAt ? new Date(review.createdAt.toMillis ? review.createdAt.toMillis() : review.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-4 h-4",
                            i < review.rating ? "text-bright-gold fill-bright-gold" : "text-white/10"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-ivory/70 leading-relaxed font-sans">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
