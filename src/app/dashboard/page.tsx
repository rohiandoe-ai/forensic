'use client';

import FAIcon from '@/components/FontAwesome';
import AnimatedCounter from '@/components/AnimatedCounter';
import CrimeMap from '@/components/CrimeMap';
import CaseCalendar from '@/components/CaseCalendar';
import PageLoader from '@/components/PageLoader';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useLiveStats } from '@/hooks/useRealtimeData';
import { useRecentlyVisited } from '@/hooks/useRecentlyVisited';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    faClipboardList, faFileAlt, faUsers, faBrain,
    faExclamationTriangle, faCalendarAlt, faMapMarkerAlt,
    faCloudUploadAlt, faVrCardboard, faRobot,
    faSearch, faChartBar, faEye, faPlus, faFilePdf, faDownload, faBalanceScale
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const cases: any[] = [];

const activities = [
    { icon: faPlus, title: 'New Case Created', desc: 'Case CS-2024-001 has been created', time: '2 hours ago' },
    { icon: faEye, title: 'Evidence Reviewed', desc: 'Evidence EV-001 reviewed by Det. Miller', time: '4 hours ago' },
    { icon: faChartBar, title: 'AI Analysis Complete', desc: 'Pattern analysis completed for Case CS-2024-002', time: '6 hours ago' },
];

const caseTrendData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [{
        label: 'New Cases',
        data: [12, 19, 15, 22, 18, 25, 24],
        borderColor: '#00a8ff',
        backgroundColor: 'rgba(0, 168, 255, 0.1)',
        fill: true,
        tension: 0.4,
    }],
};

const evidenceTypeData = {
    labels: ['Images', 'Videos', 'Documents', 'Audio', 'Other'],
    datasets: [{
        data: [1204, 342, 301, 89, 45],
        backgroundColor: ['#00a8ff', '#ff9800', '#00e676', '#00d2ff', '#ff5252'],
        borderWidth: 0,
    }],
};

