'use client';

import dynamic from 'next/dynamic';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import CrimeTimeline from '@/components/CrimeTimeline';
import {
    faVrCardboard, faCube, faLayerGroup, faExpand,
    faCompress, faClock,
} from '@fortawesome/free-solid-svg-icons';
import { forensicService } from '@/lib/services/forensic';
import { useState, useMemo, useEffect } from 'react';
import styles from './page.module.css';

type EvidenceRow = Awaited<ReturnType<typeof forensicService.getEvidence>>[number];

const CrimeScene3D = dynamic(() => import('@/components/CrimeScene3D'), { ssr: false });

export default function VisualizationPage() {
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

    const currentCaseItems = useMemo(() => {
        return evidenceItems.filter((e) => e.caseRef === effectiveCase);
    }, [evidenceItems, effectiveCase]);

    const activeCaseType = useMemo(() => {
        const item = currentCaseItems[0];
        return item?.tags?.[0] || 'Burglary';
    }, [currentCaseItems]);

    return (
        <PageLoader type="visualization">
        <div className={styles.visualization} role="main" aria-label="Visualization page">
            <div className="container">
                <h1>3D Visualization</h1>
                <p>Immersive crime scene reconstruction and evidence mapping</p>

                <div className={styles.visualizationControls}>
                    <div className={styles.controlPanel}>
                        <div className={styles.controlGroup}>
                            <label>Select Case</label>
                            <select
                                value={effectiveCase}
                                onChange={(e) => setSelectedCase(e.target.value)}
                                aria-label="Select case"
                            >
                                {uniqueCases.length === 0 ? (
                                    <option value="">No cases — add evidence first</option>
                                ) : (
                                    uniqueCases.map((caseRef) => (
                                        <option key={caseRef} value={caseRef}>
                                            {caseRef}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className={styles.controlGroup}>
                            <label>View Mode</label>
                            <div className={styles.viewButtons}>
                                <button className="btn btn-sm btn-outline active">3D</button>
                                <button className="btn btn-sm btn-outline">Top</button>
                                <button className="btn btn-sm btn-outline">Side</button>
                            </div>
                        </div>
                        <div className={styles.controlGroup}>
                            <label>Layers</label>
                            <div className={styles.layerControls}>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" defaultChecked /> Evidence Markers
                                </label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" defaultChecked /> Trajectory Lines
                                </label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" defaultChecked /> Room Outline
                                </label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" /> Person Markers
                                </label>
                            </div>
                        </div>
                        <div className={styles.controlActions}>
                            <button className="btn btn-sm btn-outline"><FAIcon icon={faExpand} /> Fullscreen</button>
                            <button className="btn btn-sm btn-outline"><FAIcon icon={faCompress} /> Reset</button>
                        </div>
                    </div>

                    <div className={styles.visualizationPreview}>
                        <CrimeScene3D caseType={activeCaseType} />
                    </div>
                </div>

                <div className={styles.sceneInfo}>
                    <div className={styles.infoCard}>
                        <h3>Scene Information</h3>
                        <div className={styles.infoDetails}>
                            <p><strong>Case:</strong> {String(effectiveCase || '')}</p>
                            <p><strong>Location:</strong> 123 Main St, Downtown</p>
                            <p><strong>Dimensions:</strong> 12m x 8m x 3m</p>
                            <p><strong>Evidence Items:</strong> {currentCaseItems.length} markers placed</p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <h3>VR Capabilities</h3>
                        <div className={styles.vrCapabilities}>
                            <div className={styles.vrCard}>
                                <div className={styles.vrIcon}><FAIcon icon={faVrCardboard} /></div>
                                <h4>VR Walkthrough</h4>
                                <p>Immersive first-person navigation</p>
                            </div>
                            <div className={styles.vrCard}>
                                <div className={styles.vrIcon}><FAIcon icon={faCube} /></div>
                                <h4>3D Rotate</h4>
                                <p>Full 360° scene rotation</p>
                            </div>
                            <div className={styles.vrCard}>
                                <div className={styles.vrIcon}><FAIcon icon={faLayerGroup} /></div>
                                <h4>Layer Toggle</h4>
                                <p>Toggle evidence layers on/off</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2><FAIcon icon={faClock} /> Crime Event Timeline</h2>
                    <CrimeTimeline />
                </div>
            </div>
        </div>
        </PageLoader>
    );
}
