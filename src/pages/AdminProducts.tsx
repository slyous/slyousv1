import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';
import { handleFirestoreError, OperationType } from '@/src/lib/firestoreError';

const AdminProducts = () => {
  const { isAdmin, loading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetchedProducts);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'products');
      } finally {
        setFetching(false);
      }
    };

    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  if (loading || fetching) return <div className="pt-32 text-center text-ivory">Loading products...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="status-label-themed inline-block mb-4">Inventory</span>
            <h1 className="text-4xl font-serif text-white italic">Manage Products</h1>
          </div>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 bg-bright-gold text-void px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-void transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        <div className="bg-graphite/20 border border-white/5 rounded-section-card overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-muted">
                  <th className="p-6">Product</th>
                  <th className="p-6">Specs</th>
                  <th className="p-6">Price</th>
                  <th className="p-6">Inventory</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-ivory/60">No products found.</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-md bg-white/5 overflow-hidden border border-white/10 shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-graphite flex items-center justify-center"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-serif text-white whitespace-nowrap">{product.name}</p>
                            <p className="text-xs text-muted font-mono">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-ivory/80 font-mono text-xs">
                        {product.carat}ct • {product.cut} • {product.color} • {product.clarity}
                      </td>
                      <td className="p-6 text-bright-gold font-medium">{formatCurrency(product.price || 0)}</td>
                      <td className="p-6">
                        {product.inStock ? (
                          <span className="text-success text-xs font-mono uppercase">In Stock</span>
                        ) : (
                          <span className="text-crimson/80 text-xs font-mono uppercase">Out of Stock</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/admin/products/${product.id}`} className="text-muted hover:text-white p-2 transition-colors">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(product.id, product.name)} className="text-crimson/70 hover:text-crimson p-2 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
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

export default AdminProducts;
