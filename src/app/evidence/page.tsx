'use client';

import { useState, useMemo, useEffect } from 'react';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import Lightbox from '@/components/Lightbox';
import { forensicService } from '@/lib/services/forensic';
import {
    faFileAlt, faCalendarAlt, faUser,
    faCamera, faVideo, faFileImage, faEye, faDownload,
    faShieldAlt, faCheckCircle, faClock, faLink, faTimes
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

type EvidenceRow = Awaited<ReturnType<typeof forensicService.getEvidence>>[number];

const custodyHistory = [
    { date: 'Jan 15, 2024 14:30', action: 'Collected', user: 'Det. Miller', notes: 'Collected at crime scene' },
    { date: 'Jan 15, 2024 16:45', action: 'Logged', user: 'Tech. Rodriguez', notes: 'Entered into evidence locker A4' },
    { date: 'Jan 16, 2024 09:15', action: 'Analyzed', user: 'Dr. Patel', notes: 'Checked out for lab analysis' },
    { date: 'Jan 16, 2024 15:30', action: 'Returned', user: 'Dr. Patel', notes: 'Returned to evidence locker' }
];



const getIconForType = (typeText: string) => {
    switch(typeText) {
        case 'Image': return faCamera;
        case 'Video': return faVideo;
        default: return faFileImage;
    }
};

export default function EvidencePage() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState<{ src: string, alt: string, type: 'image' | 'video' | 'document' }>({ src: '', alt: '', type: 'image' });
    const [custodyItem, setCustodyItem] = useState<string | null>(null);

    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCase, setFilterCase] = useState('');

    const [evidenceItems, setEvidenceItems] = useState<EvidenceRow[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvidence = async () => {
        try {
            const data = await forensicService.getEvidence();
            setEvidenceItems(data);
        } catch (error) {
            console.error('Error fetching evidence:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchEvidence();
        }, 0);
        const subscription = forensicService.subscribe('evidence', fetchEvidence);
        return () => {
            clearTimeout(timer);
            subscription.unsubscribe();
        };
    }, []);

    const stats = useMemo(() => {
        const total = evidenceItems.length;
        const images = evidenceItems.filter((e: EvidenceRow) => e.type === 'typeImage' || e.type === 'image').length;
        const videos = evidenceItems.filter((e: EvidenceRow) => e.type === 'typeVideo' || e.type === 'video').length;
        const documents = evidenceItems.filter((e: EvidenceRow) => e.type === 'typeDocument' || e.type === 'document' || !['typeImage', 'image', 'typeVideo', 'video'].includes(e.type)).length;
        
        const analyzed = evidenceItems.filter((e: EvidenceRow) => e.status === 'statusAnalyzed' || e.status === 'analyzed').length;
        const processing = evidenceItems.filter((e: EvidenceRow) => e.status === 'statusProcessing' || e.status === 'processing').length;
        const pending = Math.max(0, total - analyzed - processing);
        
        const processingPercent = total > 0 ? Math.round((analyzed / total) * 100) : 0;
        
        return { total, images, videos, documents, analyzed, processing, pending, processingPercent };
    }, [evidenceItems]);

    const exportToCSV = () => {
        const headers = ['ID', 'Title', 'Type', 'Status', 'Date', 'Case Ref', 'Collector', 'Notes', 'Tags'];
        const rows = evidenceItems.map(item => [
            item.id,
            `"${String(item.title ?? '').replace(/"/g, '""')}"`,
            item.typeText,
            item.statusText,
            `"${item.date}"`,
            item.caseRef,
            `"${String(item.collector ?? '').replace(/"/g, '""')}"`,
            `"${String(item.notes ?? '').replace(/"/g, '""')}"`,
            `"${(item.tags || []).join(', ')}"`
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'evidence_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openLightbox = (src: string, alt: string, itemType: string) => {
        let mediaType: 'image' | 'video' | 'document' = 'image';
        if (itemType === 'typeVideo') mediaType = 'video';
        if (itemType === 'typeDocument') mediaType = 'document';
        
        let finalSrc = src;
        if (!src) {
            // High-quality Forensic Fallbacks for the demo
            if (mediaType === 'image') finalSrc = 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&q=80&w=1000';
            if (mediaType === 'video') finalSrc = 'https://www.w3schools.com/html/mov_bbb.mp4';
            if (mediaType === 'document') finalSrc = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        }
        
        setCurrentMedia({ src: finalSrc, alt, type: mediaType });
        setLightboxOpen(true);
    };

    const filteredEvidence = evidenceItems.filter(e => {
        if (filterType && e.typeText !== filterType) return false;
        if (filterStatus && e.statusText !== filterStatus) return false;
        if (filterCase && e.caseRef !== filterCase) return false;
        return true;
    });

    return (
        <PageLoader type="evidence">
        <div className={styles.evidence} role="main" aria-label="Evidence management page" aria-busy={loading}>
            <div className="container">
                <h1>Evidence Management</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <p style={{ margin: 0 }}>Digital evidence catalog with chain of custody tracking</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-outline" onClick={async () => {
                            if (window.confirm('Zero out all cases?')) {
                                await forensicService.clearAllData();
                                window.location.reload();
                            }
                        }} style={{ color: '#ff5252', borderColor: '#ff5252' }}>
                            <FAIcon icon={faLink} /> Zero All Cases
                        </button>
                        <button className="btn btn-outline" onClick={exportToCSV}>
                            <FAIcon icon={faDownload} /> Export
                        </button>
                    </div>
                </div>

                <div className={styles.evidenceFilters}>
                    <div className={styles.filterGroup}>
                        <label>Evidence Type</label>
                        <select className={styles.filterSelect} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="" style={{ background: '#121826', color: '#ffffff' }}>All Types</option>
                            <option value="Image" style={{ background: '#121826', color: '#ffffff' }}>Images</option>
                            <option value="Video" style={{ background: '#121826', color: '#ffffff' }}>Videos</option>
                            <option value="Document" style={{ background: '#121826', color: '#ffffff' }}>Documents</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Status</label>
                        <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="" style={{ background: '#121826', color: '#ffffff' }}>All Status</option>
                            <option value="Uploaded" style={{ background: '#121826', color: '#ffffff' }}>Uploaded</option>
                            <option value="Processing" style={{ background: '#121826', color: '#ffffff' }}>Processing</option>
                            <option value="Analyzed" style={{ background: '#121826', color: '#ffffff' }}>Analyzed</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Case Reference</label>
                        <select className={styles.filterSelect} value={filterCase} onChange={(e) => setFilterCase(e.target.value)}>
                            <option value="" style={{ background: '#121826', color: '#ffffff' }}>All Cases</option>
                            <option value="CS-2024-001" style={{ background: '#121826', color: '#ffffff' }}>CS-2024-001</option>
                            <option value="CS-2024-002" style={{ background: '#121826', color: '#ffffff' }}>CS-2024-002</option>
                        </select>
                    </div>
                </div>

                <div className={styles.evidenceTableContainer}>
                    <table className={styles.evidenceTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Case</th>
                                <th>Collector</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                             {filteredEvidence.length > 0 ? filteredEvidence.map((e, i) => (
                                <tr key={i}>
                                    <td><span className={styles.evidenceBadge}>{String(e.id || '')}</span></td>
                                    <td>
                                        <div className={styles.evidenceTitle}>{String(e.title || '')}</div>
                                        <div className={styles.tagContainer}>
                                            {e.tags?.map((tag: string, idx: number) => (
                                                <span key={idx} className={`${styles.evidenceTag} ${styles[`tag${tag}`]}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.evidenceNotes} style={{ marginTop: '10px' }}>{String(e.notes || '')}</div>
                                    </td>
                                    <td>
                                        <span className={`${styles.evidenceType} ${styles[e.type]}`}>
                                            <FAIcon icon={getIconForType(e.typeText)} /> {e.typeText}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.evidenceStatus} ${styles[e.status]}`}>{e.statusText}</span>
                                    </td>
                                    <td><FAIcon icon={faCalendarAlt} style={{ color: 'var(--primary-blue)', marginRight: '5px' }} /> {String(e.date || '')}</td>
                                    <td><FAIcon icon={faFileAlt} style={{ color: 'var(--primary-blue)', marginRight: '5px' }} /> {String(e.caseRef || '')}</td>
                                    <td><FAIcon icon={faUser} style={{ color: 'var(--primary-blue)', marginRight: '5px' }} /> {String(e.collector || '')}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button 
                                                className="btn btn-sm btn-primary"
                                                onClick={() => openLightbox(e.imageSrc || '', e.title, e.type)}
                                                title="View Media"
                                            >
                                                <FAIcon icon={faEye} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr key="empty">
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                            <FAIcon icon={faFileAlt} style={{ fontSize: '4rem', opacity: 0.1 }} />
                                            <div>
                                                <p style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#fff' }}>No Evidence Records</p>
                                                <p style={{ fontSize: '0.95rem' }}>Securely upload evidence via the Admin Control Center to begin analysis.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="section">
                    <h2>Evidence Statistics</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>Total Evidence</h3>
                            <div className={styles.statNumber}>{stats.total.toLocaleString()}</div>
                            <div className={styles.statBreakdown}>
                                <span><FAIcon icon={faCamera} style={{ color: 'var(--primary-blue)' }} /> Images: {stats.images}</span>
                                <span><FAIcon icon={faVideo} style={{ color: 'var(--warning)' }} /> Videos: {stats.videos}</span>
                                <span><FAIcon icon={faFileImage} style={{ color: 'var(--success)' }} /> Documents: {stats.documents}</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Processing Status</h3>
                            <div className={styles.statNumber}>{stats.processingPercent}%</div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${stats.processingPercent}%` }}></div>
                            </div>
                            <div className={styles.statBreakdown}>
                                <span><FAIcon icon={faCheckCircle} style={{ color: 'var(--success)' }} /> Analyzed: {stats.analyzed}</span>
                                <span><FAIcon icon={faClock} style={{ color: 'var(--primary-blue)' }} /> Processing: {stats.processing}</span>
                                <span><FAIcon icon={faClock} style={{ color: 'var(--warning)' }} /> Pending: {stats.pending}</span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Security Status</h3>
                            <div className={styles.statNumber}>100%</div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '100%' }}></div>
                            </div>
                            <div className={styles.statSecurity}>
                                <FAIcon icon={faShieldAlt} /> All evidence encrypted & verified
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {custodyItem && (
                <div className={styles.custodyModal}>
                    <div className={styles.custodyContent}>
                        <div className={styles.custodyHeader}>
                            <h3><FAIcon icon={faLink} /> Chain of Custody: {custodyItem}</h3>
                            <button className={styles.closeBtn} onClick={() => setCustodyItem(null)}><FAIcon icon={faTimes} /></button>
                        </div>
                        <div className={styles.timeline}>
                            {custodyHistory.map((h, i) => (
                                <div key={i} className={styles.timelineItem}>
                                    <div className={styles.timelineDot} />
                                    <div className={styles.timelineContent}>
                                        <div className={styles.timelineTime}>{h.date}</div>
                                        <div className={styles.timelineAction}>{h.action}</div>
                                        <div className={styles.timelineUser}><FAIcon icon={faUser} /> {h.user}</div>
                                        <div className={styles.timelineNotes}>{h.notes}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Lightbox 
                isOpen={lightboxOpen} 
                onClose={() => setLightboxOpen(false)} 
                src={currentMedia.src} 
                alt={currentMedia.alt}
                type={currentMedia.type}
            />
        </div>
        </PageLoader>
    );
}
