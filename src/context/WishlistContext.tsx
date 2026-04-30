import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Diamond } from '../types';

interface WishlistContextType {
  wishlist: Diamond[];
  addToWishlist: (diamond: Diamond) => void;
  removeFromWishlist: (diamondId: string) => void;
  isInWishlist: (diamondId: string) => boolean;
  toggleWishlist: (diamond: Diamond) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Diamond[]>(() => {
    const saved = localStorage.getItem('veloura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('veloura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (diamond: Diamond) => {
    setWishlist((prev) => [...prev, diamond]);
  };

  const removeFromWishlist = (diamondId: string) => {
    setWishlist((prev) => prev.filter((d) => d.id !== diamondId));
  };

  const isInWishlist = (diamondId: string) => {
    return wishlist.some((d) => d.id === diamondId);
  };

  const toggleWishlist = (diamond: Diamond) => {
    if (isInWishlist(diamond.id)) {
      removeFromWishlist(diamond.id);
    } else {
      addToWishlist(diamond);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
