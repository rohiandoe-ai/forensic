'use client';

import { useState } from 'react';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import toast from 'react-hot-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
    faUser, faBell, faShieldAlt, faPalette, faKeyboard,
    faSave, faCog, faGlobe, faLock, faEye, faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

export default function SettingsPage() {
    const { playSuccess, playClick } = useSoundEffects();
    const [settings, setSettings] = useLocalStorage('forensic_settings', {
        notifications: true,
        sounds: true,
        autoSave: true,
        darkMode: true,
        language: 'en',
        dataRetention: '90',
    });

    const toggleSetting = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
        playClick();
    };

    const handleSave = () => {
        playSuccess();
        toast.success('Settings saved successfully!');
    };

    return (
        <PageLoader type="security">
        <div className={styles.settings} role="main" aria-label="Settings page">
            <div className="container">
                <h1>Settings</h1>
                <p>Manage your account preferences and system configuration</p>

                <div className={styles.settingsGrid}>
                    <div className="section">
                        <h2><FAIcon icon={faUser} /> Profile</h2>
                        <div className={styles.formGroup}>
                            <label>Display Name</label>
                            <input type="text" defaultValue="" placeholder="Display name" aria-label="Display name" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input type="email" defaultValue="s.miller@forensic-recon.gov" aria-label="Email" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Badge Number</label>
                            <input type="text" defaultValue="DET-2847" readOnly aria-label="Badge number" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Department</label>
                            <input type="text" defaultValue="Major Crimes Unit" aria-label="Department" />
                        </div>
                    </div>

                    <div className="section">
                        <h2><FAIcon icon={faBell} /> Notifications</h2>
                        <div className={styles.toggleRow}>
                            <div>
                                <h3>Push Notifications</h3>
                                <p>Receive alerts for case updates</p>
                            </div>
                            <button
                                className={`${styles.toggle} ${settings.notifications ? styles.toggleOn : ''}`}
                                onClick={() => toggleSetting('notifications')}
                                role="switch"
                                aria-checked={settings.notifications}
                                aria-label="Toggle push notifications"
                            >
                                <span className={styles.toggleKnob}></span>
                            </button>
                        </div>
                        <div className={styles.toggleRow}>
                            <div>
                                <h3>Sound Effects</h3>
                                <p>Audio feedback for actions</p>
                            </div>
                            <button
                                className={`${styles.toggle} ${settings.sounds ? styles.toggleOn : ''}`}
                                onClick={() => toggleSetting('sounds')}
                                role="switch"
                                aria-checked={settings.sounds}
                                aria-label="Toggle sound effects"
                            >
                                <span className={styles.toggleKnob}></span>
                            </button>
                        </div>
                        <div className={styles.toggleRow}>
                            <div>
                                <h3>Auto-Save</h3>
                                <p>Automatically save form data</p>
                            </div>
                            <button
                                className={`${styles.toggle} ${settings.autoSave ? styles.toggleOn : ''}`}
                                onClick={() => toggleSetting('autoSave')}
                                role="switch"
                                aria-checked={settings.autoSave}
                                aria-label="Toggle auto-save"
                            >
                                <span className={styles.toggleKnob}></span>
                            </button>
                        </div>
                    </div>

                    <div className="section">
                        <h2><FAIcon icon={faPalette} /> Appearance</h2>
                        <div className={styles.toggleRow}>
                            <div>
                                <h3>Dark Mode</h3>
                                <p>Use dark color scheme</p>
                            </div>
                            <button
                                className={`${styles.toggle} ${settings.darkMode ? styles.toggleOn : ''}`}
                                onClick={() => toggleSetting('darkMode')}
                                role="switch"
                                aria-checked={settings.darkMode}
                                aria-label="Toggle dark mode"
                            >
                                <span className={styles.toggleKnob}></span>
                            </button>
                        </div>
                        <div className={styles.formGroup}>
                            <label><FAIcon icon={faGlobe} /> Language</label>
                            <select value={settings.language} onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))} style={{ background: '#161b2a', color: '#fff' }} aria-label="Language">
                                <option value="en" style={{ background: '#121826' }}>English</option>
                                <option value="es" style={{ background: '#121826' }}>Español</option>
                                <option value="fr" style={{ background: '#121826' }}>Français</option>
                                <option value="hi" style={{ background: '#121826' }}>हिन्दी</option>
                            </select>
                        </div>
                    </div>

                    <div className="section">
                        <h2><FAIcon icon={faShieldAlt} /> Security</h2>
                        <div className={styles.formGroup}>
                            <label><FAIcon icon={faLock} /> Change Password</label>
                            <input type="password" placeholder="Current password" aria-label="Current password" />
                        </div>
                        <div className={styles.formGroup}>
                            <input type="password" placeholder="New password" aria-label="New password" />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Data Retention</label>
                            <select value={settings.dataRetention} onChange={(e) => setSettings(prev => ({ ...prev, dataRetention: e.target.value }))} style={{ background: '#161b2a', color: '#fff' }} aria-label="Data retention period">
                                <option value="30" style={{ background: '#121826' }}>30 days</option>
                                <option value="60" style={{ background: '#121826' }}>60 days</option>
                                <option value="90" style={{ background: '#121826' }}>90 days</option>
                                <option value="180" style={{ background: '#121826' }}>180 days</option>
                                <option value="365" style={{ background: '#121826' }}>1 year</option>
                            </select>
                        </div>
                    </div>

                    <div className="section">
                        <h2><FAIcon icon={faKeyboard} /> Shortcuts</h2>
                        <div className={styles.shortcutList}>
                            {[
                                ['Ctrl + K', 'Search'],
                                ['Ctrl + N', 'New Case'],
                                ['Ctrl + D', 'Dashboard'],
                                ['Ctrl + /', 'Show Shortcuts'],
                                ['Escape', 'Close Menus'],
                            ].map(([key, desc]) => (
                                <div key={key} className={styles.shortcutItem}>
                                    <span>{desc}</span>
                                    <kbd>{key}</kbd>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={handleSave} aria-label="Save settings">
                        <FAIcon icon={faSave} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
