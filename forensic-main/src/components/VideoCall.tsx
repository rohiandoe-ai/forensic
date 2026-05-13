'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FAIcon from './FontAwesome';
import {
    faVideo,
    faTimes,
    faCopy,
    faUsers,
    faExternalLinkAlt,
    faCircle,
    faStop
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { forensicService } from '@/lib/services/forensic';
import styles from './VideoCall.module.css';
import { supabase } from '@/lib/supabase/client';

// Dynamically import Jitsi SDK
const JitsiMeeting = dynamic(
    () => import('@jitsi/react-sdk').then((mod) => mod.JitsiMeeting),
    { ssr: false }
);

interface VideoCallProps {
    /** Shared room — all employees open the same slug to join one meeting */
    roomSlug?: string;
    displayName?: string;
    userId?: string | null;
}

export default function VideoCall({
    roomSlug = 'ForensicRecon-Team',
    displayName = 'Team member',
    userId,
}: VideoCallProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [jitsiLoaded, setJitsiLoaded] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);

    const jitsiDomain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'meet.jit.si';

    const roomName = roomSlug.replace(/\s+/g, '-');
    const meetUrl = `https://${jitsiDomain}/${roomName}`;

    const handleOpen = () => setIsOpen(true);

    const handleClose = () => {
        setIsOpen(false);
        setIsLive(false);
        setJitsiLoaded(false);
        setParticipantCount(0);
    };

    const copyMeetingLink = () => {
        navigator.clipboard.writeText(meetUrl).then(() => {
            toast.success('Meeting link copied');
        });
    };

    const handleJoinMeeting = async () => {
        setIsLive(true);
        if (userId) {
            try {
                await forensicService.startMeeting(roomName, userId);
            } catch {
                /* audit row optional */
            }
        }
    };

    const handleApiReady = (api: any) => {
        setJitsiLoaded(true);
        
        api.on('participantJoined', () => {
            const participants = api.getParticipantsInfo();
            setParticipantCount(participants.length + 1);
        });

        api.on('participantLeft', () => {
            const participants = api.getParticipantsInfo();
            setParticipantCount(participants.length + 1);
        });

        const participants = api.getParticipantsInfo();
        setParticipantCount(participants.length + 1);
    };

    if (!isOpen) {
        return (
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleOpen}
                style={{ boxShadow: '0 0 15px rgba(0, 168, 255, 0.3)' }}
            >
                <FAIcon icon={faVideo} /> Live Investigation
            </button>
        );
    }

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} ${isLive ? styles.fullScreen : ''}`} style={{ 
                border: '1px solid var(--primary-blue)',
                boxShadow: '0 0 40px rgba(0, 168, 255, 0.2)',
                background: 'var(--primary-dark)'
            }}>
                <div className={styles.modalHeader} style={{ background: 'rgba(0, 168, 255, 0.05)' }}>
                    <h2>
                        <FAIcon icon={faVideo} style={{ color: 'var(--primary-blue)' }} /> 
                        {isLive ? `Investigation: ${roomName}` : 'Secure Transmission'}
                    </h2>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {isLive && (
                            <span style={{ 
                                fontSize: '0.8rem', 
                                color: 'var(--neon-blue)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '5px',
                                background: 'rgba(0, 245, 255, 0.1)',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid var(--neon-blue)'
                            }}>
                                <FAIcon icon={faUsers} /> {participantCount}
                            </span>
                        )}
                        <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                            <FAIcon icon={faTimes} />
                        </button>
                    </div>
                </div>

                {!isLive ? (
                    <div className={styles.meetIntro} style={{ textAlign: 'center', padding: '40px 30px' }}>
                        <div style={{ 
                            width: '60px', 
                            height: '60px', 
                            borderRadius: '50%', 
                            background: 'rgba(0, 168, 255, 0.1)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'var(--primary-blue)',
                            fontSize: '1.5rem',
                            border: '1px solid var(--primary-blue)'
                        }}>
                            <FAIcon icon={faVideo} />
                        </div>
                        <p className={styles.meetHint}>
                            Establish a secure, encrypted video link for real-time forensic collaboration. 
                            No external account or Google authentication required.
                        </p>
                        <div style={{ 
                            background: 'rgba(0,0,0,0.2)', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '24px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>CHANNEL ID</span>
                            <div style={{ color: 'var(--primary-blue)', fontWeight: 'bold', letterSpacing: '1px' }}>{roomName}</div>
                        </div>
                        <div className={styles.meetActions} style={{ justifyContent: 'center' }}>
                            <button type="button" className="btn btn-outline btn-sm" onClick={copyMeetingLink}>
                                <FAIcon icon={faCopy} /> Copy ID
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleJoinMeeting}>
                                <FAIcon icon={faVideo} /> Start Link
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.meetBody} style={{ position: 'relative' }}>
                        {!jitsiLoaded && (
                            <div style={{ 
                                position: 'absolute', 
                                inset: 0, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                background: 'var(--primary-dark)',
                                zIndex: 10
                            }}>
                                <div className="loader" style={{ 
                                    width: '30px', 
                                    height: '30px', 
                                    border: '2px solid rgba(0, 168, 255, 0.1)', 
                                    borderTopColor: 'var(--primary-blue)',
                                    borderRadius: '50%',
                                    animation: 'rotate 1s linear infinite',
                                    marginBottom: '10px'
                                }}></div>
                                <span style={{ color: 'var(--primary-blue)', fontSize: '0.75rem', letterSpacing: '1px' }}>ENCRYPTING...</span>
                            </div>
                        )}
                        
                        <div style={{ flex: 1, minHeight: '500px' }}>
                            <JitsiMeeting
                                roomName={roomName}
                                configOverwrite={{
                                    startWithAudioMuted: true,
                                    disableModeratorIndicator: true,
                                    startScreenSharing: false,
                                    enableEmailInStats: false,
                                    prejoinPageEnabled: false,
                                    darkMode: true
                                }}
                                interfaceConfigOverwrite={{
                                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                                    SHOW_JITSI_WATERMARK: false,
                                    DARK_MODE: true
                                }}
                                userInfo={{
                                    displayName: displayName,
                                    email: ''
                                }}
                                onApiReady={handleApiReady}
                                getIFrameRef={(iframeRef) => {
                                    iframeRef.style.height = '100%';
                                    iframeRef.style.width = '100%';
                                }}
                            />
                        </div>
                        
                        <div className={styles.meetFooter} style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <button type="button" className="btn btn-outline btn-sm" onClick={copyMeetingLink}>
                                <FAIcon icon={faCopy} /> Link
                            </button>
                            <button type="button" className="btn btn-sm" style={{ background: 'rgba(255, 68, 68, 0.2)', color: '#ff4444' }} onClick={handleClose}>
                                <FAIcon icon={faStop} /> Terminate
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
