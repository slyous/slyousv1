import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Package, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import Badge from '@/src/components/ui/Badge';
import { OrderStatus } from '@/src/types';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/src/lib/firestoreError';

interface Stats {
  orderCount: number;
  productCount: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchStatsAndOrders = async () => {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        const data = await res.json();
        setStats(data);
        
        // Fetch recent orders
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching admin stats/orders:', error);
      } finally {
        setFetching(false);
      }
    };

    if (isAdmin) {
      fetchStatsAndOrders();
    }
  }, [isAdmin, user]);

  if (loading || fetching) return <div className="pt-32 text-center text-ivory">Authenticating...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-bright-gold' },
    { title: 'Active Orders', value: stats?.orderCount || 0, icon: ShoppingBag, color: 'text-blue-400' },
    { title: 'Products', value: stats?.productCount || 0, icon: Package, color: 'text-purple-400' },
    { title: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="status-label-themed">Admin Control</span>
            <h1 className="text-4xl font-serif text-white italic">Executive Overview</h1>
          </div>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-ivory px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            <Package className="w-5 h-5" />
            Manage Products
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-graphite/40 border border-white/5 p-8 rounded-card backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={stat.color} />
                <span className="text-[10px] uppercase tracking-widest text-muted">Real-time</span>
              </div>
              <p className="text-sm text-muted mb-1">{stat.title}</p>
              <h3 className="text-3xl font-sans text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Orders Table Snapshot */}
        <div className="bg-graphite/20 border border-white/5 rounded-section-card overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-serif text-white italic">Recent Acquisitions</h2>
            <button className="text-xs uppercase tracking-widest text-bright-gold hover:underline">View All Orders</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-muted">
                  <th className="p-8">Order ID</th>
                  <th className="p-8">Customer</th>
                  <th className="p-8">Status</th>
                  <th className="p-8">Date</th>
                  <th className="p-8">Total</th>
                  <th className="p-8">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-ivory/60">No recent orders found.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-8 font-mono text-ivory">#{order.id.slice(-8).toUpperCase()}</td>
                      <td className="p-8 text-ivory">{order.email}</td>
                      <td className="p-8">
                        <Badge status={order.status as OrderStatus}>{order.status}</Badge>
                      </td>
                      <td className="p-8 text-ivory/60">
                        {order.createdAt?.toMillis ? new Date(order.createdAt.toMillis()).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-8 text-bright-gold">{formatCurrency(order.totalPrice || 0)}</td>
                      <td className="p-8">
                        <Link to={`/admin/orders/${order.id}`} className="text-xs uppercase tracking-widest text-muted hover:text-white">Manage</Link>
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

export default AdminDashboard;
