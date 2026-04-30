import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockDiamonds } from '@/src/data/mockData';
import ProductCard from '@/src/components/ui/ProductCard';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { DiamondShape } from '@/src/types';

const DiamondCollection = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

  const toggleShape = (shape: string) => {
    setSelectedShapes(prev => 
      prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]
    );
  };

  const filteredDiamonds = mockDiamonds.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShape = selectedShapes.length === 0 || selectedShapes.includes(d.shape);
    return matchesSearch && matchesShape;
  });

  return (
    <div className="bg-void min-h-screen pt-24">
      {/* Mini Hero */}
      <section className="bg-graphite py-16 px-6 text-center border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <nav className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-text mb-6">
            <span className="hover:text-ivory cursor-pointer">Shop</span>
            <span className="mx-3">/</span>
            <span className="text-bright-gold">Diamonds</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-serif text-white italic">Diamond Collection</h1>
        </div>
      </section>

      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Sidebar Filter */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-12">
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold mb-6">Shape</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(DiamondShape).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => toggleShape(shape)}
                    className={cn(
                      "text-[11px] font-mono py-2 border transition-all text-center uppercase tracking-wider",
                      selectedShapes.includes(shape) 
                        ? "border-bright-gold text-bright-gold bg-bright-gold/5" 
                        : "border-white/10 text-ivory/60 hover:border-white/30"
                    )}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold">Price Range</h4>
              <div className="space-y-4">
                <input type="range" className="w-full accent-dark-gold h-1 bg-white/10 rounded-pill appearance-none" />
                <div className="flex justify-between text-[10px] font-mono text-muted-text">
                  <span>$1,000</span>
                  <span>$100,000+</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold">Certification</h4>
              <div className="flex flex-wrap gap-2">
                {['GIA', 'AGS', 'IGI'].map(lab => (
                  <button key={lab} className="px-4 py-1 border border-white/10 text-[10px] uppercase font-mono text-ivory/60 hover:border-ivory">
                    {lab}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                <input 
                  type="text" 
                  placeholder="Search Diamonds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-graphite/30 border border-white/10 rounded-pill py-3 pl-12 pr-4 text-sm text-ivory focus:outline-none focus:border-bright-gold transition-colors"
                />
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <p className="text-[11px] font-mono text-muted-text uppercase tracking-widest leading-none">
                  Showing {filteredDiamonds.length} Diamonds
                </p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-ivory text-xs uppercase tracking-widest font-sans group">
                    Most Popular <ChevronDown className="w-4 h-4 text-bright-gold group-hover:translate-y-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden p-3 bg-graphite border border-white/10 rounded-pill text-ivory"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {selectedShapes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedShapes.map(shape => (
                  <span key={shape}>
                    <Badge variant="gold" className="px-4 py-1 gap-2 border border-bright-gold/20 flex items-center">
                      {shape}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => toggleShape(shape)} />
                    </Badge>
                  </span>
                ))}
                <button 
                  onClick={() => setSelectedShapes([])}
                  className="text-[10px] uppercase font-mono tracking-widest text-muted-text hover:text-ivory"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
              <AnimatePresence mode='popLayout'>
                {filteredDiamonds.map((diamond) => (
                  <motion.div
                    key={diamond.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard diamond={diamond} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredDiamonds.length === 0 && (
              <div className="py-32 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-graphite/30 text-muted-text mb-6">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif italic text-white mb-4">No diamonds found</h3>
                <p className="text-ivory/60 font-sans max-w-sm mx-auto mb-8">
                  Try adjusting your filters or search criteria. We have many more diamonds arriving daily.
                </p>
                <button onClick={() => {setSearchQuery(''); setSelectedShapes([]);}} className="text-bright-gold uppercase text-[11px] font-mono tracking-widest hover:underline">
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[300px] bg-void border-l border-white/10 z-[60] lg:hidden p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-serif italic text-white">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-white hover:text-bright-gold">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-12 pr-4">
                {/* Shape Filter */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold mb-6">Shape</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(DiamondShape).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => toggleShape(shape)}
                        className={cn(
                          "text-[11px] font-mono py-2 border transition-all text-center uppercase tracking-wider",
                          selectedShapes.includes(shape) 
                            ? "border-bright-gold text-bright-gold bg-bright-gold/5" 
                            : "border-white/10 text-ivory/60 hover:border-white/30"
                        )}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans text-bright-gold">Certification</h4>
                  <div className="flex flex-wrap gap-2">
                    {['GIA', 'AGS', 'IGI'].map(lab => (
                      <button key={lab} className="px-6 py-2 border border-white/10 text-[10px] uppercase font-mono text-ivory/60">
                        {lab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-auto">
                <Button onClick={() => setIsFilterOpen(false)} className="w-full">
                  Show Results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiamondCollection;
