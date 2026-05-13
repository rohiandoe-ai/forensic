'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FAIcon from './FontAwesome';
import { faFingerprint, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Footer.module.css';

export default function Footer() {
    const pathname = usePathname();
    return (pathname === '/login' || pathname.startsWith('/admin')) ? <></> : (

        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <FAIcon icon={faFingerprint} />
                        <span>Forensic<span className={styles.highlight}>Recon</span></span>
                        <p className={styles.footerTagline}>Advanced Crime Scene Reconstruction System</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <div className={styles.footerSection}>
                            <h4>System</h4>
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/upload">Upload Case</Link>
                            <Link href="/evidence">Evidence Management</Link>
                            <Link href="/reconstruction">AI Analysis</Link>
                            <Link href="/admin" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>Admin Access</Link>
                        </div>
                        <div className={styles.footerSection}>
                            <h4>Resources</h4>
                            <Link href="/resources#resources">Resources</Link>
                            <Link href="/resources#security-ethics">Security &amp; Ethics</Link>
                            <Link href="/resources#documentation">Documentation</Link>
                            <Link href="/resources#training">Training</Link>
                            <Link href="/resources#support">Support</Link>
                        </div>
                        <div className={styles.footerSection}>
                            <h4>Legal</h4>
                            <Link href="/resources#legal">Legal</Link>
                            <Link href="/resources#privacy-policy">Privacy Policy</Link>
                            <Link href="/resources#terms">Terms of Service</Link>
                            <Link href="/resources#compliance">Compliance</Link>
                            <Link href="/resources#audit-logs">Audit Logs</Link>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2024 ForensicRecon System. For authorized law enforcement use only.</p>
                    <div className={styles.footerSecurity}>
                        <FAIcon icon={faShieldAlt} />
                        <span>Secure Connection Encrypted</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
