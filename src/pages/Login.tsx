import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Badge from '@/src/components/ui/Badge';
import Button from '@/src/components/ui/Button';
import { useAuth } from '@/src/context/AuthContext';
import { signInWithGoogle } from '@/src/lib/firebase';
import { Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  if (loading) return <div className="pt-32 text-center text-ivory">Authenticating...</div>;
  if (user) return <Navigate to={from} replace />;

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
          
          <h1 className="text-3xl font-serif text-white italic mb-2">Welcome Back</h1>
          <p className="text-sm text-ivory/60 mb-8 font-sans">
            Sign in to access your curated collection, order history, and exclusive benefits.
          </p>

          <Button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-4"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
            <span>Continue with Google</span>
          </Button>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-muted-text">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
