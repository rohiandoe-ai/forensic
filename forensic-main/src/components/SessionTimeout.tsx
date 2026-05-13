'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

import FAIcon from './FontAwesome';
import { faClock, faExclamationTriangle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { supabase } from '@/lib/supabase/client';

const TIMEOUT_DURATION = 1800000; // 30 minutes
const WARNING_DURATION = 15000; // 15 seconds warning

export default function SessionTimeout() {
    const pathname = usePathname();
    const [isWarning, setIsWarning] = useState(false);
    const [countdown, setCountdown] = useState(WARNING_DURATION / 1000);
    const isWarningRef = useRef(isWarning);
    const { playError, playClick } = useSoundEffects();

    useEffect(() => {
        isWarningRef.current = isWarning;
    }, [isWarning]);

    const resetTimer = useCallback(() => {
        if (isWarningRef.current) return;

        const lastActive = Date.now();
        localStorage.setItem('lastActive', lastActive.toString());
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (pathname === '/login') return;

        resetTimer();

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;
        events.forEach((e) => document.addEventListener(e, resetTimer));

        const interval = setInterval(() => {
            const raw = localStorage.getItem('lastActive');
            const lastActive = raw ? parseInt(raw, 10) : Date.now();
            const now = Date.now();
            const inactiveTime = now - lastActive;

            if (inactiveTime > TIMEOUT_DURATION && !isWarningRef.current) {
                setIsWarning(true);
                playError();
            }
        }, 1000);

        return () => {
            events.forEach((e) => document.removeEventListener(e, resetTimer));
            clearInterval(interval);
        };
    }, [pathname, resetTimer, playError]);

    useEffect(() => {
        if (!isWarning) return;

        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    void supabase.auth.signOut().finally(() => {
                        window.location.href = '/login';
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [isWarning]);

    const handleStayLoggedIn = () => {
        playClick();
        setIsWarning(false);
        setCountdown(WARNING_DURATION / 1000);
        localStorage.setItem('lastActive', Date.now().toString());
    };

    if (!isWarning) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)',
            }}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--danger)',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '400px',
                    width: '90%',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(255, 82, 82, 0.2)',
                }}
            >
                <FAIcon
                    icon={faExclamationTriangle}
                    style={{ fontSize: '4rem', color: 'var(--danger)', marginBottom: '15px' }}
                />
                <h2
                    style={{
                        fontFamily: 'var(--font-orbitron)',
                        color: 'var(--text-primary)',
                        marginBottom: '10px',
                    }}
                >
                    Session Timeout Warning
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                    Your session is about to expire due to inactivity for security purposes.
                </p>
                <div
                    style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: 'var(--danger)',
                        marginBottom: '25px',
                        fontFamily: 'var(--font-orbitron)',
                    }}
                >
                    00:{countdown.toString().padStart(2, '0')}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                            void supabase.auth.signOut().finally(() => {
                                window.location.href = '/login';
                            });
                        }}
                        style={{ flex: 1 }}
                    >
                        <FAIcon icon={faSignInAlt} /> Logout Now
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleStayLoggedIn}
                        style={{ flex: 1, background: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                        <FAIcon icon={faClock} /> Stay Logged In
                    </button>
                </div>
            </div>
        </div>
    );
}
