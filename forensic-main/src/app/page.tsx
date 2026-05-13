'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FAIcon from '@/components/FontAwesome';
import {
    faPlayCircle, faUpload, faMapMarkedAlt, faMicroscope, faBrain,
    faVrCardboard, faUsersCog, faShieldAlt, faArrowRight,
    faRobot, faCube, faSearch
} from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import LoginModal from '@/components/LoginModal';

const features = [
    { icon: faMapMarkedAlt, title: 'LiDAR Scene Mapping', desc: 'Generate high-fidelity 3D point clouds from LiDAR data with millimeter precision for crime scene preservation.', link: '/visualization', linkText: 'Explore Mapping' },
    { icon: faMicroscope, title: 'Chain of Custody', desc: 'Blockchain-backed evidence tracking ensuring immutable logs and secure digital evidence management.', link: '/evidence', linkText: 'Manage Evidence' },
    { icon: faBrain, title: 'AI Ballistics Analysis', desc: 'Automated trajectory calculation and pattern matching using advanced neural networks for ballistic reconstruction.', link: '/reconstruction', linkText: 'Analyze Case' },
    { icon: faVrCardboard, title: 'Immersive VR Review', desc: 'Full-scale virtual reality crime scene walkthroughs for jury presentations and investigative review.', link: '/visualization', linkText: 'Launch VR' },
    { icon: faUsersCog, title: 'Real-time Coordination', desc: 'Secure multi-agency collaboration hub with real-time data synchronization and encrypted communication.', link: '/collaboration', linkText: 'Collaborate Now' },
    { icon: faShieldAlt, title: 'Compliance & Ethics', desc: 'Built-in ethical AI safeguards and full CJIS compliance for law enforcement data handling standards.', link: '/security', linkText: 'Review Security' },
];

const workflowSteps = [
    { num: '1', title: 'Data Collection', desc: 'Gather evidence from crime scene including photos, videos, and physical evidence.' },
    { num: '2', title: 'Evidence Digitization', desc: 'Upload and catalog digital evidence with metadata and chain of custody.' },
    { num: '3', title: 'AI Processing', desc: 'Analyze patterns, reconstruct events, and generate insights using AI algorithms.' },
    { num: '4', title: '3D Visualization', desc: 'Create immersive reconstructions for analysis and presentation.' },
    { num: '5', title: 'Collaborative Review', desc: 'Team analysis, expert consultation, and peer review of findings.' },
    { num: '6', title: 'Courtroom Presentation', desc: 'Generate reports, visual aids, and presentations for legal proceedings.' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function Home() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                if (data?.role === 'admin') setIsAdmin(true);
            }
        };
        checkAdmin();
    }, []);

    const handleAdminClick = (e: React.MouseEvent) => {
        if (!isAdmin) {
            e.preventDefault();
            setIsLoginOpen(true);
        }
    };

    return (
        <>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <section className={styles.hero}>
                <div className={styles.heroContainer}>
                    <motion.div
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className={styles.heroTitle}>
                            <span className={styles.heroHighlight}>Smart Crime Scene</span><br />
                            Reconstruction System
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Advanced AI-powered forensic analysis, 3D visualization, and collaborative investigation platform for modern law enforcement.
                        </p>
                        <div className={styles.heroButtons}>
                            <Link href="/dashboard" className="btn btn-primary">
                                <FAIcon icon={faPlayCircle} /> Get Started
                            </Link>
                            <Link 
                                href="/admin" 
                                className="btn btn-outline" 
                                style={{ marginLeft: '12px' }}
                                onClick={handleAdminClick}
                            >
                                <FAIcon icon={faShieldAlt} /> Admin Portal
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div
                        className={styles.heroVisual}
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={styles.visualCard}>
                            <div className={styles.visualGraphic}>
                                <motion.div
                                    className={styles.graphicElement}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <FAIcon icon={faRobot} />
                                    <span className={styles.pulse}></span>
                                </motion.div>
                                <motion.div
                                    className={styles.graphicElement}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                >
                                    <FAIcon icon={faCube} />
                                    <span className={`${styles.pulse} ${styles.delay1}`}></span>
                                </motion.div>
                                <motion.div
                                    className={styles.graphicElement}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                >
                                    <FAIcon icon={faSearch} />
                                    <span className={`${styles.pulse} ${styles.delay2}`}></span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className={styles.features}>
                <div className="container">
                    <h2 className="section-title">System Capabilities</h2>
                    <p className="section-subtitle">Comprehensive forensic investigation tools powered by AI and advanced visualization</p>
                    <motion.div
                        className={styles.featuresGrid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((f, i) => (
                            <motion.div key={i} className={styles.featureCard} variants={itemVariants}>
                                <div className={styles.featureIcon}>
                                    <FAIcon icon={f.icon} />
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                                <Link href={f.link} className={styles.featureLink}>
                                    {f.linkText} <FAIcon icon={faArrowRight} />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={styles.workflow}>
                <div className="container">
                    <h2 className="section-title">Forensic Investigation Workflow</h2>
                    <motion.div
                        className={styles.workflowSteps}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {workflowSteps.map((s, i) => (
                            <motion.div key={i} className={styles.step} variants={itemVariants}>
                                <div className={styles.stepNumber}>{s.num}</div>
                                <div className={styles.stepContent}>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}
