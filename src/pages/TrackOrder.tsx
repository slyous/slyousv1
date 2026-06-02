import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { fetchApi } from '@/src/lib/api';
import { Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { OrderStatus, OrderUpdate } from '@/src/types';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';

// Utility for timeline icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case OrderStatus.CREATED: return <Clock className="w-5 h-5 text-blue-400" />;
    case OrderStatus.PENDING_CONFIRMATION: return <Clock className="w-5 h-5 text-orange-400" />;
    case OrderStatus.PAYMENT_RECEIVED: return <CheckCircle className="w-5 h-5 text-bright-gold" />;
    case OrderStatus.PROCESSING: return <Package className="w-5 h-5 text-purple-400" />;
    case OrderStatus.HANDED_TO_COURIER: return <Truck className="w-5 h-5 text-ivory/60" />;
    case OrderStatus.DISPATCHED: return <Truck className="w-5 h-5 text-ivory" />;
    case OrderStatus.OUT_FOR_DELIVERY: return <Truck className="w-5 h-5 text-orange-400" />;
    case OrderStatus.DELIVERED: return <MapPin className="w-5 h-5 text-emerald-400" />;
    case OrderStatus.FULFILLED: return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    default: return <Clock className="w-5 h-5 text-muted-text" />;
  }
};

