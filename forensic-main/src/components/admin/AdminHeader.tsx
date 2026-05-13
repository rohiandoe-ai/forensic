'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import FAIcon from '@/components/FontAwesome';
import { faSignOutAlt, faShieldAlt, faUserShield, faHome } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminHeader() {
    const router = useRouter();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Failed to sign out');
        } else {
            toast.success('Successfully signed out');
            router.push('/');
            router.refresh();
        }
    };

    return (
        <header style={{
            background: 'rgba(10, 12, 16, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 168, 255, 0.2)',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FAIcon icon={faShieldAlt} style={{ color: '#00a8ff', fontSize: '1.4rem' }} />
                    <span style={{ 
                        color: '#fff', 
                        fontWeight: 'bold', 
                        letterSpacing: '1px',
                        fontFamily: 'var(--font-orbitron)',
                        fontSize: '1rem'
                    }}>ADMIN <span style={{ color: '#00a8ff' }}>COMMAND</span></span>
                </Link>
                
                <div style={{ 
                    height: '20px', 
                    width: '1px', 
                    background: 'rgba(255,255,255,0.1)' 
                }} />

                <nav style={{ display: 'flex', gap: '15px' }}>
                    <Link href="/admin" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FAIcon icon={faUserShield} style={{ fontSize: '0.8rem' }} /> Dashboard
                    </Link>
                    <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FAIcon icon={faHome} style={{ fontSize: '0.8rem' }} /> Main Site
                    </Link>
                </nav>
            </div>

            <button 
                onClick={handleSignOut}
                style={{
                    background: 'rgba(255, 68, 68, 0.1)',
                    color: '#ff4444',
                    border: '1px solid rgba(255, 68, 68, 0.3)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)';
                    e.currentTarget.style.borderColor = '#ff4444';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.3)';
                }}
            >
                <FAIcon icon={faSignOutAlt} />
                SIGN OUT
            </button>
        </header>
    );
}
