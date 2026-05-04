import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/src/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Order, OrderStatus } from '@/src/types';
import { useToast } from '@/src/context/ToastContext';
import { formatCurrency } from '@/src/lib/utils';
import Button from '@/src/components/ui/Button';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '@/src/lib/firestoreError';

const WireTransferCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fallback to provided details since import.meta.env might not be populated by the user
  const env = (import.meta as any).env;
  const bankDetails = {
    bank: env.VITE_WIRE_BANK_NAME || "Discover Bank",
    routing: env.VITE_WIRE_ROUTING_NUMBER || "031100649",
    account: env.VITE_WIRE_ACCOUNT_NUMBER || "7065995885",
    name: env.VITE_WIRE_ACCOUNT_NAME || "Montrel Outley",
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        } else {
          showToast("Order not found.", "error");
          navigate('/');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `orders/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate, showToast]);

  const handleConfirmSent = async () => {
    if (!id || !order) return;
    setConfirming(true);
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: OrderStatus.PENDING_CONFIRMATION,
      });
      showToast("Payment confirmation recorded", "success");
      // @ts-ignore
      navigate('/order-confirmation', { state: { orderId: id, orderNumber: order.orderNumber, wirePending: true } });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
      showToast("Failed to update order", "error");
    } finally {
      setConfirming(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-void min-h-screen pt-32 flex justify-center items-center">
        <div className="w-8 h-8 border-t-2 border-bright-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="bg-void min-h-screen pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-serif text-white italic mb-4">Complete Your Wire Transfer</h1>
          <p className="text-ivory/70 font-sans max-w-2xl mx-auto">
            Your order has been created. To secure your reservation, please initiate a wire transfer within 24 hours. Your pieces will be held during this period.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Wire Instructions */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-graphite/40 border border-white/10 rounded-card p-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                <AlertCircle className="w-5 h-5 text-bright-gold" />
                <h2 className="text-lg font-serif text-white">Payment Instructions</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-muted-text flex items-center">Beneficiary Name</span>
                  <div className="col-span-2 flex justify-between items-center">
                    <span className="text-white font-serif">{bankDetails.name}</span>
                    <button onClick={() => copyToClipboard(bankDetails.name, 'name')} className="p-2 -mr-2 text-muted-text hover:text-bright-gold bg-white/5 hover:bg-white/10 rounded-md transition-all sm:opacity-50 sm:hover:opacity-100">
                      {copiedField === 'name' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-muted-text flex items-center">Bank Name</span>
                  <div className="col-span-2 flex justify-between items-center">
                    <span className="text-white font-serif">{bankDetails.bank}</span>
                    <button onClick={() => copyToClipboard(bankDetails.bank, 'bank')} className="p-2 -mr-2 text-muted-text hover:text-bright-gold bg-white/5 hover:bg-white/10 rounded-md transition-all sm:opacity-50 sm:hover:opacity-100">
                      {copiedField === 'bank' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-muted-text flex items-center">Account Number</span>
                  <div className="col-span-2 flex justify-between items-center">
                    <span className="text-white font-mono tracking-widest">{bankDetails.account}</span>
                    <button onClick={() => copyToClipboard(bankDetails.account, 'account')} className="p-2 -mr-2 text-muted-text hover:text-bright-gold bg-white/5 hover:bg-white/10 rounded-md transition-all sm:opacity-50 sm:hover:opacity-100">
                      {copiedField === 'account' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-muted-text flex items-center">Routing Number</span>
                  <div className="col-span-2 flex justify-between items-center">
                    <span className="text-white font-mono tracking-widest">{bankDetails.routing}</span>
                    <button onClick={() => copyToClipboard(bankDetails.routing, 'routing')} className="p-2 -mr-2 text-muted-text hover:text-bright-gold bg-white/5 hover:bg-white/10 rounded-md transition-all sm:opacity-50 sm:hover:opacity-100">
                      {copiedField === 'routing' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bright-gold/5 border border-bright-gold/20 rounded-card p-6">
              <h3 className="text-[10px] font-mono tracking-widest text-bright-gold uppercase mb-2">Important Payment Memo</h3>
              {/* @ts-ignore */}
              <p className="text-white text-sm">Please include <span className="font-mono text-bright-gold font-bold">{order.orderNumber || order.id.slice(-8).toUpperCase()}</span> in your transfer memo for rapid verification.</p>
            </div>
            
            <Button 
              onClick={handleConfirmSent}
              disabled={confirming}
              size="lg"
              className="w-full h-14 bg-white text-void hover:bg-ivory"
            >
              {confirming ? 'Initiating Verification...' : "I've Sent The Payment"}
            </Button>
          </div>

          {/* Quick Summary */}
          <div className="md:col-span-2">
            <div className="bg-graphite/20 border border-white/5 rounded-card p-6 sticky top-32">
              <h3 className="text-lg font-serif text-white italic mb-6">Order Invoice</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-text uppercase font-mono tracking-widest">Order Ref</span>
                  <div className="flex items-center gap-2">
                    {/* @ts-ignore */}
                    <span className="text-white font-mono text-lg">{order.orderNumber || order.id.slice(-8).toUpperCase()}</span>
                    <button 
                      // @ts-ignore
                      onClick={() => copyToClipboard(order.orderNumber || order.id.slice(-8).toUpperCase(), 'ref')} 
                      className="p-1.5 text-muted-text hover:text-bright-gold bg-white/5 hover:bg-white/10 rounded-md transition-all"
                    >
                      {copiedField === 'ref' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-text uppercase font-mono tracking-widest">Total Amount</span>
                  {/* @ts-ignore */}
                  <span className="text-bright-gold font-mono text-lg">{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-ivory/40 uppercase tracking-widest font-mono text-center">Billed To</p>
                <div className="text-center">
                  <p className="text-sm text-ivory">{order.shippingAddress?.fullName}</p>
                  <p className="text-[10px] text-muted-text mt-1">{order.shippingAddress?.email || (order as any).email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WireTransferCheckout;
