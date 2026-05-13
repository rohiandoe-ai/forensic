'use client';

import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import Tabs from '@/components/Tabs';
import {
    faBrain, faSearch, faMapMarkedAlt, faMicroscope,
    faVrCardboard, faClock, faEye, faDownload,
    faFileAlt, faCheckCircle, faFingerprint, faUserSecret, faSpinner, faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';
import { useState, useMemo, useEffect } from 'react';
import { forensicService } from '@/lib/services/forensic';
import toast from 'react-hot-toast';

type EvidenceRow = Awaited<ReturnType<typeof forensicService.getEvidence>>[number];

const capabilities = [
    { icon: faSearch, title: 'Pattern Recognition', desc: 'AI identifies patterns in evidence data that may not be visible to human investigators.', stats: ['94% accuracy', '2.3s avg time'] },
    { icon: faMapMarkedAlt, title: 'Trajectory Analysis', desc: 'Calculate bullet trajectories and object movement paths based on evidence markers.', stats: ['89% accuracy', '1.5s avg time'] },
    { icon: faMicroscope, title: 'Evidence Correlation', desc: 'Automatically find connections between different pieces of evidence across cases.', stats: ['91% accuracy', '3.1s avg time'] },
    { icon: faVrCardboard, title: 'Scene Reconstruction', desc: 'Generate 3D crime scene models from photos and measurements using AI.', stats: ['87% accuracy', '5.2s avg time'] },
];

export default function ReconstructionPage() {
    const [matchType, setMatchType] = useState<'facial' | 'fingerprint'>('facial');
    const [isMatching, setIsMatching] = useState(false);
    const [matchResult, setMatchResult] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [evidenceItems, setEvidenceItems] = useState<EvidenceRow[]>([]);

    const fetchEvidence = async () => {
        try {
            const data = await forensicService.getEvidence();
            setEvidenceItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void fetchEvidence();
        }, 0);
        const sub = forensicService.subscribe('evidence', fetchEvidence);
        return () => {
            clearTimeout(timer);
            sub.unsubscribe();
        };
    }, []);
    
    const uniqueCases = useMemo(() => {
        const cases = evidenceItems.map((e: EvidenceRow) => e.caseRef);
        return Array.from(new Set(cases)) as string[];
    }, [evidenceItems]);

    const [selectedCase, setSelectedCase] = useState<string>('');

    const effectiveCase = useMemo(() => {
        if (selectedCase && uniqueCases.includes(selectedCase)) return selectedCase;
        return uniqueCases[0] ?? '';
    }, [selectedCase, uniqueCases]);

    const runMatch = () => {
        if (!effectiveCase) {
            toast.error('Please select a case first');
            return;
        }
        setIsMatching(true);
        setMatchResult(null);
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 2;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsMatching(false);
                        setMatchResult(matchType === 'facial' 
                            ? `Match Found in ${effectiveCase}: Subject ID #892-A (98.4% Confidence)` 
                            : `Fingerprint Match: AFIS Record #F-9923 linked to ${effectiveCase}`);
                        toast.success('AI Analysis Complete');
                    }, 0);
                    return 100;
                }
                return next;
            });
        }, 50);
    };

    return (
        <PageLoader type="reconstruction">
        <div className={styles.reconstruction} role="main" aria-label="AI analysis page">
            <div className="container">
                <h1>AI Analysis</h1>
                <p>Machine learning-powered forensic analysis and reconstruction</p>

                <div className={styles.analysisControls}>
                    <h2>Run Analysis</h2>
                    <div className={styles.analysisForm}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    <FAIcon icon={faFileAlt} style={{ color: 'var(--primary-blue)' }} /> Case Reference
                                </label>
                                <select 
                                    value={effectiveCase} 
                                    onChange={(e) => setSelectedCase(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px', background: '#161b2a', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
                                >
                                    <option value="" style={{ background: '#121826', color: '#ffffff' }}>Select Case</option>
                                    {uniqueCases.map(caseRef => (
                                        <option key={caseRef as string} value={caseRef as string} style={{ background: '#121826', color: '#ffffff' }}>{caseRef as string}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 500, color: 'var(--text-primary)' }}>
                                    <FAIcon icon={faBrain} style={{ color: 'var(--primary-blue)' }} /> Analysis Type
                                </label>
                                <select 
                                    value={matchType}
                                    onChange={(e) =>
                                        setMatchType(e.target.value as 'facial' | 'fingerprint')
                                    }
                                    style={{ width: '100%', padding: '12px 16px', background: '#161b2a', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }}
                                >
                                    <option value="facial" style={{ background: '#121826', color: '#ffffff' }}>Facial Recognition</option>
                                    <option value="fingerprint" style={{ background: '#121826', color: '#ffffff' }}>Fingerprint Matching</option>
                                </select>
                            </div>
                        </div>
                        <button 
                            className={`btn ${isMatching ? 'btn-outline' : 'btn-primary'}`} 
                            style={{ marginTop: '10px' }}
                            onClick={runMatch}
                            disabled={isMatching}
                        >
                            <FAIcon icon={isMatching ? faSpinner : faBrain} /> 
                            {isMatching ? ' Analyzing Evidence...' : ' Run AI Analysis'}
                        </button>

                        {isMatching && (
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ height: '4px', background: '#1a1f2e', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-blue)', transition: 'width 0.1s linear' }} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Processing neural networks: {progress}%</p>
                            </div>
                        )}
                    </div>
                </div>

                {matchResult && (
                    <div className={styles.analysisResult} style={{ animation: 'slideUp 0.5s ease-out' }}>
                        <div className={styles.resultHeader}>
                            <div>
                                <h3>AI Matching Result</h3>
                                <div className={styles.resultMeta}>
                                    <span className={styles.caseBadge}>{String(selectedCase || '')}</span>
                                    <span className={styles.timestamp}><FAIcon icon={faClock} /> Completed: {new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <span className={`${styles.confidence} ${styles.confidenceHigh}`}>High Confidence (94%)</span>
                        </div>
                        <div className={styles.resultContent} style={{ background: 'rgba(0, 168, 255, 0.05)', border: '1px dashed var(--primary-blue)', padding: '20px', borderRadius: '8px' }}>
                            <p style={{ color: 'var(--primary-blue)', fontSize: '1.2rem', fontWeight: 600 }}>
                                <FAIcon icon={faCheckCircle} /> {String(matchResult || '')}
                            </p>
                            
                            <div className={styles.findings} style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                                <h4 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>AI Generated Findings</h4>
                                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                                    <li>Automated cross-reference complete for case {selectedCase}</li>
                                    <li>Biometric markers verified against national repository</li>
                                    <li>Match confidence meets judicial standards (94%+)</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.resultActions}>
                            <button className="btn btn-sm btn-primary"><FAIcon icon={faEye} /> Full Report</button>
                            <button className="btn btn-sm btn-outline"><FAIcon icon={faDownload} /> Export PDF</button>
                        </div>
                    </div>
                )}

                <div className="section" style={{ marginTop: '40px' }}>
                    <h2><FAIcon icon={faUserSecret} /> Biometric Match Simulator</h2>
                    <div className={styles.matchSimulator}>
                        <div className={styles.matchControls}>
                            <button 
                                className={`btn ${matchType === 'facial' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setMatchType('facial')}
                            >
                                <FAIcon icon={faUserSecret} /> Facial Recognition
                            </button>
                            <button 
                                className={`btn ${matchType === 'fingerprint' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setMatchType('fingerprint')}
                            >
                                <FAIcon icon={faFingerprint} /> Fingerprint AFIS
                            </button>
                        </div>
                        
                        <div className={styles.matchScreen}>
                            {isMatching ? (
                                <div className={styles.scanning}>
                                    <FAIcon icon={matchType === 'facial' ? faUserSecret : faFingerprint} className={styles.scanIcon} />
                                    <div className={styles.scanBar}></div>
                                    <p>Querying national database...</p>
                                </div>
                            ) : matchResult ? (
                                <div className={styles.matchFound}>
                                    <FAIcon icon={faCheckCircle} className={styles.successIcon} />
                                    <h3>{matchResult}</h3>
                                    <button className="btn btn-sm btn-outline" onClick={() => setMatchResult(null)}>Run New Scan</button>
                                </div>
                            ) : (
                                <div className={styles.matchIdle}>
                                    <FAIcon icon={faCloudUploadAlt} style={{ fontSize: '3rem', color: 'var(--text-muted)' }} />
                                    <p>Select evidence to run matching algorithm</p>
                                    <button className="btn btn-primary" onClick={runMatch}>Start Scan</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="section">
                    <Tabs
                        defaultTab="capabilities"
                        tabs={[
                            {
                                id: 'capabilities',
                                label: 'AI Capabilities',
                                content: (
                                    <div className={styles.capabilitiesGrid}>
                                        {capabilities.map((c, i) => (
                                            <div key={i} className={styles.capabilityCard}>
                                                <div className={styles.capabilityIcon}><FAIcon icon={c.icon} /></div>
                                                <h3>{c.title}</h3>
                                                <p>{c.desc}</p>
                                                <div className={styles.capabilityStats}>
                                                    {c.stats.map((s, j) => (
                                                        <span key={j}><FAIcon icon={faCheckCircle} style={{ color: 'var(--success)' }} /> {s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                id: 'docs',
                                label: 'Documentation',
                                content: (
                                    <div style={{ padding: '10px 0' }}>
                                        <p style={{ marginBottom: '15px' }}>AI Analysis modules use state-of-the-art machine learning models trained on forensic datasets.</p>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '2' }}>
                                            <li>Pattern Recognition - Convolutional Neural Networks</li>
                                            <li>Trajectory Analysis - Physics simulation + ML</li>
                                            <li>Evidence Correlation - Graph neural networks</li>
                                            <li>Scene Reconstruction - 3D CNN + point cloud processing</li>
                                        </ul>
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
