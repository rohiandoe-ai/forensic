"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { 
    Book, 
    Shield, 
    FileText, 
    GraduationCap, 
    LifeBuoy, 
    Scale, 
    Lock, 
    FileCheck, 
    ClipboardCheck, 
    ScrollText 
} from 'lucide-react';

const sections = [
    {
        id: 'resources',
        title: 'Resources',
        icon: <Book className={styles.navIcon} />,
        largeIcon: <Book size={32} />,
        content: (
            <>
                <p>Welcome to the central resource hub for the Smart Crime Scene Reconstruction System. Here you will find tools, templates, and materials to assist in your forensic investigations.</p>
                <div className={styles.cardGrid}>
                    <div className={styles.infoCard}>
                        <FileText className={styles.cardIcon} size={24} />
                        <h4>Whitepapers</h4>
                        <p>In-depth research on AI-assisted forensic analysis and 3D reconstruction methodologies.</p>
                    </div>
                    <div className={styles.infoCard}>
                        <Book className={styles.cardIcon} size={24} />
                        <h4>Case Studies</h4>
                        <p>Real-world examples of how our platform has accelerated case closures and improved evidence accuracy.</p>
                    </div>
                    <div className={styles.infoCard}>
                        <ScrollText className={styles.cardIcon} size={24} />
                        <h4>Templates</h4>
                        <p>Standardized reporting templates for court submissions and inter-departmental sharing.</p>
                    </div>
                </div>
            </>
        )
    },
    {
        id: 'security-ethics',
        title: 'Security & Ethics',
        icon: <Shield className={styles.navIcon} />,
        largeIcon: <Shield size={32} />,
        content: (
            <>
                <p>We are committed to maintaining the highest standards of security and ethical AI usage in law enforcement.</p>
                <h3>Data Security</h3>
                <p>All evidence uploaded to the platform is encrypted at rest (AES-256) and in transit (TLS 1.3). We employ strict Zero-Trust architecture, ensuring only authorized personnel have access to sensitive case files.</p>
                <h3>Ethical AI Principles</h3>
                <ul>
                    <li><strong>Transparency:</strong> Our AI models provide confidence scores and highlight the specific data points used to reach conclusions.</li>
                    <li><strong>Bias Mitigation:</strong> Continuous auditing of algorithms to prevent racial, gender, or socioeconomic biases in analysis.</li>
                    <li><strong>Human-in-the-Loop:</strong> AI is designed to augment human investigators, not replace them. Final decisions always rest with certified personnel.</li>
                </ul>
            </>
        )
    },
    {
        id: 'documentation',
        title: 'Documentation',
        icon: <FileText className={styles.navIcon} />,
        largeIcon: <FileText size={32} />,
        content: (
            <>
                <p>Comprehensive technical documentation for administrators and developers integrating with our API.</p>
                <h3>Platform Guides</h3>
                <ul>
                    <li>Getting Started: User setup, authentication, and workspace configuration.</li>
                    <li>Evidence Management: Uploading, tagging, and securing digital chain of custody.</li>
                    <li>3D Reconstruction: Utilizing LiDAR and photogrammetry tools within the application.</li>
                </ul>
                <h3>API Reference</h3>
                <p>Access our RESTful and GraphQL APIs for integrating with existing dispatch and records management systems (RMS). View the full swagger documentation at our developer portal.</p>
            </>
        )
    },
    {
        id: 'training',
        title: 'Training',
        icon: <GraduationCap className={styles.navIcon} />,
        largeIcon: <GraduationCap size={32} />,
        content: (
            <>
                <p>Ensure your department is maximizing the potential of the Smart Crime Scene Reconstruction System with our specialized training programs.</p>
                <div className={styles.cardGrid}>
                    <div className={styles.infoCard}>
                        <GraduationCap className={styles.cardIcon} size={24} />
                        <h4>Basic Certification</h4>
                        <p>Fundamental training for field officers and evidence technicians on data capture and initial upload.</p>
                    </div>
                    <div className={styles.infoCard}>
                        <Book className={styles.cardIcon} size={24} />
                        <h4>Advanced Analysis</h4>
                        <p>Deep dive into 3D manipulation, timeline reconstruction, and cross-case pattern recognition.</p>
                    </div>
                </div>
                <h3>On-Demand Webinars</h3>
                <p>Access our library of recorded webinars covering new feature releases, best practices, and expert guest lectures on modern forensics.</p>
            </>
        )
    },
    {
        id: 'support',
        title: 'Support',
        icon: <LifeBuoy className={styles.navIcon} />,
        largeIcon: <LifeBuoy size={32} />,
        content: (
            <>
                <p>Our dedicated support team is available 24/7/365 for critical law enforcement operations.</p>
                <h3>Contact Methods</h3>
                <ul>
                    <li><strong>Emergency Dispatch Support:</strong> Dedicated hotline for urgent technical issues during active crime scene investigations.</li>
                    <li><strong>Standard Ticketing:</strong> Submit non-urgent requests through your agency dashboard. SLAs guarantee a response within 4 hours.</li>
                    <li><strong>Community Forums:</strong> Connect with other agencies to share workflows and operational strategies.</li>
                </ul>
                <h3>System Status</h3>
                <p>Current System Status: <strong>All Systems Operational (99.99% Uptime)</strong></p>
            </>
        )
    },
    {
        id: 'legal',
        title: 'Legal',
        icon: <Scale className={styles.navIcon} />,
        largeIcon: <Scale size={32} />,
        content: (
            <>
                <p>Important legal information regarding the use of the platform, intellectual property, and liability.</p>
                <h3>Intellectual Property</h3>
                <p>The platform, including its proprietary algorithms, 3D rendering engines, and interface designs, are the intellectual property of our organization. Agency data remains the exclusive property of the respective agency.</p>
                <h3>Disclaimers</h3>
                <p>While our tools are designed to assist investigations, they must be used in conjunction with standard forensic procedures. We are not liable for investigative outcomes or judicial decisions based solely on platform outputs.</p>
            </>
        )
    },
    {
        id: 'privacy-policy',
        title: 'Privacy Policy',
        icon: <Lock className={styles.navIcon} />,
        largeIcon: <Lock size={32} />,
        content: (
            <>
                <p>How we handle user data and ensure the privacy of individuals involved in investigations.</p>
                <h3>Data Collection</h3>
                <p>We collect essential diagnostic data to improve system performance. We do not mine, sell, or analyze agency case files for any commercial purposes.</p>
                <h3>Data Retention</h3>
                <p>Case data is retained according to agency-defined policies. Upon request or contract termination, all data is cryptographically destroyed, and certificates of destruction are provided.</p>
                <h3>Personnel Privacy</h3>
                <p>Investigator activity is logged for audit purposes but is only accessible to designated agency administrators.</p>
            </>
        )
    },
    {
        id: 'terms',
        title: 'Terms of Service',
        icon: <ScrollText className={styles.navIcon} />,
        largeIcon: <ScrollText size={32} />,
        content: (
            <>
                <p>The terms governing your agency&apos;s use of the Smart Crime Scene Reconstruction System.</p>
                <h3>Acceptable Use</h3>
                <p>The platform is strictly for use by verified law enforcement, judicial, and approved private forensic agencies. Any unauthorized access attempts will be reported to federal authorities.</p>
                <h3>Account Responsibilities</h3>
                <p>Agencies are responsible for maintaining the confidentiality of their credentials and implementing appropriate multi-factor authentication (MFA).</p>
                <h3>Modifications</h3>
                <p>We reserve the right to update these terms. Significant changes will be communicated to agency administrators 30 days prior to implementation.</p>
            </>
        )
    },
    {
        id: 'compliance',
        title: 'Compliance',
        icon: <FileCheck className={styles.navIcon} />,
        largeIcon: <FileCheck size={32} />,
        content: (
            <>
                <p>Our platform adheres to strict federal and international standards for law enforcement technology.</p>
                <div className={styles.cardGrid}>
                    <div className={styles.infoCard}>
                        <Shield className={styles.cardIcon} size={24} />
                        <h4>CJIS Compliant</h4>
                        <p>Fully compliant with the FBI&apos;s Criminal Justice Information Services (CJIS) Security Policy.</p>
                    </div>
                    <div className={styles.infoCard}>
                        <Lock className={styles.cardIcon} size={24} />
                        <h4>FedRAMP</h4>
                        <p>Our cloud infrastructure meets FedRAMP High baseline security requirements.</p>
                    </div>
                    <div className={styles.infoCard}>
                        <FileCheck className={styles.cardIcon} size={24} />
                        <h4>ISO 27001</h4>
                        <p>Certified for information security management systems.</p>
                    </div>
                </div>
            </>
        )
    },
    {
        id: 'audit-logs',
        title: 'Audit Logs',
        icon: <ClipboardCheck className={styles.navIcon} />,
        largeIcon: <ClipboardCheck size={32} />,
        content: (
            <>
                <p>Maintaining a flawless chain of custody and tracking system interactions.</p>
                <h3>Immutable Records</h3>
                <p>Every action taken within the platform—from viewing a file to modifying a 3D model—is recorded in an immutable, blockchain-backed audit log.</p>
                <h3>Export Capabilities</h3>
                <p>Administrators can export audit logs in standard formats (CSV, JSON, PDF) for internal review or court submission, complete with cryptographic hashes to prove non-tampering.</p>
                <h3>Access Tracking</h3>
                <ul>
                    <li>IP Address and Device ID logging</li>
                    <li>Timestamp tracking down to the millisecond</li>
                    <li>Action categorization (View, Edit, Upload, Delete, Share)</li>
                </ul>
            </>
        )
    }
];

export default function ResourcesPage() {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && sections.some(s => s.id === hash)) {
                setActiveSection(hash);
            }
        };

        // Check initially on load
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const activeData = sections.find(s => s.id === activeSection) || sections[0];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Legal & Resources</h1>
                <p>Comprehensive information regarding our platform, policies, compliance, and support services.</p>
            </div>
            
            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarTitle}>Navigation</div>
                    {sections.map(section => (
                        <button 
                            key={section.id}
                            className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.icon}
                            {section.title}
                        </button>
                    ))}
                </aside>
                
                <div className={styles.content}>
                    <h2 className={styles.sectionTitle}>
                        <div className={styles.sectionIcon}>
                            {activeData.largeIcon}
                        </div>
                        {activeData.title}
                    </h2>
                    
                    <div className={styles.sectionBody}>
                        {activeData.content}
                    </div>
                </div>
            </div>
        </div>
    );
}
