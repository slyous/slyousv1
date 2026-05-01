import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { db } from '@/src/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, doc as createDocRef } from 'firebase/firestore';
import { ArrowLeft, Save } from 'lucide-react';
import { handleFirestoreError, OperationType } from '@/src/lib/firestoreError';
import Button from '@/src/components/ui/Button';

// Utility to generate a slug from name
const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  
  const isNew = id === 'new';
  const [fetching, setFetching] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: 0,
    marketPrice: 0,
    carat: 0,
    cut: 'Excellent',
    clarity: 'VVS1',
    color: 'D',
    shape: 'Round',
    description: '',
    certificationUrl: '',
    certNumber: '',
    certLab: 'GIA',
    inStock: true,
    imagesText: '' // We use a text area for comma-separated image URLs for simplicity in this demo
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (isNew || !id) return;
      try {
        const docRef = doc(db, 'products', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            price: data.price || 0,
            marketPrice: data.marketPrice || 0,
            carat: data.carat || 0,
            cut: data.cut || 'Excellent',
            clarity: data.clarity || 'VVS1',
            color: data.color || 'D',
            shape: data.shape || 'Round',
            description: data.description || '',
            certificationUrl: data.certificationUrl || '',
            certNumber: data.certNumber || '',
            certLab: data.certLab || 'GIA',
            inStock: data.inStock ?? true,
            imagesText: (data.images || []).join('\n')
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `products/${id}`);
      } finally {
        setFetching(false);
      }
    };
    if (isAdmin) {
      fetchProduct();
    }
  }, [id, isNew, isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      
      // Auto-generate slug if title changes and it's a new product
      if (name === 'name' && isNew) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Prepare data
    const imagesArray = formData.imagesText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (imagesArray.length === 0) {
      setError('At least one image URL is required.');
      setSaving(false);
      return;
    }

    const productData = {
      name: formData.name,
      slug: formData.slug,
      price: formData.price,
      marketPrice: formData.marketPrice || 0,
      carat: formData.carat,
      cut: formData.cut,
      clarity: formData.clarity,
      color: formData.color,
      shape: formData.shape,
      description: formData.description,
      certificationUrl: formData.certificationUrl,
      certNumber: formData.certNumber,
      certLab: formData.certLab,
      inStock: formData.inStock,
      images: imagesArray,
      createdAt: serverTimestamp() // Firestore rules mandate request.time for createdAt (this will be ignored on update if not modified according to 'Immortal Field' rule, but we just set it here)
    };

    try {
      if (isNew) {
        // Create new
        const newRef = createDocRef(collection(db, 'products'));
        await setDoc(newRef, productData);
        navigate('/admin/products');
      } else {
        // Update existing - only omitting createdAt to avoid modifying immortal field if we had strict tests, but rules say data.createdAt == request.time on create. Wait, let's omit createdAt on update to be safe.
        const { createdAt, ...updateData } = productData;
        const targetRef = doc(db, 'products', id!);
        await updateDoc(targetRef, updateData);
        navigate('/admin/products');
      }
    } catch (err: any) {
      setError(err.message || String(err));
      console.error(err);
      handleFirestoreError(err, isNew ? OperationType.CREATE : OperationType.UPDATE, isNew ? 'products' : `products/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || fetching) return <div className="pt-32 text-center text-ivory">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="bg-void min-h-screen pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="mb-10">
          <Link to="/admin/products" className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-colors flex items-center gap-2 mb-6 w-max">
            <ArrowLeft className="w-3 h-3" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-serif text-white italic">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
        </div>

        {error && (
          <div className="bg-crimson/10 border border-crimson/20 p-4 rounded-lg text-crimson mb-8 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-graphite/40 border border-white/5 p-8 rounded-section-card backdrop-blur-sm">
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Slug (URL-friendly)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Market Price / Est. Value (USD)</label>
                <input
                  type="number"
                  name="marketPrice"
                  value={formData.marketPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all font-mono"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all resize-none"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-void checked:bg-bright-gold focus:ring-bright-gold focus:ring-offset-void accent-bright-gold"
                />
                <label htmlFor="inStock" className="text-sm text-ivory">In Stock</label>
              </div>
            </div>
          </div>

          <div className="bg-graphite/40 border border-white/5 p-8 rounded-section-card backdrop-blur-sm">
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Diamond Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Carat Weight</label>
                <input
                  type="number"
                  name="carat"
                  value={formData.carat}
                  onChange={handleChange}
                  required
                  min="0.1"
                  step="0.01"
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Shape</label>
                <select
                  name="shape"
                  value={formData.shape}
                  onChange={handleChange}
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-all"
                >
                  {['Round', 'Princess', 'Emerald', 'Oval', 'Radiant', 'Pear', 'Heart', 'Marquise'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Cut</label>
                <select
                  name="cut"
                  value={formData.cut}
                  onChange={handleChange}
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-all"
                >
                  {['Excellent', 'Very Good', 'Good', 'Fair'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Color</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-all"
                >
                  {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Clarity</label>
                <select
                  name="clarity"
                  value={formData.clarity}
                  onChange={handleChange}
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-all"
                >
                  {['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-graphite/40 border border-white/5 p-8 rounded-section-card backdrop-blur-sm">
            <h2 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">Media & Certification</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Image URLs (One per line)</label>
                <textarea
                  name="imagesText"
                  value={formData.imagesText}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 focus:ring-1 focus:ring-bright-gold/50 outline-none transition-all font-mono text-sm resize-none whitespace-pre"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Certification Lab</label>
                  <select
                    name="certLab"
                    value={formData.certLab}
                    onChange={handleChange}
                    className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-all"
                  >
                    {['GIA', 'AGS', 'IGI'].map(lab => (
                      <option key={lab} value={lab}>{lab}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted mb-2">Certificate Number</label>
                  <input
                    type="text"
                    name="certNumber"
                    value={formData.certNumber}
                    onChange={handleChange}
                    className="w-full bg-void border border-white/10 rounded-lg p-3 text-ivory focus:border-bright-gold/50 outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={saving} className="flex items-center gap-2 px-8">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Product'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminProductEdit;
