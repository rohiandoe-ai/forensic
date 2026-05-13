'use client';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import FAIcon from './FontAwesome';
import { faClock, faUser, faCamera, faSearch, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './CrimeTimeline.module.css';

interface TimelineEvent {
    time: string;
    title: string;
    description: string;
    type: 'alert' | 'response' | 'evidence' | 'analysis' | 'conclusion';
    icon?: IconProp;
}

const events: TimelineEvent[] = [
    { time: '22:30', title: 'Alarm Triggered', description: 'Motion sensor activated at rear entrance', type: 'alert', icon: faClock },
    { time: '22:35', title: 'First Response', description: 'Officer Davis arrived on scene', type: 'response', icon: faUser },
    { time: '22:45', title: 'Scene Secured', description: 'Perimeter established, photos taken', type: 'evidence', icon: faCamera },
    { time: '23:00', title: 'Forensic Team', description: 'Evidence collection began', type: 'analysis', icon: faSearch },
    { time: '23:30', title: 'Initial Report', description: 'Preliminary findings documented', type: 'conclusion', icon: faCheckCircle },
];

export default function CrimeTimeline() {
    const [selected, setSelected] = useState(0);

    const typeColors: Record<string, string> = {
        alert: '#ff5252',
        response: '#00a8ff',
        evidence: '#ff9800',
        analysis: '#00e676',
        conclusion: '#aa00ff',
    };

    return (
        <div className={styles.timeline} role="region" aria-label="Crime event timeline">
            <div className={styles.track}>
                {events.map((ev, i) => (
                    <button
                        key={i}
                        className={`${styles.node} ${selected === i ? styles.activeNode : ''}`}
                        onClick={() => setSelected(i)}
                        style={
                            {
                                ['--node-color' as string]: typeColors[ev.type],
                            } as CSSProperties
                        }
                        aria-label={`${ev.time} - ${ev.title}`}
                        aria-pressed={selected === i}
                    >
                        <span className={styles.nodeDot}></span>
                        <span className={styles.nodeTime}>{ev.time}</span>
                    </button>
                ))}
            </div>
            <div className={styles.detail}>
                <div className={styles.detailHeader}>
                    <div className={styles.detailIcon} style={{ color: typeColors[events[selected].type] }}>
                        <FAIcon icon={events[selected].icon || faClock} />
                    </div>
                    <div>
                        <h4>{events[selected].title}</h4>
                        <span className={styles.detailTime}>{events[selected].time}</span>
                    </div>
                </div>
                <p>{events[selected].description}</p>
            </div>
        </div>
    );
}
