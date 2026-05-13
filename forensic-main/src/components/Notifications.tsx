'use client';

import { useState } from 'react';
import FAIcon from './FontAwesome';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { faBell, faTimes, faCheckCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './Notifications.module.css';

const initialNotifications = [
    { id: 1, type: 'success', icon: faCheckCircle, title: 'Analysis Complete', desc: 'AI pattern analysis for CS-2024-001 is ready', time: '2 min ago', read: false },
    { id: 2, type: 'warning', icon: faExclamationTriangle, title: 'Evidence Pending', desc: '3 evidence items awaiting review', time: '15 min ago', read: false },
    { id: 3, type: 'info', icon: faInfoCircle, title: 'New Team Member', desc: 'Dr. Emily Patel joined the investigation', time: '1 hour ago', read: true },
];

export default function Notifications() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const { playNotification, playClick } = useSoundEffects();

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        playClick();
    };

    const dismiss = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        playClick();
    };

    return (
        <div className={styles.container}>
            <button className={styles.bellBtn} onClick={() => { setOpen(!open); if (!open) playNotification(); }} aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`} aria-expanded={open}>
                <FAIcon icon={faBell} />
                {unreadCount > 0 && <span className={styles.badge} aria-label={`${unreadCount} unread notifications`}>{unreadCount}</span>}
            </button>

            {open && (
                <div className={styles.dropdown} role="menu" aria-label="Notification list">
                    <div className={styles.header}>
                        <h3>Notifications</h3>
                        <button className={styles.markAll} onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); playClick(); }} aria-label="Mark all notifications as read">
                            Mark all read
                        </button>
                    </div>
                    <div className={styles.list}>
                        {notifications.length === 0 ? (
                            <p className={styles.empty}>No notifications</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ''}`} role="menuitem">
                                    <div className={`${styles.icon} ${styles[n.type]}`}>
                                        <FAIcon icon={n.icon} />
                                    </div>
                                    <div className={styles.content} onClick={() => markAsRead(n.id)} role="button" tabIndex={0} aria-label={n.title}>
                                        <h4>{n.title}</h4>
                                        <p>{n.desc}</p>
                                        <span className={styles.time}>{n.time}</span>
                                    </div>
                                    <button className={styles.dismiss} onClick={() => dismiss(n.id)} aria-label={`Dismiss notification: ${n.title}`}>
                                        <FAIcon icon={faTimes} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
