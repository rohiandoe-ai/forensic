'use client';

import { useState } from 'react';
import styles from './Tabs.module.css';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
    const [active, setActive] = useState(defaultTab || tabs[0]?.id);

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabList} role="tablist">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${active === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActive(tab.id)}
                        role="tab"
                        aria-selected={active === tab.id}
                        aria-controls={`panel-${tab.id}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    id={`panel-${tab.id}`}
                    className={`${styles.panel} ${active === tab.id ? styles.activePanel : ''}`}
                    role="tabpanel"
                    aria-labelledby={tab.id}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
}
