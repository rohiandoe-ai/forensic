'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Mail, Eye, EyeOff, Loader2, 
  ChevronRight, CheckCircle2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we just logged out to show a toast (simulated for UI)
    const isLoggedOut = typeof window !== 'undefined' && localStorage.getItem('loggedOut') === 'true';
    if (isLoggedOut) {
      setShowToast(true);
      localStorage.removeItem('loggedOut');
      setTimeout(() => setShowToast(false), 3000);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'admin') {
          toast.success('Signed in successfully');
          router.push('/admin');
        } else {
          await supabase.auth.signOut();
          setError('Only authorized clinic staff should access this area.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans p-6">
      {/* Toast Notification (Top Right) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-50 bg-[#ecfdf5] border border-[#10b981]/20 text-[#065f46] px-5 py-3 rounded-xl shadow-sm flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium">Logged out successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[480px]">
        {/* Top Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e3a8a] mb-6 shadow-lg shadow-blue-900/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Admin Portal</h1>
          <p className="text-[#64748b] text-sm">Sign in to manage your clinic</p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] p-10 sm:p-12 border border-gray-100"
        >
          <form onSubmit={handleLogin} className="space-y-7">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-[#1e293b] ml-0.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail className="w-4.5 h-4.5 text-[#94a3b8] group-focus-within:text-[#1e3a8a] transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@smilecare.com"
                    className="w-full h-14 bg-white border border-gray-200 rounded-2xl pl-12 pr-4 outline-none focus:border-[#1e3a8a]/30 focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-[15px] text-[#1e293b] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-[#1e293b] ml-0.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4.5 h-4.5 text-[#94a3b8] group-focus-within:text-[#1e3a8a] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 bg-[#eff6ff] border border-[#dbeafe] rounded-2xl pl-12 pr-12 outline-none focus:border-[#1e3a8a]/30 focus:ring-4 focus:ring-[#1e3a8a]/5 transition-all text-[15px] text-[#1e293b] placeholder:text-[#94a3b8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#1e3a8a] transition-colors"
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
              className="w-full h-15 bg-[#1e3a8a] hover:bg-[#1e293b] text-white font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-[15px]">Sign In</span>
                  <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Footer Text */}
            <div className="text-center space-y-1 pt-4">
              <p className="text-[11px] text-[#94a3b8] font-medium">
                Only authorized clinic staff should access this area.
              </p>
              <p className="text-[11px] text-[#94a3b8] font-medium uppercase tracking-wider">
                Secure environment • HIPAA Compliant
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
