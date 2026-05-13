'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FAIcon from './FontAwesome';
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import styles from './Breadcrumbs.module.css';

const routeLabels: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/upload': 'Upload Case',
    '/evidence': 'Evidence',
    '/reconstruction': 'AI Analysis',
    '/visualization': 'Visualization',
    '/collaboration': 'Collaboration',
    '/security': 'Security',
    '/admin': 'Admin',
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    if (pathname === '/' || pathname === '/login') return null;

    const segments = pathname.split('/').filter(Boolean);

    return (
        <div className={styles.breadcrumbs}>
            <Link href="/">
                <FAIcon icon={faHome} style={{ fontSize: '0.85rem' }} />
            </Link>
            {segments.map((segment, i) => {
                const href = '/' + segments.slice(0, i + 1).join('/');
                const isLast = i === segments.length - 1;
                const label = routeLabels[href] || segment;

                return (
                    <span key={href} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FAIcon icon={faChevronRight} className={styles.separator} style={{ fontSize: '0.7rem' }} />
                        {isLast ? (
                            <span className={styles.active}>{label}</span>
                        ) : (
                            <Link href={href}>{label}</Link>
                        )}
                    </span>
                );
            })}
        </div>
    );
}
