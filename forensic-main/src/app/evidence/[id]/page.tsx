'use client';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import ImageViewer from '@/components/ImageViewer';
import {
    faCalendarAlt, faMapMarkerAlt, faUser,
    faCamera, faVideo, faFileImage,
    faDownload,
    faShareAlt, faShieldAlt,
    faArrowLeft, faBrain, faVrCardboard,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

interface CaseEvidenceItem {
    id: string;
    title: string;
    type: string;
    status: string;
    icon: IconDefinition;
}

interface AiResultRow {
    type: string;
    confidence: number;
    result: string;
}

interface TimelineRow {
    time: string;
    event: string;
    type: string;
}

interface CaseDetail {
    id: string;
    title: string;
    status: string;
    statusText: string;
    date: string;
    location: string;
    priority: string;
    investigator: string;
    description: string;
    evidence: CaseEvidenceItem[];
    aiResults: AiResultRow[];
    timeline: TimelineRow[];
}

const caseData: Record<string, CaseDetail> = {
    'CS-2024-001': {
        id: 'CS-2024-001',
        title: 'Downtown Burglary',
        status: 'active',
        statusText: 'Active',
        date: 'Jan 15, 2024',
        location: '123 Main St, Downtown',
        priority: 'High',
        investigator: 'Lead Investigator',
        description: 'Forced entry through back door of residential property. Multiple evidence items recovered including tool marks, fingerprints, and footprints. AI analysis suggests pattern matching with previous cases in the area.',
        evidence: [
            { id: 'EV-001', title: 'Crime Scene Photo - Entry Point', type: 'Image', status: 'Analyzed', icon: faCamera },
            { id: 'EV-002', title: 'Surveillance Video Clip', type: 'Video', status: 'Processing', icon: faVideo },
            { id: 'EV-003', title: 'Forensic Report - Blood Analysis', type: 'Document', status: 'Analyzed', icon: faFileImage },
        ],
        aiResults: [
            { type: 'Pattern Recognition', confidence: 94, result: 'Matches 2 previous cases in same area' },
            { type: 'Trajectory Analysis', confidence: 89, result: 'Entry from rear, exit through side window' },
            { type: 'Facial Recognition', confidence: 78, result: 'Partial match - suspect identified' },
        ],
        timeline: [
            { time: '22:30', event: 'Alarm triggered at 123 Main St', type: 'alert' },
            { time: '22:35', event: 'First responder arrived on scene', type: 'response' },
            { time: '22:50', event: 'Crime scene secured and photos taken', type: 'evidence' },
            { time: '23:15', event: 'Forensic team began analysis', type: 'analysis' },
            { time: '23:45', event: 'AI pattern analysis initiated', type: 'ai' },
        ],
    },
    'CS-2024-002': {
        id: 'CS-2024-002',
        title: 'Vehicle Theft',
        status: 'underReview',
        statusText: 'Under Review',
        date: 'Jan 12, 2024',
        location: '456 Oak Ave',
        priority: 'Medium',
        investigator: 'Officer John Chen',
        description: 'Vehicle stolen from residential driveway. Fingerprint evidence recovered from door handle. GPS tracking data being analyzed.',
        evidence: [
            { id: 'EV-004', title: 'Fingerprint Analysis Report', type: 'Document', status: 'Analyzed', icon: faFileImage },
        ],
        aiResults: [
            { type: 'Fingerprint Match', confidence: 91, result: '3 matches found in AFIS database' },
        ],
        timeline: [
            { time: '06:00', event: 'Vehicle reported stolen', type: 'alert' },
            { time: '06:30', event: 'Evidence collection at scene', type: 'evidence' },
            { time: '08:00', event: 'AFIS search initiated', type: 'ai' },
        ],
    },
};

export default function CaseDetailPage() {
    const params = useParams();
    const caseId = params.id as string;
    const caseInfo = caseData[caseId];

    if (!caseInfo) {
        return (
            <div className={styles.notFound}>
                <FAIcon icon={faExclamationTriangle} style={{ fontSize: '3rem', color: 'var(--warning)', marginBottom: '20px' }} />
                <h2>Case Not Found</h2>
                <p>The case {caseId} does not exist in the system.</p>
                <Link href="/evidence" className="btn btn-primary" style={{ marginTop: '20px' }}>
                    <FAIcon icon={faArrowLeft} /> Back to Evidence
                </Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        active: '#ff5252',
        underReview: '#ff9800',
        closed: '#00e676',
    };

    return (
        <PageLoader type="evidence">
        <div className={styles.caseDetail} role="main" aria-label={`Case ${caseId} details`}>
            <div className="container">
                <Link href="/evidence" className={styles.backLink}>
                    <FAIcon icon={faArrowLeft} /> Back to Evidence
                </Link>

                <div className={styles.caseHeader}>
                    <div>
                        <h1>{caseInfo.title}</h1>
                        <div className={styles.caseMeta}>
                            <span style={{ color: statusColors[caseInfo.status] || '#b0b7c3' }}>
                                ● {caseInfo.statusText}
                            </span>
                            <span><FAIcon icon={faCalendarAlt} /> {caseInfo.date}</span>
                            <span><FAIcon icon={faMapMarkerAlt} /> {caseInfo.location}</span>
                            <span><FAIcon icon={faUser} /> {caseInfo.investigator}</span>
                        </div>
                    </div>
                    <div className={styles.caseActions}>
                        <button className="btn btn-sm btn-outline"><FAIcon icon={faShareAlt} /> Share</button>
                        <button className="btn btn-sm btn-outline"><FAIcon icon={faDownload} /> Export</button>
                        <button className="btn btn-sm btn-primary"><FAIcon icon={faBrain} /> Run AI Analysis</button>
                    </div>
                </div>

                <div className={styles.caseContent}>
                    <div className={styles.mainColumn}>
                        <div className="section">
                            <h2>Case Description</h2>
                            <p>{caseInfo.description}</p>
                        </div>

                        <div className="section">
                            <div className="section-header">
                                <h2>Evidence Items</h2>
                                <span className={styles.count}>{caseInfo.evidence.length} items</span>
                            </div>
                            <div className={styles.evidenceList}>
                                {caseInfo.evidence.map((ev, i: number) => (
                                    <div key={i} className={styles.evidenceItem}>
                                        <div className={styles.evIcon}><FAIcon icon={ev.icon} /></div>
                                        <div className={styles.evInfo}>
                                            <h4>{ev.id}: {ev.title}</h4>
                                            <span className={styles.evType}>{ev.type}</span>
                                        </div>
                                        <span className={`${styles.evStatus} ${styles['status' + ev.status] || ''}`}>{ev.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section">
                            <h2>Crime Scene Images</h2>
                            <div className={styles.imageGrid}>
                                <ImageViewer src="https://images.unsplash.com/photo-1581092160607-ee22621a6a64?w=400&h=300&fit=crop" alt="Crime scene entry point" />
                                <ImageViewer src="https://images.unsplash.com/photo-1504384308090-c894fdcc168e?w=400&h=300&fit=crop" alt="Evidence close-up" />
                            </div>
                        </div>

                        <div className="section">
                            <h2>AI Analysis Results</h2>
                            <div className={styles.aiResults}>
                                {caseInfo.aiResults.map((r, i: number) => (
                                    <div key={i} className={styles.aiResult}>
                                        <div className={styles.aiHeader}>
                                            <FAIcon icon={faBrain} style={{ color: 'var(--primary-blue)' }} />
                                            <h4>{r.type}</h4>
                                            <span className={styles.confidence}>{r.confidence}% confidence</span>
                                        </div>
                                        <p>{r.result}</p>
                                        <div className={styles.confidenceBar}>
                                            <div className={styles.confidenceFill} style={{ width: `${r.confidence}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.sideColumn}>
                        <div className="section">
                            <h2>Timeline</h2>
                            <div className={styles.timeline}>
                                {caseInfo.timeline.map((t, i: number) => (
                                    <div key={i} className={styles.timelineItem}>
                                        <div className={`${styles.timelineDot} ${styles[t.type]}`}></div>
                                        <div className={styles.timelineContent}>
                                            <span className={styles.timelineTime}>{t.time}</span>
                                            <p>{t.event}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section">
                            <h2>Quick Actions</h2>
                            <div className={styles.quickActions}>
                                <Link href="/visualization" className={styles.actionBtn}>
                                    <FAIcon icon={faVrCardboard} /> 3D View
                                </Link>
                                <Link href="/reconstruction" className={styles.actionBtn}>
                                    <FAIcon icon={faBrain} /> AI Analysis
                                </Link>
                                <Link href="/collaboration" className={styles.actionBtn}>
                                    <FAIcon icon={faUser} /> Team Chat
                                </Link>
                                <Link href="/upload" className={styles.actionBtn}>
                                    <FAIcon icon={faCamera} /> Add Evidence
                                </Link>
                            </div>
                        </div>

                        <div className="section">
                            <div className={styles.securityInfo}>
                                <FAIcon icon={faShieldAlt} style={{ color: 'var(--success)' }} />
                                <span>All data encrypted & verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
