'use client';

import { useState, useEffect } from 'react';
import Skeleton from './Skeleton';
import styles from './PageLoader.module.css';

interface PageLoaderProps {
    children: React.ReactNode;
    type: 'dashboard' | 'evidence' | 'upload' | 'reconstruction' | 'visualization' | 'collaboration' | 'security' | 'admin';
}

export default function PageLoader({ children, type }: PageLoaderProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800 + Math.random() * 600);
        return () => clearTimeout(timer);
    }, [type]);

    if (!loading) return <>{children}</>;

    if (type === 'dashboard' || type === 'admin') {
        return (
            <div className={styles.loader}>
                <div className={styles.statRow}>
                    <Skeleton type="card" count={4} />
                </div>
                <Skeleton type="rect" />
                <Skeleton type="text" count={6} />
            </div>
        );
    }

    if (type === 'evidence') {
        return (
            <div className={styles.loader}>
                <div className={styles.filterRow}>
                    <Skeleton type="textShort" count={3} />
                </div>
                <Skeleton type="rect" />
                <Skeleton type="text" count={8} />
            </div>
        );
    }

    if (type === 'upload') {
        return (
            <div className={styles.loader}>
                <Skeleton type="title" />
                <Skeleton type="text" count={5} />
                <Skeleton type="rect" />
            </div>
        );
    }

    if (type === 'visualization') {
        return (
            <div className={styles.loader}>
                <Skeleton type="title" />
                <Skeleton type="rect" />
                <Skeleton type="text" count={4} />
            </div>
        );
    }

    if (type === 'collaboration') {
        return (
            <div className={styles.loader}>
                <Skeleton type="title" />
                <div className={styles.statRow}>
                    <Skeleton type="card" count={4} />
                </div>
                <Skeleton type="rect" />
            </div>
        );
    }

    // reconstruction & security
    return (
        <div className={styles.loader}>
            <Skeleton type="title" />
            <Skeleton type="text" count={6} />
            <Skeleton type="rect" />
        </div>
    );
}
