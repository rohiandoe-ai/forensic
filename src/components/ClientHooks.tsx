'use client';

import { useEffect } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function ClientHooks() {
    useKeyboardShortcuts();

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW reg failed:', err));
            });
        }
    }, []);

    return null;
}
