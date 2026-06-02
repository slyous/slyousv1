import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from '@/src/components/ui/Button';
import { useAuth } from '@/src/context/AuthContext';
import { fetchApi } from '@/src/lib/auth-api';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/src/context/ToastContext';

const Register = () => {
  const { user, loading, login } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) return <div className="pt-32 text-center text-ivory">Authenticating...</div>;
  if (user) return <Navigate to="/account" replace />;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchApi('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        showToast('Account created successfully', 'success');
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      showToast('A network error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-void min-h-screen pt-32 pb-32 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-graphite/40 border border-white/5 p-10 rounded-section-card backdrop-blur-md text-center"
        >
          <div className="w-12 h-12 rounded-full bg-bright-gold/10 text-bright-gold flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          
          <h1 className="text-3xl font-serif text-white italic mb-2">Create Account</h1>
          <p className="text-sm text-ivory/60 mb-8 font-sans">
            Join Veloura to curate your collection and manage orders.
          </p>

          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-void/50 border border-white/10 rounded-md py-3 px-4 text-white text-sm focus:outline-none focus:border-bright-gold transition-colors"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-void/50 border border-white/10 rounded-md py-3 px-4 text-white text-sm focus:outline-none focus:border-bright-gold transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-text mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-void/50 border border-white/10 rounded-md py-3 px-4 text-white text-sm focus:outline-none focus:border-bright-gold transition-colors"
                placeholder="Create a password"
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-ivory/60">
              Already have an account? <Link to="/login" className="text-bright-gold hover:underline">Sign in</Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-muted-text">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
