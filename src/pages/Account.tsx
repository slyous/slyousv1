import React, { useEffect, useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { db, auth } from '@/src/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ShoppingBag, LogOut, Package, MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { formatCurrency, cn } from '@/src/lib/utils';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';
import { OrderStatus, Address } from '@/src/types';

const Account = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') as 'orders' | 'addresses';
  
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>(initialTab || 'orders');
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [fetchingAddresses, setFetchingAddresses] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({});
  const [submitAddressLoading, setSubmitAddressLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => {
           const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
           const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
           return timeB - timeA;
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setFetchingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user || activeTab !== 'addresses') return;
      setFetchingAddresses(true);
      try {
        const q = query(
          collection(db, 'addresses'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Address[];
        setAddresses(fetched);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setFetchingAddresses(false);
      }
    };
    fetchAddresses();
  }, [user, activeTab]);

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setSubmitAddressLoading(true);
    
    try {
      const addressData = {
        ...currentAddress,
        userId: user.uid,
        isDefault: currentAddress.isDefault || addresses.length === 0, 
      };

      if (currentAddress.id) {
        await setDoc(doc(db, 'addresses', currentAddress.id), addressData, { merge: true });
        setAddresses(prev => prev.map(a => a.id === currentAddress.id ? { ...a, ...addressData } as Address : a));
      } else {
        const docRef = await addDoc(collection(db, 'addresses'), { ...addressData, createdAt: serverTimestamp() });
        setAddresses(prev => [...prev, { ...addressData, id: docRef.id } as Address]);
      }
      
      setIsEditingAddress(false);
      setCurrentAddress({});
    } catch (error) {
      console.error("Error saving address", error);
    } finally {
      setSubmitAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'addresses', id));
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting address", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // First, find the current default and update it to false
      const currentDefault = addresses.find(a => a.isDefault);
      if (currentDefault && currentDefault.id) {
        await setDoc(doc(db, 'addresses', currentDefault.id), { isDefault: false }, { merge: true });
      }
      // Set new default to true
      await setDoc(doc(db, 'addresses', id), { isDefault: true }, { merge: true });
      
      setAddresses(prev => prev.map(a => ({
        ...a,
        isDefault: a.id === id
      })));
    } catch(error) {
      console.error("Error setting default address", error);
    }
  };

  if (loading) return <div className="pt-32 text-center text-ivory">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Profile */}
          <div className="md:w-1/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-graphite/40 border border-white/5 p-8 rounded-section-card backdrop-blur-sm"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full border-2 border-dark-gold/30 p-1 mb-4 overflow-hidden">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} 
                    alt={user.displayName || 'User'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-serif text-white">{user.displayName}</h2>
                <p className="text-sm text-ivory/60 font-sans">{user.email}</p>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => { setActiveTab('orders'); setIsEditingAddress(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors border field-focus",
                    activeTab === 'orders' ? "bg-white/5 text-bright-gold border-white/10" : "bg-transparent text-ivory/60 border-transparent hover:text-ivory hover:bg-white/5"
                  )}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order History</span>
                </button>
                <button 
                  onClick={() => { setActiveTab('addresses'); setIsEditingAddress(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors border field-focus",
                    activeTab === 'addresses' ? "bg-white/5 text-bright-gold border-white/10" : "bg-transparent text-ivory/60 border-transparent hover:text-ivory hover:bg-white/5"
                  )}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </button>
                <button onClick={() => signOut(auth)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-ivory hover:text-white text-sm transition-colors mt-8">
                  <LogOut className="w-4 h-4 text-muted-text" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {activeTab === 'orders' && (
                <>
                  <h1 className="text-3xl font-serif text-white italic mb-8">Order History</h1>
                  
                  {fetchingOrders ? (
                    <div className="py-12 border border-white/5 rounded-section-card bg-graphite/10 text-center text-ivory/60">
                      Loading your orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="py-16 px-8 border border-white/5 rounded-section-card bg-graphite/10 text-center flex flex-col items-center">
                      <Package className="w-12 h-12 text-muted-text mb-4" />
                      <h3 className="text-xl text-white font-serif mb-2">No orders yet</h3>
                      <p className="text-ivory/60 mb-6 font-sans text-sm max-w-md">
                        Explore our collection of fine diamonds and make your first acquisition.
                      </p>
                      <Link to="/diamonds" className="text-xs uppercase tracking-widest text-bright-gold hover:text-white transition-colors border-b border-bright-gold/30 pb-1 hover:border-white">
                        Discover Collection
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-graphite/20 border border-white/5 rounded-section-card p-6 md:p-8 backdrop-blur-sm">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-white/5 gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-muted-text mb-1">
                                Order #{order.orderNumber || order.id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-ivory font-sans text-sm">
                                Placed on {order.createdAt?.toMillis ? new Date(order.createdAt.toMillis()).toLocaleDateString() : 'Recently'}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="text-bright-gold text-lg">{formatCurrency(order.totalPrice || 0)}</p>
                              <Badge status={order.status as OrderStatus}>{order.status}</Badge>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <Link 
                              to={`/track-order/${order.id}`}
                              className="text-xs uppercase tracking-[0.1em] text-white hover:text-bright-gold transition-colors inline-block bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:border-bright-gold/30"
                            >
                              Track Order
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'addresses' && (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif text-white italic">Saved Addresses</h1>
                    {!isEditingAddress && (
                      <Button onClick={() => { setCurrentAddress({}); setIsEditingAddress(true); }} className="flex items-center gap-2" variant="outline">
                        <Plus className="w-4 h-4" /> Add Address
                      </Button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <div className="bg-graphite/20 border border-white/5 rounded-section-card p-6 md:p-8 backdrop-blur-sm">
                       <h3 className="text-xl font-serif text-white mb-6 hover:text-bright-gold">{currentAddress.id ? 'Edit Address' : 'Add New Address'}</h3>
                       <form onSubmit={handleSaveAddress} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Full Name</label>
                               <input required value={currentAddress.fullName || ''} onChange={e => setCurrentAddress({...currentAddress, fullName: e.target.value})} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Street Address</label>
                               <input required value={currentAddress.streetAddress || ''} onChange={e => setCurrentAddress({...currentAddress, streetAddress: e.target.value})} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">City</label>
                               <input required value={currentAddress.city || ''} onChange={e => setCurrentAddress({...currentAddress, city: e.target.value})} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">State / Province</label>
                               <input required value={currentAddress.state || ''} onChange={e => setCurrentAddress({...currentAddress, state: e.target.value})} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Postal Code</label>
                               <input required value={currentAddress.postalCode || ''} onChange={e => setCurrentAddress({...currentAddress, postalCode: e.target.value})} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Country</label>
                               <input required value={currentAddress.country || ''} onChange={e => setCurrentAddress({...currentAddress, country: e.target.value})} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                          </div>
                          <div className="flex items-center gap-4 pt-4 mt-6 border-t border-white/5">
                             <Button type="button" variant="outline" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
                             <Button type="submit" variant="primary" disabled={submitAddressLoading}>
                               {submitAddressLoading ? "Saving..." : "Save Address"}
                             </Button>
                          </div>
                       </form>
                    </div>
                  ) : fetchingAddresses ? (
                    <div className="py-12 border border-white/5 rounded-section-card bg-graphite/10 text-center text-ivory/60">
                      Loading addresses...
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="py-16 px-8 border border-white/5 rounded-section-card bg-graphite/10 text-center flex flex-col items-center">
                      <MapPin className="w-12 h-12 text-muted-text mb-4" />
                      <h3 className="text-xl text-white font-serif mb-2">No saved addresses</h3>
                      <p className="text-ivory/60 mb-6 font-sans text-sm max-w-md">
                        Add a shipping address to checkout faster next time.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((addr) => (
                        <div key={addr.id} className={cn("bg-graphite/20 border rounded-section-card p-6 relative transition-all", addr.isDefault ? "border-bright-gold/50 shadow-sm" : "border-white/5")}>
                          {addr.isDefault && (
                             <div className="absolute top-4 right-4 flex items-center gap-1 text-bright-gold text-xs font-mono uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Default</span>
                             </div>
                          )}
                          <div className="mb-4 pr-16">
                            <p className="text-ivory font-serif text-lg mb-1">{addr.fullName}</p>
                            <p className="text-ivory/70 text-sm font-sans leading-relaxed">
                              {addr.streetAddress}<br />
                              {addr.city}, {addr.state} {addr.postalCode}<br />
                              {addr.country}
                            </p>
                          </div>
                          <div className="flex gap-4 border-t border-white/5 pt-4">
                            <button onClick={() => { setCurrentAddress(addr); setIsEditingAddress(true); }} className="text-xs uppercase tracking-widest text-ivory/70 hover:text-white flex items-center gap-1 transition-colors">
                               <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => handleDeleteAddress(addr.id!)} className="text-xs uppercase tracking-widest text-crimson/70 hover:text-crimson flex items-center gap-1 transition-colors">
                               <Trash2 className="w-3 h-3" /> Delete
                            </button>
                            {!addr.isDefault && (
                               <button onClick={() => handleSetDefault(addr.id!)} className="text-xs uppercase tracking-widest text-bright-gold/70 hover:text-bright-gold flex items-center gap-1 ml-auto transition-colors">
                                  Set Default
                               </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Account;
