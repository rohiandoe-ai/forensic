'use client';

import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useKeyboardShortcuts() {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toast('Search coming soon', { icon: '🔍' });
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            window.location.href = '/upload';
        }

        if (e.key === 'Escape') {
            const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
            openDropdowns.forEach(el => {
                if (el instanceof HTMLElement) el.click();
            });
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            window.location.href = '/dashboard';
        }

        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            /* toast passes a handler for dismiss; we only show static help */
            toast(() => (
                <div style={{
                    background: '#161b2a',
                    border: '1px solid #2a2f45',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    color: '#ffffff',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '0.85rem',
                    minWidth: '280px',
                }}>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 600, marginBottom: '10px', color: '#00a8ff' }}>
                        Keyboard Shortcuts
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                            ['Ctrl + K', 'Search'],
                            ['Ctrl + N', 'New Case'],
                            ['Ctrl + D', 'Dashboard'],
                            ['Ctrl + /', 'Show Shortcuts'],
                            ['Escape', 'Close Menus'],
                        ].map(([key, desc]: string[]) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#b0b7c3' }}>{desc}</span>
                                <code style={{ background: 'rgba(0, 168, 255, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{key}</code>
                            </div>
                        ))}
                    </div>
                </div>
            ), { duration: 4000 });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
