'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import FAIcon from '@/components/FontAwesome';
import { 
    faVideo, 
    faStop, 
    faLink, 
    faShareAlt, 
    faCircle,
    faHistory,
    faUsers,
    faExpand,
    faCompress
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';

// Dynamically import Jitsi SDK to avoid SSR issues
const JitsiMeeting = dynamic(
    () => import('@jitsi/react-sdk').then((mod) => mod.JitsiMeeting),
    { ssr: false }
);

export default function MeetingPanel() {
    const [loading, setLoading] = useState(false);
    const [activeMeeting, setActiveMeeting] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [caseRef, setCaseRef] = useState('');
    const [participantCount, setParticipantCount] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [jitsiLoaded, setJitsiLoaded] = useState(false);
    const [userName, setUserName] = useState('Investigator');
    const [showJitsi, setShowJitsi] = useState(false);

    useEffect(() => {
        loadMeetings();
        fetchUser();
        const sub = supabase
            .channel('meetings_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, loadMeetings)
            .subscribe();
        
        return () => {
            supabase.removeChannel(sub);
        };
    }, []);

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.display_name) {
            setUserName(user.user_metadata.display_name);
        } else if (user?.email) {
            setUserName(user.email.split('@')[0]);
        }
    };

    const loadMeetings = async () => {
        const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .order('started_at', { ascending: false });
        
        if (data) {
            setHistory(data);
            const active = data.find((m: any) => m.active);
            if (active) {
                setActiveMeeting(active);
            } else {
                setActiveMeeting(null);
                setShowJitsi(false);
            }
        }
    };

    const startMeeting = async () => {
        setLoading(true);
        const roomName = `ForensicRecon-${caseRef.replace(/[^a-zA-Z0-9]/g, '-') || 'General'}-${Math.random().toString(36).substring(7)}`;
        const meetLink = `https://meet.jit.si/${roomName}`;

        try {
            const { data: userData } = await supabase.auth.getUser();
            const { data, error } = await supabase.from('meetings').insert([{
                case_ref: caseRef || 'General Investigation',
                meet_link: meetLink,
                created_by: userData.user?.id,
                active: true,
                started_at: new Date().toISOString()
            }]).select().single();

            if (error) throw error;

            setActiveMeeting(data);
            setShowJitsi(false);
            toast.success('Investigation Meeting Initialized!');
            
            // Share on WhatsApp option
            shareOnWhatsApp(meetLink, caseRef || 'General');
        } catch (err: any) {
            toast.error(err.message || 'Failed to start meeting');
        } finally {
            setLoading(false);
        }
    };

    const endMeeting = async (id: string) => {
        try {
            await supabase.from('meetings').update({ 
                active: false,
                ended_at: new Date().toISOString() 
            }).eq('id', id);
            
            setActiveMeeting(null);
            setShowJitsi(false);
            setParticipantCount(0);
            setJitsiLoaded(false);
            toast.success('Meeting Session Terminated');
            loadMeetings();
        } catch {
            toast.error('Failed to end meeting');
        }
    };

    const shareOnWhatsApp = (link: string, ref: string) => {
        const message = `🚨 Forensic Investigation Meeting\n\nCase: ${ref}\n\nJoin Meeting:\n${link}\n\nSecure Jitsi Link. No login required.`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const copyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        toast.success('Link copied to clipboard');
    };

    const handleApiReady = (api: any) => {
        setJitsiLoaded(true);
        
        api.on('participantJoined', () => {
            const participants = api.getParticipantsInfo();
            setParticipantCount(participants.length + 1); // +1 for local
        });

        api.on('participantLeft', () => {
            const participants = api.getParticipantsInfo();
            setParticipantCount(participants.length + 1);
        });

        // Initial count
        const participants = api.getParticipantsInfo();
        setParticipantCount(participants.length + 1);
    };

    return (
        <div className="section" style={{ 
            marginTop: '24px', 
            background: 'linear-gradient(135deg, #0a0e17 0%, #161b2a 100%)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 0 20px rgba(0, 168, 255, 0.1)'
        }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: 'var(--text-primary)', textShadow: '0 0 10px rgba(0, 168, 255, 0.3)' }}>
                    <FAIcon icon={faVideo} style={{ marginRight: '10px', color: 'var(--primary-blue)' }} />
                    Cyber Investigation Meeting
                </h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {activeMeeting && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {showJitsi && (
                                <span className="badge" style={{ 
                                    background: 'rgba(0, 255, 255, 0.1)', 
                                    color: 'var(--neon-blue)', 
                                    border: '1px solid var(--neon-blue)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    <FAIcon icon={faUsers} /> {participantCount}
                                </span>
                            )}
                            <span className="badge" style={{ background: 'rgba(0, 255, 0, 0.1)', color: '#00ff88', border: '1px solid #00ff88' }}>
                                <FAIcon icon={faCircle} style={{ fontSize: '0.6rem', marginRight: '5px', animation: 'pulse 1.5s infinite' }} />
                                {showJitsi ? 'LIVE' : 'INITIALIZED'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {!activeMeeting ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.1)'
                }}>
                    <input 
                        type="text" 
                        placeholder="Case Reference (e.g. CR-101)" 
                        className="input"
                        style={{ 
                            maxWidth: '400px', 
                            marginBottom: '20px', 
                            display: 'block', 
                            margin: '0 auto 20px',
                            background: '#0a0e17',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            textAlign: 'center'
                        }}
                        value={caseRef}
                        onChange={e => setCaseRef(e.target.value)}
                    />
                    <button 
                        className="btn btn-primary" 
                        onClick={startMeeting} 
                        disabled={loading}
                        style={{ 
                            padding: '14px 40px', 
                            fontSize: '1.1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            boxShadow: '0 0 15px rgba(0, 168, 255, 0.4)'
                        }}
                    >
                        <FAIcon icon={faVideo} style={{ marginRight: '10px' }} />
                        {loading ? 'INITIALIZING...' : 'Generate & Share Link'}
                    </button>
                    <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        * Generates a secure Jitsi link and opens WhatsApp for sharing.
                    </p>
                </div>
            ) : !showJitsi ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px 20px',
                    background: 'rgba(0, 168, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid var(--primary-blue)',
                    boxShadow: '0 0 30px rgba(0, 168, 255, 0.1)'
                }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Meeting Ready: {activeMeeting.case_ref}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>The link has been generated and shared. You can now join the session.</p>
                        <div style={{ 
                            background: 'rgba(0,0,0,0.3)', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            display: 'inline-block',
                            border: '1px solid rgba(255,255,255,0.05)',
                            marginTop: '10px'
                        }}>
                            <code style={{ color: 'var(--primary-blue)' }}>{activeMeeting.meet_link}</code>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button className="btn btn-outline" onClick={() => copyLink(activeMeeting.meet_link)}>
                            <FAIcon icon={faLink} /> Copy Link
                        </button>
                        <button className="btn btn-outline" onClick={() => shareOnWhatsApp(activeMeeting.meet_link, activeMeeting.case_ref)}>
                            <FAIcon icon={faWhatsapp} /> Reshare
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowJitsi(true)} style={{ padding: '12px 40px' }}>
                            <FAIcon icon={faVideo} /> Join Meeting Now
                        </button>
                        <button className="btn" style={{ background: 'rgba(255, 68, 68, 0.2)', color: '#ff4444' }} onClick={() => endMeeting(activeMeeting.id)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    height: isFullscreen ? 'calc(100vh - 100px)' : '600px',
                    transition: 'height 0.3s ease'
                }}>
                    {/* Toolbar */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-blue)' }}>
                                CASE: {activeMeeting.case_ref}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeMeeting.meet_link}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn btn-sm btn-outline" onClick={() => copyLink(activeMeeting.meet_link)} title="Copy Link">
                                <FAIcon icon={faLink} />
                            </button>
                            <button className="btn btn-sm btn-outline" onClick={() => shareOnWhatsApp(activeMeeting.meet_link, activeMeeting.case_ref)} title="Share on WhatsApp">
                                <FAIcon icon={faWhatsapp} />
                            </button>
                            <button className="btn btn-sm btn-outline" onClick={() => setIsFullscreen(!isFullscreen)} title="Toggle Height">
                                <FAIcon icon={isFullscreen ? faCompress : faExpand} />
                            </button>
                            <button className="btn btn-sm" style={{ background: 'rgba(255, 68, 68, 0.2)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.4)' }} onClick={() => endMeeting(activeMeeting.id)}>
                                <FAIcon icon={faStop} /> TERMINATE
                            </button>
                        </div>
                    </div>

                    {/* Jitsi Container */}
                    <div style={{ 
                        flex: 1, 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        background: '#000',
                        position: 'relative',
                        border: '2px solid var(--primary-blue)',
                        boxShadow: '0 0 30px rgba(0, 168, 255, 0.2)'
                    }}>
                        {!jitsiLoaded && (
                            <div style={{ 
                                position: 'absolute', 
                                inset: 0, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                background: '#0a0e17',
                                zIndex: 10
                            }}>
                                <div className="loader" style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    border: '3px solid rgba(0, 168, 255, 0.1)', 
                                    borderTopColor: 'var(--primary-blue)',
                                    borderRadius: '50%',
                                    animation: 'rotate 1s linear infinite',
                                    marginBottom: '15px'
                                }}></div>
                                <span style={{ color: 'var(--primary-blue)', letterSpacing: '2px', fontSize: '0.8rem' }}>ENCRYPTING CHANNEL...</span>
                            </div>
                        )}
                        
                        <JitsiMeeting
                            roomName={activeMeeting.meet_link.split('/').pop()}
                            configOverwrite={{
                                startWithAudioMuted: true,
                                disableModeratorIndicator: true,
                                startScreenSharing: false,
                                enableEmailInStats: false,
                                prejoinPageEnabled: false,
                                darkMode: true,
                                theme: 'dark'
                            }}
                            interfaceConfigOverwrite={{
                                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                                SHOW_JITSI_WATERMARK: false,
                                DARK_MODE: true
                            }}
                            userInfo={{
                                displayName: userName,
                                email: ''
                            }}
                            onApiReady={handleApiReady}
                            getIFrameRef={(iframeRef) => {
                                iframeRef.style.height = '100%';
                                iframeRef.style.width = '100%';
                            }}
                        />
                    </div>
                </div>
            )}

            {/* History Section */}
            {!isFullscreen && (
                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <FAIcon icon={faHistory} /> Transmission Archives
                    </h3>
                    <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
                        {history.slice(0, 5).map((m: any) => (
                            <div key={m.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '14px 20px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.03)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0, 168, 255, 0.2)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'}
                            >
                                <div>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{m.case_ref}</span>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(m.started_at).toLocaleString()}
                                        </span>
                                        {m.active && (
                                            <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 'bold' }}>• LIVE</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-sm btn-outline" onClick={() => window.open(m.meet_link, '_blank')} style={{ fontSize: '0.75rem' }}>
                                        RECONNECT
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
