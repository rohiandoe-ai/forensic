'use client';

import { useEffect, useState } from 'react';

interface Visit {
    path: string;
    title: string;
    timestamp: number;
}

const STORAGE_KEY = 'forensic_recent_visits';

export function useRecentlyVisited() {
    const [visits, setVisits] = useState<Visit[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as Visit[];
                window.setTimeout(() => setVisits(parsed), 0);
            }
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        const handleRouteChange = () => {
            const path = window.location.pathname;
            if (path === '/' || path === '/login') return;

            const titleMap: Record<string, string> = {
                '/dashboard': 'Dashboard',
                '/evidence': 'Evidence',
                '/upload': 'Upload',
                '/reconstruction': 'AI Analysis',
                '/visualization': 'Visualization',
                '/collaboration': 'Collaboration',
                '/security': 'Security',
                '/settings': 'Settings',
            };

            const newVisit: Visit = {
                path,
                title: titleMap[path] || 'Page',
                timestamp: Date.now(),
            };

            setVisits(prev => {
                const filtered = prev.filter(v => v.path !== path);
                const updated = [newVisit, ...filtered].slice(0, 5);
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
                return updated;
            });
        };

        handleRouteChange();
    }, []);

    return visits;
}
