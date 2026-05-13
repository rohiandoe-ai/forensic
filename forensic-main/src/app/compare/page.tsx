'use client';

import { useState } from 'react';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import { faBalanceScale, faSearch, faTimes, faCheckCircle, faExclamationTriangle, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

const casesDB = [
    { id: 'CS-2024-001', title: 'Downtown Burglary', status: 'Active', location: '450 West St', date: 'Jan 15, 2024', evidenceCount: 14, suspects: 2, matches: ['CS-2023-089'] },
    { id: 'CS-2024-002', title: 'Vehicle Theft Ring', status: 'Pending', location: 'North District', date: 'Jan 18, 2024', evidenceCount: 8, suspects: 5, matches: [] },
    { id: 'CS-2023-089', title: 'Jewelry Store Break-in', status: 'Closed', location: '120 East Ave', date: 'Dec 05, 2023', evidenceCount: 22, suspects: 1, matches: ['CS-2024-001'] },
];

export default function ComparePage() {
    const [selectedCases, setSelectedCases] = useState<string[]>(['CS-2024-001', 'CS-2023-089']);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleCase = (id: string) => {
        if (selectedCases.includes(id)) {
            setSelectedCases(selectedCases.filter(c => c !== id));
        } else {
            if (selectedCases.length < 3) setSelectedCases([...selectedCases, id]);
        }
    };

    const displayCases = selectedCases.map(id => casesDB.find(c => c.id === id)).filter(Boolean);

    return (
        <PageLoader type="dashboard">
        <div className={styles.comparePage}>
            <div className={styles.header}>
                <div>
                    <h1><FAIcon icon={faBalanceScale} /> Case Comparison</h1>
                    <p>Analyze up to 3 cases side-by-side for similarities and patterns.</p>
                </div>
            </div>

            <div className={styles.selectorSection}>
                <div className={styles.searchBar}>
                    <FAIcon icon={faSearch} />
                    <input 
                        type="text" 
                        placeholder="Search cases to add..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.caseChips}>
                    {casesDB.map(c => (
                        <button 
                            key={c.id} 
                            className={`${styles.chip} ${selectedCases.includes(c.id) ? styles.chipActive : ''}`}
                            onClick={() => toggleCase(c.id)}
                        >
                            {selectedCases.includes(c.id) ? <FAIcon icon={faTimes} /> : <FAIcon icon={faCheckCircle} />}
                            {c.id}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.comparisonGrid}>
                {displayCases.map((c, idx) => (
                    <div key={idx} className={styles.caseColumn}>
                        <div className={styles.colHeader}>
                            <h2>{c?.id}</h2>
                            <button onClick={() => toggleCase(c!.id)}><FAIcon icon={faTimes} /></button>
                        </div>
                        <div className={styles.colBody}>
                            <h3 className={styles.caseTitle}>{c?.title}</h3>
                            
                            <div className={styles.dataRow}>
                                <span>Status</span>
                                <span className={styles.statusBadge}>{c?.status}</span>
                            </div>
                            
                            <div className={styles.dataRow}>
                                <span><FAIcon icon={faMapMarkerAlt} /> Location</span>
                                <strong>{c?.location}</strong>
                            </div>
                            
                            <div className={styles.dataRow}>
                                <span><FAIcon icon={faCalendarAlt} /> Date</span>
                                <strong>{c?.date}</strong>
                            </div>
                            
                            <div className={styles.dataRow}>
                                <span>Evidence Items</span>
                                <strong>{c?.evidenceCount}</strong>
                            </div>

                            <div className={styles.dataRow}>
                                <span>Suspects</span>
                                <strong>{c?.suspects}</strong>
                            </div>

                            <div className={styles.matchSection}>
                                <h4>AI Match Analysis</h4>
                                {c?.matches.length ? (
                                    <div className={styles.matchAlert}>
                                        <FAIcon icon={faExclamationTriangle} /> 
                                        High correlation with {c.matches.join(', ')}
                                    </div>
                                ) : (
                                    <div className={styles.noMatch}>No significant correlations found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {selectedCases.length === 0 && (
                    <div className={styles.emptyState}>
                        <FAIcon icon={faBalanceScale} style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '15px' }} />
                        <h3>No cases selected</h3>
                        <p>Select cases from the list above to begin comparison.</p>
                    </div>
                )}
            </div>
        </div>
        </PageLoader>
    );
}