const TrackOrder = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [orderQueryId, setOrderQueryId] = useState(id || '');
  const [emailQuery, setEmailQuery] = useState(searchParams.get('email') || '');
  
  const [order, setOrder] = useState<any>(null);
  const [updates, setUpdates] = useState<OrderUpdate[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  const fetchOrder = async (idOrNumber: string, emailStr?: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchApi(`/api/orders/${idOrNumber}`);
      if (!res.ok) {
        if (res.status === 404) setError('Order not found. Please check your order details.');
        else setError('Failed to retrieve order status.');
        setOrder(null);
        setLoading(false);
        return;
      }
      
      const orderData = await res.json();
      
      // If email is provided, verify it (public verification layer)
      if (emailStr && orderData.email.toLowerCase().trim() !== emailStr.toLowerCase().trim()) {
        setError('Email does not match our records for this order.');
        setOrder(null);
        setLoading(false);
        return;
      }

      setOrder(orderData);
      setUpdates(orderData.updates || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to retrieve order status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder(id, searchParams.get('email') || undefined);
    }
  }, [id, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQueryId.trim() || !emailQuery.trim()) return;
    navigate(`/track-order/${orderQueryId.trim()}?email=${encodeURIComponent(emailQuery.trim())}`);
  };

  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Search Form */}
        {!id || (!order && !loading) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            <div className="text-center mb-10">
              <span className="status-label-themed inline-block mb-4">Concierge Services</span>
              <h1 className="text-4xl font-serif text-white italic mb-4">Track Your Order</h1>
              <p className="text-ivory/70 font-sans">Enter your order details below to receive real-time updates on your acquisition.</p>
            </div>
            
            <div className="bg-graphite/40 border border-white/5 p-8 rounded-section-card backdrop-blur-sm">
              {error && (
                <div className="bg-crimson/10 border border-crimson/20 text-crimson rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-3">Order ID</label>
                  <input
                    type="text"
                    required
                    value={orderQueryId}
                    onChange={(e) => setOrderQueryId(e.target.value)}
                    placeholder="e.g. VEL-102938"
                    className="w-full bg-void border border-white/10 rounded-lg p-4 text-ivory/80 focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-3">Email Address</label>
                  <input
                    type="email"
                    required
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    placeholder="Enter email used for purchase"
                    className="w-full bg-void border border-white/10 rounded-lg p-4 text-ivory/80 focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all font-sans text-sm"
                  />
                </div>
                <Button type="submit" className="w-full py-4 text-sm mt-4">
                  Track Package
                </Button>
              </form>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <Link to="/track-order" className="text-[10px] uppercase tracking-widest text-muted-text hover:text-white transition-colors mb-6 inline-block">
                  ← Track Another Order
                </Link>
                <h1 className="text-3xl font-serif text-white flex items-center gap-4">
                  Order <span className="font-mono text-bright-gold text-2xl tracking-tight">#{order?.order_number || order?.id?.slice(-8).toUpperCase()}</span>
                </h1>
                <p className="text-ivory/60 mt-2 font-sans">
                  Placed on {order?.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <Badge status={order?.status as OrderStatus || OrderStatus.CREATED} className="px-4 py-2 text-sm">{order?.status || 'CREATED'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Timeline */}
              <div className="md:col-span-2">
                <h3 className="text-[10px] uppercase tracking-widest text-muted-text mb-8">Timeline</h3>
                
                <div className="bg-graphite/20 border border-white/5 rounded-section-card p-8">
                  {loading ? (
                    <div className="text-center py-10 text-ivory/50">Retrieving timeline...</div>
                  ) : updates.length === 0 && !order ? (
                    <div className="text-center py-10 text-ivory/50">No updates available yet.</div>
                  ) : (
                    <div className="relative">
                      {/* Vertical line connector */}
                      <div className="absolute left-6 top-10 bottom-10 w-px bg-white/10 z-0"></div>
                      
                      <div className="space-y-8 relative z-10">
                        {(updates.length > 0 ? updates : [{ id: 'init', status: order?.status || OrderStatus.CREATED, created_at: order?.created_at, message: 'Order has been placed.' }]).map((update: any, idx: number) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={update.id} 
                            className="flex gap-6 items-start"
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-void ${idx === 0 ? 'bg-dark-gold/20 text-bright-gold border-bright-gold/20' : 'bg-white/5 text-muted-text'}`}>
                              {getStatusIcon(update.status)}
                            </div>
                            <div className="pt-2 pb-6 w-full">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <h4 className={`text-sm font-sans uppercase tracking-widest ${idx === 0 ? 'text-bright-gold' : 'text-ivory'}`}>
                                  {update.status}
                                </h4>
                                <span className="text-xs text-muted-text font-mono">
                                  {update.created_at ? new Date(update.created_at).toLocaleString() : ''}
                                </span>
                              </div>
                              {update.message && (
                                <p className="text-ivory/70 text-sm leading-relaxed">{update.message}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Shipping Details */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-graphite/20 border border-white/5 rounded-section-card p-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-muted-text mb-6">Delivery Details</h3>
                  
                  {order?.tracking_number && (
                     <div className="mb-6">
                       <p className="text-xs text-muted-text mb-1">Courier & Tracking</p>
                       <p className="text-ivory font-mono text-sm">{order.courier || 'Standard'}</p>
                       <p className="text-bright-gold font-mono text-sm mt-1">{order.tracking_number}</p>
                     </div>
                  )}
                  
                  <div>
                    <p className="text-xs text-muted-text mb-2">Destination</p>
                    <div className="text-ivory/80 text-sm leading-loose">
                      <p className="font-medium text-ivory">{order?.shipping_fullname}</p>
                      <p>{order?.shipping_street}</p>
                      <p>{order?.shipping_city}, {order?.shipping_state}</p>
                      <p>{order?.shipping_country}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-graphite/20 border border-white/5 rounded-section-card p-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-muted-text mb-4">Support</h3>
                  <p className="text-sm text-ivory/60 mb-6">Questions about your order? Our concierge is available 24/7 to assist with your acquisition.</p>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full text-xs py-3 border-white/10 hover:border-white/30"
                      onClick={() => window.open('https://wa.me/yournumber', '_blank')}
                    >
                      Chat with an expert
                    </Button>
                    <Link to="/contact">
                      <Button variant="ghost" className="w-full text-xs py-3 text-muted-text hover:text-white">
                        Contact via Email
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