const monthlyAnalysisData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [{
        label: 'AI Analyses Run',
        data: [8, 12, 10, 15, 11, 18, 15],
        backgroundColor: 'rgba(0, 168, 255, 0.6)',
        borderColor: '#00a8ff',
        borderWidth: 1,
        borderRadius: 6,
    }],
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#161b2a',
            titleColor: '#ffffff',
            bodyColor: '#b0b7c3',
            borderColor: '#2a2f45',
            borderWidth: 1,
        },
    },
    scales: {
        x: { ticks: { color: '#8a94a6' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#8a94a6' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const, labels: { color: '#b0b7c3', padding: 15, font: { size: 12 } } },
        tooltip: {
            backgroundColor: '#161b2a',
            titleColor: '#ffffff',
            bodyColor: '#b0b7c3',
            borderColor: '#2a2f45',
            borderWidth: 1,
        },
    },
};

export default function DashboardPage() {
    const { playSuccess, playClick } = useSoundEffects();
    const liveStats = useLiveStats();
    const recentVisits = useRecentlyVisited();

    const stats = [
        { icon: faClipboardList, num: 0, label: 'Active Cases' },
        { icon: faFileAlt, num: 0, label: 'Evidence Items' },
        { icon: faUsers, num: liveStats.teamMembers, label: 'Team Members' },
        { icon: faBrain, num: liveStats.aiAnalyses, label: 'AI Analyses' },
    ];

    const actions = [
        { icon: faVrCardboard, title: '3D Reconstruction', desc: 'View crime scenes', action: () => { playClick(); toast.success('Loading 3D viewer...'); } },
        { icon: faRobot, title: 'AI Analysis', desc: 'Run AI processing', action: () => { playClick(); toast.success('Starting AI analysis...'); } },
        { icon: faSearch, title: 'Search Database', desc: 'Find evidence & cases', action: () => { playClick(); toast('Use the search bar above', { icon: '🔍' }); } },
    ];

    const handleExportReport = () => {
        playSuccess();
        toast.success('Preparing PDF Report...', { duration: 1500 });
        setTimeout(() => {
            window.print();
        }, 1500);
    };

    const handleExportCharts = () => {
        playClick();
        const canvases = document.querySelectorAll('canvas');
        if (canvases.length === 0) {
            toast.error('No charts found to export.');
            return;
        }
        
        canvases.forEach((canvas, index) => {
            const link = document.createElement('a');
            link.download = `chart-export-${index + 1}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
        toast.success(`Exported ${canvases.length} charts successfully!`);
    };

    return (
        <PageLoader type="dashboard">
        <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
                <h1>Dashboard</h1>
                <p>Overview of active investigations and system status</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="btn btn-sm btn-outline" onClick={handleExportReport}>
                        <FAIcon icon={faFilePdf} /> Export Report
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={handleExportCharts}>
                        <FAIcon icon={faDownload} /> Export Charts
                    </button>
                </div>
            </div>

            <div className={styles.dashboardStats}>
                {stats.map((s, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.statIcon}><FAIcon icon={s.icon} /></div>
                        <div className={styles.statInfo}>
                            <h3><AnimatedCounter end={s.num} /></h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.chartsGrid}>
                <div className="section">
                    <h2>Case Trends</h2>
                    <div style={{ height: '250px' }}>
                        <Line data={caseTrendData} options={chartOptions} />
                    </div>
                </div>
                <div className="section">
                    <h2>Evidence by Type</h2>
                    <div style={{ height: '250px' }}>
                        <Doughnut data={evidenceTypeData} options={doughnutOptions} />
                    </div>
                </div>
            </div>

            <div className="section">
                <h2>Monthly AI Analyses</h2>
                <div style={{ height: '250px' }}>
                    <Bar data={monthlyAnalysisData} options={chartOptions} />
                </div>
            </div>

            <div className="section">
                <h2>Crime Scene Map</h2>
                <CrimeMap />
            </div>

            <div className="section">
                <CaseCalendar />
            </div>

            <div className="section">
                <div className="section-header">
                    <h2>Active Cases</h2>
                    <div>
                        <Link href="/compare" className="btn btn-sm btn-primary" style={{ marginRight: '10px' }}><FAIcon icon={faBalanceScale} /> Compare</Link>
                        <Link href="/evidence" className="btn btn-sm btn-outline">View All</Link>
                    </div>
                </div>
                <div className={styles.casesGrid}>
                    {cases.map((c, i) => (
                        <div key={i} className={styles.caseCard}>
                            <div className={styles.caseHeader}>
                                <span className={styles.caseId}>{c.id}</span>
                                <span className={`${styles.caseStatus} ${styles[c.status]}`}>{c.statusText}</span>
                            </div>
                            <h3>{c.title}</h3>
                            <div className={styles.caseDetails}>
                                <p><FAIcon icon={faCalendarAlt} /> {c.date}</p>
                                <p><FAIcon icon={faMapMarkerAlt} /> {c.location}</p>
                            </div>
                            <div className={styles.caseFooter}>
                                <span className={`${styles.casePriority} ${styles[c.priority]}`}>
                                    <FAIcon icon={faExclamationTriangle} /> {c.priorityText}
                                </span>
                                <Link href="/evidence" className="btn btn-sm btn-outline">View</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <h2>Quick Actions</h2>
                </div>
                <div className={styles.actionsGrid}>
                    {actions.map((a, i) => (
                        <div key={i} className={styles.actionCard} onClick={a.action} style={{ cursor: 'pointer' }}>
                            <div className={styles.actionIcon}><FAIcon icon={a.icon} /></div>
                            <h3>{a.title}</h3>
                            <p>{a.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <h2>Recent Activity</h2>
                </div>
                <div className={styles.activityList}>
                    {activities.map((a, i) => (
                        <div key={i} className={styles.activityItem}>
                            <div className={styles.activityIcon}><FAIcon icon={a.icon} /></div>
                            <div className={styles.activityContent}>
                                <h4>{a.title}</h4>
                                <p>{a.desc}</p>
                                <span className={styles.activityTime}>{a.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {recentVisits.length > 0 && (
                <div className="section">
                    <div className="section-header">
                        <h2><FAIcon icon={faHistory} /> Recently Viewed</h2>
                    </div>
                    <div className={styles.recentVisits}>
                        {recentVisits.map((v, i) => (
                            <Link key={i} href={v.path} className={styles.visitCard}>
                                <span className={styles.visitTitle}>{v.title}</span>
                                <span className={styles.visitTime}>{new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </PageLoader>
    );
}
