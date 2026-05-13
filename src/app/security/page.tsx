'use client';

import { useState } from 'react';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import Tabs from '@/components/Tabs';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import toast from 'react-hot-toast';
import {
    faShieldAlt, faLock, faKey, faCertificate, faCheckCircle,
    faExclamationTriangle, faInfoCircle, faGraduationCap,
    faBalanceScale, faUserShield, faClock, faFileAlt, faLink, faDatabase, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

const securityStats = [
    { icon: faLock, title: 'Encryption Level', desc: 'AES-256 encryption for all data' },
    { icon: faKey, title: 'Active Sessions', desc: '5 authenticated sessions' },
    { icon: faCertificate, title: 'Certificates', desc: 'All security certificates valid' },
    { icon: faShieldAlt, title: 'Threat Level', desc: 'No active threats detected' },
];

const principles = [
    { icon: faBalanceScale, title: 'Legal Compliance', desc: 'All AI analysis follows legal frameworks and evidence chain of custody requirements. Results are admissible in court.' },
    { icon: faUserShield, title: 'Privacy Protection', desc: 'Personal data is anonymized and protected. Facial recognition data is stored securely with restricted access.' },
    { icon: faCheckCircle, title: 'Transparency', desc: 'All AI decisions are explainable. Analysis reports include confidence scores and methodology documentation.' },
];

const complianceItems = [
    { title: 'GDPR', desc: 'EU Data Protection', status: 'certified', statusText: 'Certified' },
    { title: 'HIPAA', desc: 'Healthcare Privacy', status: 'certified', statusText: 'Certified' },
    { title: 'ISO 27001', desc: 'Information Security', status: 'pending', statusText: 'In Progress' },
    { title: 'FISMA', desc: 'Federal Security', status: 'certified', statusText: 'Certified' },
];

const auditLogs = [
    { icon: faCheckCircle, type: 'success', title: 'User Login', desc: 'Det. Miller authenticated successfully', time: '2 min ago' },
    { icon: faInfoCircle, type: 'info', title: 'Evidence Access', desc: 'View access granted to CS-2024-001 files', time: '15 min ago' },
    { icon: faExclamationTriangle, type: 'warning', title: 'Failed Login Attempt', desc: 'Invalid credentials from IP 192.168.1.45', time: '1 hour ago' },
    { icon: faCheckCircle, type: 'success', title: 'Backup Complete', desc: 'Daily backup completed successfully', time: '4 hours ago' },
];

const trainingItems = [
    { title: 'Evidence Handling Procedures', status: 'completed', statusText: 'Completed', date: 'Jan 10, 2024' },
    { title: 'AI Analysis Best Practices', status: 'pending', statusText: 'Pending', date: 'Feb 15, 2024' },
    { title: 'Security Protocols Update', status: 'upcoming', statusText: 'Upcoming', date: 'Mar 01, 2024' },
];

export default function SecurityPage() {
    const [isVerifying, setIsVerifying] = useState(false);
    const { playSuccess, playClick } = useSoundEffects();

    const verifyLedger = () => {
        playClick();
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            playSuccess();
            toast.success('Blockchain Integrity Verified: 0 anomalies found.');
        }, 3000);
    };

    return (
        <PageLoader type="security">
        <div className={styles.security} role="main" aria-label="Security and ethics page">
            <div className="container">
                <h1>Security & Ethics</h1>
                <p>System security compliance and ethical AI guidelines</p>

                <div className={styles.securityStats}>
                    {securityStats.map((s, i) => (
                        <div key={i} className={styles.securityStat}>
                            <div className={styles.statIcon}><FAIcon icon={s.icon} /></div>
                            <div className={styles.statContent}>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="section">
                    <h2>Ethical AI Principles</h2>
                    <div className={styles.ethicalPrinciples}>
                        {principles.map((p, i) => (
                            <div key={i} className={styles.principle}>
                                <div className={styles.principleIcon}><FAIcon icon={p.icon} /></div>
                                <div className={styles.principleContent}>
                                    <h3>{p.title}</h3>
                                    <p>{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h2>Compliance Status</h2>
                    <div className={styles.complianceGrid}>
                        {complianceItems.map((c, i) => (
                            <div key={i} className={styles.complianceCard}>
                                <h3>{c.title}</h3>
                                <p>{c.desc}</p>
                                <div className={`${styles.complianceStatus} ${styles[c.status]}`}>
                                    <FAIcon icon={c.status === 'certified' ? faCheckCircle : faClock} /> {c.statusText}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <div className="section-header">
                        <h2><FAIcon icon={faDatabase} /> Blockchain Evidence Ledger</h2>
                        <button className={`btn btn-sm ${isVerifying ? 'btn-outline' : 'btn-primary'}`} onClick={verifyLedger} disabled={isVerifying}>
                            <FAIcon icon={isVerifying ? faSpinner : faLink} className={isVerifying ? "fa-spin" : ""} /> {isVerifying ? 'Verifying Nodes...' : 'Verify Ledger Integrity'}
                        </button>
                    </div>
                    <div style={{ background: '#0a0e17', borderRadius: '12px', border: '1px solid rgba(0, 168, 255, 0.2)', padding: '15px', fontFamily: 'monospace', color: '#b0b7c3', fontSize: '0.9rem', overflowX: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 300px 200px', gap: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--primary-blue)', fontWeight: 'bold' }}>
                            <span>Block Hash</span>
                            <span>Action</span>
                            <span>Evidence ID & Data Hash</span>
                            <span>Timestamp</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 300px 200px', gap: '15px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: 'var(--success)' }}>0x7b9f...a12c</span>
                            <span>MINT</span>
                            <span>EV-001 [sha256: 8f4e2...b991]</span>
                            <span>2024-01-15T14:30:12Z</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 300px 200px', gap: '15px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: 'var(--success)' }}>0x8c1a...d44e</span>
                            <span>TRANSFER</span>
                            <span>EV-001 (Tech. Rodriguez)</span>
                            <span>2024-01-15T16:45:00Z</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 300px 200px', gap: '15px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: 'var(--success)' }}>0x9d2b...e55f</span>
                            <span>MINT</span>
                            <span>EV-002 [sha256: 1a2b3...c4d5]</span>
                            <span>2024-01-15T18:20:45Z</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 300px 200px', gap: '15px', padding: '10px 0' }}>
                            <span style={{ color: 'var(--success)' }}>0xa3f9...c88d</span>
                            <span>TRANSFER</span>
                            <span>EV-002 (Officer Chen)</span>
                            <span>2024-01-16T09:15:33Z</span>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="section-header">
                        <h2>Audit Log</h2>
                        <button className="btn btn-sm btn-outline"><FAIcon icon={faFileAlt} /> Export Log</button>
                    </div>
                    <div className={styles.auditLog}>
                        {auditLogs.map((a, i) => (
                            <div key={i} className={styles.auditEntry}>
                                <div className={`${styles.auditIcon} ${styles[a.type]}`}>
                                    <FAIcon icon={a.icon} />
                                </div>
                                <div className={styles.auditContent}>
                                    <h4>{a.title}</h4>
                                    <p>{a.desc}</p>
                                    <span className={styles.auditTime}>{a.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <Tabs
                        defaultTab="training"
                        tabs={[
                            {
                                id: 'training',
                                label: 'Training & Compliance',
                                content: (
                                    <div className={styles.trainingCards}>
                                        {trainingItems.map((t, i) => (
                                            <div key={i} className={styles.trainingCard}>
                                                <h3>{t.title}</h3>
                                                <div className={styles.trainingStatus}>
                                                    <span className={`${styles.statusBadge} ${styles[`statusBadge${t.status.charAt(0).toUpperCase() + t.status.slice(1)}`]}`}>
                                                        {t.statusText}
                                                    </span>
                                                    <span className={styles.trainingDate}>{t.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                id: 'principles',
                                label: 'Ethical Principles',
                                content: (
                                    <div className={styles.principlesGrid}>
                                        {principles.map((p, i) => (
                                            <div key={i} className={styles.principleCard}>
                                                <div className={styles.principleIcon}><FAIcon icon={p.icon} /></div>
                                                <h3>{p.title}</h3>
                                                <p>{p.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
