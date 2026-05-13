'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import FAIcon from './FontAwesome';
import { 
    faShieldAlt, faEnvelope, faLock, faTimes, 
    faFingerprint, faCircleNotch, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('forensic@gmail.com');
    const [password, setPassword] = useState('Forensic@123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Check if user is admin
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user?.id)
                .single();

            if (profileError || profile?.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error('Unauthorized Access: Admin role required.');
            }

            toast.success('Access Granted. Welcome, Administrator.', {
                icon: <FAIcon icon={faFingerprint} style={{ color: '#00a8ff' }} />,
                style: {
                    background: '#0a0c10',
                    color: '#fff',
                    border: '1px solid #00a8ff'
                }
            });
            
            onClose();
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={{
                        width: '100%',
                        maxWidth: '450px',
                        background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
                        border: '1px solid #30363d',
                        borderRadius: '16px',
                        padding: '40px',
                        boxShadow: '0 0 50px rgba(0, 168, 255, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Glowing Accent */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #00a8ff, transparent)'
                    }} />

                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'none',
                            border: 'none',
                            color: '#8b949e',
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                        }}
                    >
                        <FAIcon icon={faTimes} />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(0, 168, 255, 0.1)',
                            border: '1px solid rgba(0, 168, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: '#00a8ff',
                            fontSize: '1.8rem'
                        }}>
                            <FAIcon icon={faShieldAlt} />
                        </div>
                        <h2 style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: 'bold', 
                            color: '#fff',
                            marginBottom: '8px',
                            letterSpacing: '1px',
                            fontFamily: 'var(--font-orbitron)'
                        }}>ADMIN ACCESS</h2>
                        <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Secure Forensic Portal Entrance</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'grid', gap: '20px' }}>
                        {error && (
                            <div style={{
                                background: 'rgba(248, 81, 73, 0.1)',
                                border: '1px solid rgba(248, 81, 73, 0.2)',
                                padding: '12px',
                                borderRadius: '8px',
                                color: '#f85149',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FAIcon icon={faExclamationTriangle} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label style={{ 
                                display: 'block', 
                                color: '#8b949e', 
                                fontSize: '0.75rem', 
                                fontWeight: '600',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>Terminal ID</label>
                            <div style={{ position: 'relative' }}>
                                <FAIcon icon={faEnvelope} style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: '#484f58'
                                }} />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@forensic.recon"
                                    style={{
                                        width: '100%',
                                        background: '#0d1117',
                                        border: '1px solid #30363d',
                                        borderRadius: '10px',
                                        padding: '12px 12px 12px 42px',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#00a8ff'}
                                    onBlur={(e) => e.target.style.borderColor = '#30363d'}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ 
                                display: 'block', 
                                color: '#8b949e', 
                                fontSize: '0.75rem', 
                                fontWeight: '600',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>Security Key</label>
                            <div style={{ position: 'relative' }}>
                                <FAIcon icon={faLock} style={{ 
                                    position: 'absolute', 
                                    left: '14px', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)',
                                    color: '#484f58'
                                }} />
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        background: '#0d1117',
                                        border: '1px solid #30363d',
                                        borderRadius: '10px',
                                        padding: '12px 12px 12px 42px',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#00a8ff'}
                                    onBlur={(e) => e.target.style.borderColor = '#30363d'}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: '#238636',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '14px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginTop: '10px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: '0 4px 12px rgba(35, 134, 54, 0.2)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#2ea043'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#238636'}
                        >
                            {loading ? (
                                <FAIcon icon={faCircleNotch} spin />
                            ) : (
                                <>
                                    <FAIcon icon={faFingerprint} />
                                    AUTHENTICATE
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ 
                        marginTop: '24px', 
                        textAlign: 'center', 
                        borderTop: '1px solid #30363d',
                        paddingTop: '20px'
                    }}>
                        <p style={{ color: '#484f58', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Authorized Personnel Only
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
