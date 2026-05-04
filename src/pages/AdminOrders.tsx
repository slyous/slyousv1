import React, { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/src/lib/firestoreError';
import { formatCurrency } from '@/src/lib/utils';
import Badge from '@/src/components/ui/Badge';
import { OrderStatus } from '@/src/types';
import Button from '@/src/components/ui/Button';
import { useToast } from '@/src/context/ToastContext';
import { Package, Search, Filter, Mail } from 'lucide-react';

const AdminOrders = () => {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(fetchedOrders);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      showToast('Failed to fetch orders', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus, customMessage?: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Add to timeline updates
      const updateData: any = {
        status: newStatus,
        createdAt: serverTimestamp()
      };

      let message = customMessage;
      if (!message) {
        if (newStatus === OrderStatus.PROCESSING) message = 'Your order is currently being packaged and prepared.';
        else if (newStatus === OrderStatus.HANDED_TO_COURIER) message = 'Your package has been handed over to our courier partner.';
        else if (newStatus === OrderStatus.DISPATCHED) message = 'Your package has been dispatched from our facility.';
        else if (newStatus === OrderStatus.OUT_FOR_DELIVERY) message = 'Your package is out for delivery. An email notification has been sent.';
        else if (newStatus === OrderStatus.DELIVERED) message = 'Your package has been delivered.';
      }
      if (message) updateData.message = message;

      await addDoc(collection(db, `orders/${orderId}/updates`), updateData);

      // Send Email Notification
      if (order?.email && message) {
        try {
          // Fire and forget email
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: order.email,
              subject: `Update on your Vellandi Order #${order.orderNumber || orderId.slice(-8).toUpperCase()}`,
              text: `Order Status: ${newStatus}\n\n${message}\n\nTrack your order at: ${window.location.origin}/track-order/${orderId}?email=${encodeURIComponent(order.email)}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FFFFFF; padding: 40px; border-radius: 8px;">
                   <h1 style="color: #D4AF37; font-family: Georgia, serif; font-style: italic;">Vellandi Diamonds</h1>
                   <h2 style="font-size: 18px; margin-bottom: 20px;">Order Update: ${newStatus}</h2>
                   <p style="color: #EAEAEA; line-height: 1.6; margin-bottom: 20px;">${message}</p>
                   <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                     <h3 style="color: #A0A0A0; font-size: 14px; margin-top: 0;">Order Details</h3>
                     <p style="margin: 5px 0; font-family: monospace;">Order #: ${order.orderNumber || orderId.slice(-8).toUpperCase()}</p>
                     <p style="margin: 5px 0;">Total Amount: ${formatCurrency(order.totalPrice || order.total || 0)}</p>
                     <p style="margin: 5px 0; color: #A0A0A0; font-size: 14px;">Shipping Address: ${order.shippingAddress?.streetAddress || ''}, ${order.shippingAddress?.city || ''}</p>
                   </div>
                   <a href="${window.location.origin}/track-order/${orderId}?email=${encodeURIComponent(order.email)}" style="display: inline-block; margin-top: 10px; padding: 12px 24px; background: #D4AF37; color: #0A0A0A; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Your Order</a>
                </div>
              `
            })
          });
        } catch (emailErr) {
          console.error("Failed to send email notification", emailErr);
        }
      }

      showToast(`Order marked as ${newStatus}`, 'success');
      if (newStatus === OrderStatus.OUT_FOR_DELIVERY) {
         showToast(`Email notification sent: Order is out for delivery.`, 'success');
      }
      
      // Optimistic update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      showToast('Failed to update status', 'error');
    }
  };

  if (loading || fetching) return <div className="pt-32 text-center text-ivory">Authenticating...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="status-label-themes text-[10px] uppercase font-mono tracking-widest text-bright-gold mb-2 block">Wire Transfer Management</span>
            <h1 className="text-4xl font-serif text-white italic">Pending Wires</h1>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-ivory px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Orders Table */}
        <div className="bg-graphite/20 border border-white/5 rounded-section-card overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                <input 
                  type="text" 
                  placeholder="Search by Order ID or Ref..." 
                  className="w-full bg-graphite/30 border border-white/10 rounded-pill py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-bright-gold"
                />
             </div>
             <div className="flex items-center gap-3">
               <Filter className="w-4 h-4 text-muted-text" />
               <select className="bg-transparent text-sm text-ivory outline-none focus:text-bright-gold border-none cursor-pointer">
                 <option value="all">All Statuses</option>
                 <option value={OrderStatus.PENDING_CONFIRMATION}>Pending Confirmation</option>
                 <option value={OrderStatus.PAYMENT_RECEIVED}>Payment Received</option>
               </select>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-muted">
                  <th className="p-8">Order ID / Ref</th>
                  <th className="p-8">Customer</th>
                  <th className="p-8">Amount</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-ivory/60">No orders found.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-8">
                        <div className="flex flex-col">
                           <span className="font-mono text-ivory">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</span>
                           <span className="text-[10px] text-muted-text font-mono mt-1">
                             {order.createdAt?.toMillis ? new Date(order.createdAt.toMillis()).toLocaleString() : 'N/A'}
                           </span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col">
                           <span className="text-white">{order.shippingAddress?.fullName}</span>
                           <span className="text-xs text-muted-text mt-1">{order.email}</span>
                        </div>
                      </td>
                      <td className="p-8 font-mono text-bright-gold text-base">{formatCurrency(order.totalPrice || 0)}</td>
                      <td className="p-8">
                        <Badge status={order.status as OrderStatus}>{order.status}</Badge>
                      </td>
                      <td className="p-8 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-graphite/50 border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-bright-gold"
                            disabled={order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED}
                          >
                            {Object.values(OrderStatus).map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
