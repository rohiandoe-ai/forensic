'use client';

import Link from 'next/link';
import FAIcon from '@/components/FontAwesome';
import { faFingerprint, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.notFound}>
            <div className={styles.bgGrid}></div>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <FAIcon icon={faFingerprint} />
                </div>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.title}>Case File Not Found</h2>
                <p className={styles.description}>The evidence you are looking for has been moved, classified, or does not exist in the system.</p>
                <div className={styles.actions}>
                    <Link href="/" className="btn btn-primary">
                        <FAIcon icon={faHome} /> Return to Base
                    </Link>
                    <Link href="/dashboard" className="btn btn-outline">
                        <FAIcon icon={faSearch} /> Search Dashboard
                    </Link>
                </div>
                <div className={styles.classified}>
                    <span>ACCESS DENIED — FILE CLASSIFIED</span>
                </div>
            </div>
        </div>
    );
}
