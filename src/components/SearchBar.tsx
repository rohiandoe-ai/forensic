'use client';

import { useState } from 'react';
import FAIcon from './FontAwesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBar.module.css';

const searchData = [
    { type: 'Case', title: 'CS-2024-001', desc: 'Downtown Burglary' },
];

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const filtered = query.length > 0
        ? searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.desc.toLowerCase().includes(query.toLowerCase()) ||
            item.type.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <div className={styles.searchContainer}>
            <FAIcon icon={faSearch} className={styles.searchIcon} />
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search cases, evidence, reports..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
            {showResults && filtered.length > 0 && (
                <div className={styles.searchResults}>
                    {filtered.map((item, i) => (
                        <div key={i} className={styles.searchResultItem}>
                            <span className={styles.resultType}>{item.type}</span>
                            <div>
                                <div className={styles.resultTitle}>{item.title}</div>
                                <div className={styles.resultDesc}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
