'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Mail, Lock, Eye, EyeOff, Loader2, 
  AlertCircle, Fingerprint, ChevronRight 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Fetch User Profile for Admin Role Check
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) throw new Error('Security verification failed.');

        // 3. Admin Role Check - Restricting to Admins
        if (profile?.role === 'admin') {
          toast.success('Admin access granted.', {
            icon: <Fingerprint className="text-cyan-400" />,
            duration: 2000,
          });
          router.push('/admin');
          router.refresh();
        } else {
          // If not admin, sign out and show access denied
          await supabase.auth.signOut();
          const accessDeniedMsg = 'Access denied: Unauthorized personnel.';
          setError(accessDeniedMsg);
          toast.error(accessDeniedMsg);
        }
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      const msg = err.message || 'Authentication failure.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] p-4 sm:p-6 font-sans">
      {/* Minimal Cyber Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[64px_64px] opacity-[0.05]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[440px] z-10"
      >
        <div className="bg-[#11141b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-10">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1 uppercase font-orbitron">
              Admin Login
            </h1>
            <p className="text-sm text-gray-400">
              Secure Investigation Portal
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200 font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-0.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="forensic@admin.gov"
                    className="w-full h-12 bg-black/20 border border-white/10 text-white rounded-xl pl-11 pr-4 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-0.5">
                  Secure Access Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-black/20 border border-white/10 text-white rounded-xl pl-11 pr-12 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm placeholder:text-gray-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="text-sm uppercase tracking-widest">Login to Dashboard</span>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Footer Notice */}
            <div className="text-center pt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                Authorized Forensic Personnel Only
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      <style jsx global>{`
        @font-face {
          font-family: 'Orbitron';
          src: url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        }
      `}</style>
    </div>
  );
}
