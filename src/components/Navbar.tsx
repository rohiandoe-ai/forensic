'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import FAIcon from './FontAwesome';
import ThemeToggle from './ThemeToggle';
import {
    faFingerprint, faHome, faTachometerAlt, faCloudUploadAlt,
    faClipboardList, faRobot, faVrCardboard, faUsers, faShieldAlt, faUser,
    faBars, faUserShield
} from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';

const baseNavItems = [
    { href: '/', label: 'Home', icon: faHome },
    { href: '/dashboard', label: 'Dashboard', icon: faTachometerAlt },
    { href: '/evidence', label: 'Evidence', icon: faClipboardList },
    { href: '/reconstruction', label: 'AI Analysis', icon: faRobot },
    { href: '/visualization', label: 'Visualization', icon: faVrCardboard },
    { href: '/collaboration', label: 'Collaboration', icon: faUsers },
    { href: '/security', label: 'Security', icon: faShieldAlt },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session?.user || cancelled) return;
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle();
            if (!cancelled && data?.role === 'admin') setIsAdmin(true);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const navItems = isAdmin
        ? [
              ...baseNavItems,
              { href: '/admin', label: 'Admin', icon: faUserShield },
          ]
        : baseNavItems;

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
        router.refresh();
    };

    return (pathname === '/login' || pathname.startsWith('/admin')) ? <></> : (
        <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
            <div className={styles.navContainer}>
                <Link href="/" className={styles.navBrand} aria-label="ForensicRecon home">
                    <FAIcon icon={faFingerprint} />
                    <span>Forensic<span className={styles.highlight}>Recon</span></span>
                </Link>
                <ul className={`${styles.navMenu} ${mobileMenuOpen ? styles.open : ''}`} role="menubar">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={pathname === item.href ? styles.active : ''}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FAIcon icon={item.icon} /> <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={styles.navRight}>
                    <ThemeToggle />
                    {isAdmin && (
                        <>
                            <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={handleSignOut}
                                aria-label="Sign out"
                            >
                                Sign out
                            </button>
                            <div className={styles.navUser}>
                                <div className={styles.userAvatar}>
                                    <FAIcon icon={faUser} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <button 
                    className={styles.mobileMenuBtn}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <FAIcon icon={faBars} />
                </button>
            </div>
        </nav>
    );
}
