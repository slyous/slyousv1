import React, { useEffect, useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { ShoppingBag, LogOut, Package, MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/src/lib/api';
import { formatCurrency, cn } from '@/src/lib/utils';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';
import { OrderStatus, Address } from '@/src/types';

const Account = () => {
  const { user, loading, logout } = useAuth();
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
        const res = await fetchApi('/api/orders');
        if (res.ok) {
          const fetchedOrders = await res.json();
          setOrders(fetchedOrders);
        }
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
        const res = await fetchApi('/api/addresses');
        if (res.ok) {
          const fetched = await res.json();
          setAddresses(fetched);
        }
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
        is_default: (currentAddress as any).is_default || addresses.length === 0, 
      };

      if (currentAddress.id) {
        await fetchApi(`/api/addresses/${currentAddress.id}`, { method: 'DELETE' });
      }
      
      const res = await fetchApi('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData)
      });
      
      if (res.ok) {
        // Re-fetch to get correct state
        const fetchRes = await fetchApi('/api/addresses');
        if (fetchRes.ok) {
          setAddresses(await fetchRes.json());
        }
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
      await fetchApi(`/api/addresses/${id}`, { method: 'DELETE' });
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting address", error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const addressToUpdate = addresses.find(a => a.id === id);
      if (!addressToUpdate) return;
      
      // Delete and recreate as default
      await fetchApi(`/api/addresses/${id}`, { method: 'DELETE' });
      const res = await fetchApi('/api/addresses', {
        method: 'POST',
        body: JSON.stringify({ ...addressToUpdate, is_default: true })
      });
      
      if (res.ok) {
        const fetchRes = await fetchApi('/api/addresses');
        if (fetchRes.ok) {
          setAddresses(await fetchRes.json());
        }
      }
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
                <div className="w-24 h-24 rounded-full border-2 border-dark-gold/30 p-1 mb-4 overflow-hidden bg-bright-gold/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-bright-gold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <h2 className="text-xl font-serif text-white">{user.name}</h2>
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
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-ivory hover:text-white text-sm transition-colors mt-8">
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
                                Order #{order.order_number || order.id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-ivory font-sans text-sm">
                                Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recently'}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className="text-bright-gold text-lg">{formatCurrency(order.total_price || 0)}</p>
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
                               <input required value={(currentAddress as any).full_name || ''} onChange={e => setCurrentAddress({...currentAddress, full_name: e.target.value} as any)} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Street Address</label>
                               <input required value={(currentAddress as any).street_address || ''} onChange={e => setCurrentAddress({...currentAddress, street_address: e.target.value} as any)} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">City</label>
                               <input required placeholder="New York" value={(currentAddress as any).city || ''} onChange={e => setCurrentAddress({...currentAddress, city: e.target.value} as any)} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">State / Province</label>
                               <input required placeholder="NY" value={(currentAddress as any).state || ''} onChange={e => setCurrentAddress({...currentAddress, state: e.target.value} as any)} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Postal Code</label>
                               <input required placeholder="10001" value={(currentAddress as any).postal_code || ''} onChange={e => setCurrentAddress({...currentAddress, postal_code: e.target.value} as any)} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
                            </div>
                            <div>
                               <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Country</label>
                               <input required placeholder="United States of America" value={(currentAddress as any).country || ''} onChange={e => setCurrentAddress({...currentAddress, country: e.target.value} as any)} className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory outline-none focus:border-bright-gold/50 field-focus" />
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
                        <div key={addr.id} className={cn("bg-graphite/20 border rounded-section-card p-6 relative transition-all", (addr as any).is_default ? "border-bright-gold/50 shadow-sm" : "border-white/5")}>
                          {(addr as any).is_default && (
                             <div className="absolute top-4 right-4 flex items-center gap-1 text-bright-gold text-xs font-mono uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Default</span>
                             </div>
                          )}
                          <div className="mb-4 pr-16">
                            <p className="text-ivory font-serif text-lg mb-1">{(addr as any).full_name}</p>
                            <p className="text-ivory/70 text-sm font-sans leading-relaxed">
                              {(addr as any).street_address}<br />
                              {(addr as any).city}, {(addr as any).state} {(addr as any).postal_code}<br />
                              {(addr as any).country}
                            </p>
                          </div>
                          <div className="flex gap-4 border-t border-white/5 pt-4">
                            <button onClick={() => { setCurrentAddress(addr); setIsEditingAddress(true); }} className="text-xs uppercase tracking-widest text-ivory/70 hover:text-white flex items-center gap-1 transition-colors">
                               <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => handleDeleteAddress(addr.id!)} className="text-xs uppercase tracking-widest text-crimson/70 hover:text-crimson flex items-center gap-1 transition-colors">
                               <Trash2 className="w-3 h-3" /> Delete
                            </button>
                            {!(addr as any).is_default && (
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
