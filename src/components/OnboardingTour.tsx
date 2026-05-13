'use client';

import { useState, useEffect } from 'react';
import FAIcon from './FontAwesome';
import { faTimes, faArrowRight, faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import styles from './OnboardingTour.module.css';

const tourSteps = [
    { title: 'Welcome to ForensicRecon', text: 'This is your centralized command center for modern forensic investigation. Let us show you around.', target: 'body' },
    { title: 'Dashboard', text: 'Get a quick overview of all active cases, recent evidence uploads, and AI analysis progress.', target: 'nav-dashboard' },
    { title: 'Evidence Management', text: 'Upload, tag, and track the chain of custody for all digital evidence items in one secure place.', target: 'nav-evidence' },
    { title: 'AI Assistant', text: 'Ask questions about case details, get predictive insights, or cross-reference databases instantly.', target: 'chatbot-toggle' },
    { title: '3D Visualization', text: 'Reconstruct crime scenes in full 3D to analyze trajectories and spatial relationships.', target: 'nav-visualization' }
];

export default function OnboardingTour() {
    const [hasSeenTour, setHasSeenTour] = useLocalStorage('forensic_tour_seen', false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!hasSeenTour) {
            // Delay start slightly to let page load
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [hasSeenTour]);

    if (!isVisible) return null;

    const step = tourSteps[currentStep];

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) setCurrentStep(prev => prev + 1);
        else closeTour();
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const closeTour = () => {
        setIsVisible(false);
        setHasSeenTour(true);
    };

    return (
        <div className={styles.tourOverlay}>
            <div className={styles.tourModal}>
                <button className={styles.closeBtn} onClick={closeTour} aria-label="Close tour">
                    <FAIcon icon={faTimes} />
                </button>
                
                <div className={styles.tourHeader}>
                    <div className={styles.stepIndicator}>
                        Step {currentStep + 1} of {tourSteps.length}
                    </div>
                    <h3>{step.title}</h3>
                </div>
                
                <div className={styles.tourBody}>
                    <p>{step.text}</p>
                </div>
                
                <div className={styles.tourFooter}>
                    <div className={styles.dots}>
                        {tourSteps.map((_, i) => (
                            <div key={i} className={`${styles.dot} ${i === currentStep ? styles.activeDot : ''}`} />
                        ))}
                    </div>
                    <div className={styles.actions}>
                        <button 
                            className="btn btn-sm btn-outline" 
                            onClick={handlePrev} 
                            disabled={currentStep === 0}
                        >
                            <FAIcon icon={faArrowLeft} /> Back
                        </button>
                        <button 
                            className="btn btn-sm btn-primary" 
                            onClick={handleNext}
                        >
                            {currentStep === tourSteps.length - 1 ? (
                                <><FAIcon icon={faCheckCircle} /> Finish</>
                            ) : (
                                <>Next <FAIcon icon={faArrowRight} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
