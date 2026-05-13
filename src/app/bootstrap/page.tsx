'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BootstrapPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const bootstrapAdmin = async () => {
    setStatus('loading');
    setMessage('Initializing bootstrap sequence...');

    try {
      // 1. Attempt to sign up the admin user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'forensic@gmail.com',
        password: 'Forensic@123',
        options: {
          data: {
            display_name: 'Lead Forensic Admin',
          }
        }
      });

      if (signUpError) {
        // If user already exists, that's fine, we just want to make sure the profile is set
        if (signUpError.message.includes('already registered')) {
          setMessage('User already exists in Auth. Updating profile role...');
        } else {
          throw signUpError;
        }
      }

      setMessage('Auth user verified. Please run the SQL script in your Supabase Dashboard to grant "admin" role to this email.');
      setStatus('success');
      
    } catch (err: any) {
      console.error('Bootstrap error:', err);
      setMessage(err.message || 'An error occurred during bootstrap.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c14] p-4 font-roboto">
      <div className="max-w-md w-full bg-[#161b2a] border border-[#2a2f45] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white font-orbitron">SYSTEM BOOTSTRAP</h1>
          <p className="text-gray-400 text-sm mt-2">Initialize Admin Credentials</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-[#0a0c14] rounded-lg border border-[#2a2f45]">
            <div className="text-xs text-gray-500 uppercase mb-1">Target Account</div>
            <div className="text-white font-mono text-sm">forensic@gmail.com</div>
          </div>
        </div>

        {status === 'idle' && (
          <button
            onClick={bootstrapAdmin}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all"
          >
            EXECUTE BOOTSTRAP
          </button>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 text-blue-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm animate-pulse">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 text-green-400 text-center">
              <CheckCircle2 className="w-12 h-12" />
              <p className="text-sm font-medium">{message}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-yellow-400 text-xs leading-relaxed">
              <strong>CRITICAL STEP:</strong> You MUST run the SQL script in your Supabase Dashboard SQL Editor to officially grant the "admin" role. Without it, the system will deny access.
            </div>
            <a 
              href="/login" 
              className="block w-full text-center bg-[#2a2f45] hover:bg-[#353b5a] text-white py-3 rounded-xl transition-all"
            >
              GO TO LOGIN
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 text-red-400 text-center">
            <AlertCircle className="w-12 h-12" />
            <p className="text-sm">{message}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-sm underline opacity-70 hover:opacity-100"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
