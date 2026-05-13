'use client';

import FAIcon from './FontAwesome';
import { faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const schedule = [
    { date: '15 Jan', time: '09:00', event: 'Crime Scene Investigation', location: 'Downtown', type: 'investigation' },
    { date: '16 Jan', time: '14:30', event: 'Evidence Lab Transfer', location: 'Forensics HQ', type: 'transfer' },
    { date: '18 Jan', time: '10:00', event: 'Suspect Interrogation', location: 'Precinct 4', type: 'interrogation' },
    { date: '20 Jan', time: '08:00', event: 'Court Hearing - Preliminary', location: 'City Courthouse', type: 'court' },
];

export default function CaseCalendar() {
    return (
        <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px', marginTop: '20px' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FAIcon icon={faCalendarAlt} style={{ color: 'var(--primary-blue)' }} /> Investigation Schedule
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {schedule.map((item, idx) => (
                    <div key={idx} style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        padding: '12px', 
                        background: 'rgba(255,255,255,0.02)', 
                        borderRadius: '8px',
                        borderLeft: `3px solid ${item.type === 'court' ? '#ff5252' : item.type === 'interrogation' ? '#ff9800' : 'var(--primary-blue)'}`
                    }}>
                        <div style={{ 
                            minWidth: '60px', 
                            textAlign: 'center', 
                            borderRight: '1px solid var(--border-color)', 
                            paddingRight: '15px' 
                        }}>
                            <div style={{ color: 'var(--primary-blue)', fontWeight: 'bold' }}>{item.date}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.time}</div>
                        </div>
                        
                        <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '5px' }}>{item.event}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <FAIcon icon={faMapMarkerAlt} /> {item.location}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
