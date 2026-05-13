'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import FAIcon from '@/components/FontAwesome';
import PageLoader from '@/components/PageLoader';
import toast from 'react-hot-toast';
import { forensicService, type ProfileRow, type EvidenceRow } from '@/lib/services/forensic';
import {
    faCloudUploadAlt,
    faClipboardList,
    faUserShield,
    faTrashAlt,
    faSync,
    faCheck,
    faClock,
    faUserPlus,
    faUpload,
    faFileAlt,
    faDownload,
    faTrash,
    faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/lib/supabase/client';
import styles from './page.module.css';

export default function AdminPage() {
    const [profiles, setProfiles] = useState<ProfileRow[]>([]);
    const [evidence, setEvidence] = useState<EvidenceRow[]>([]);
    const [loading, setLoading] = useState(true);

    // New member form state
    const [newMember, setNewMember] = useState({ id: '', name: '', role: 'employee', phone: '', designation: '' });
    const [showAddMember, setShowAddMember] = useState(false);

    const [userId, setUserId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [ev, users] = await Promise.all([
                forensicService.getEvidence().catch(() => []),
                forensicService.listProfiles().catch(() => []),
            ]);
            setEvidence(ev);
            setProfiles(users);
        } catch {
            toast.error('Could not load admin data');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUserId(session?.user?.id || null);
        };
        getSession();
        
        void load();
        const sub1 = forensicService.subscribe('profiles', load);
        const sub2 = forensicService.subscribe('evidence', load);
        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        };
    }, [load]);

    const handleUpdateStatus = async (id: string, status: string, text: string) => {
        try {
            await forensicService.updateEvidenceStatus(id, status, text);
            toast.success(`Evidence marked as ${text}`);
            void load();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteEvidence = async (id: string) => {
        try {
            await forensicService.deleteEvidence(id);
            toast.success('Evidence deleted');
            void load();
        } catch (err: any) {
            console.error('Delete Evidence Error:', err);
            toast.error(`Delete Failed: ${err.message || 'Unknown error'}`);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMember.name) return;
        try {
            await forensicService.addTeamMember({
                id: crypto.randomUUID(),
                display_name: newMember.name,
                role: newMember.role,
                phone: newMember.phone,
                designation: newMember.designation
            });
            toast.success('Team member added');
            setNewMember({ id: '', name: '', role: 'employee', phone: '', designation: '' });
            setShowAddMember(false);
            void load();
        } catch {
            toast.error('Failed to add member');
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await forensicService.deleteProfile(id);
            toast.success('User removed');
            void load();
        } catch (err: any) {
            console.error('Delete User Error:', err);
            toast.error(`Delete Failed: ${err.message || 'Unknown error'}`);
        }
    };


    return (
        <PageLoader type="admin">
            <div className={styles.admin} role="main" aria-label="Administrator console">
                <div className={styles.intro}>
                    <h1>
                        <FAIcon icon={faUserShield} /> Admin Command Center
                    </h1>
                    <p>
                        Securely manage evidence processing, personnel clearance, and case submissions.
                    </p>
                </div>

                {/* 1. UPLOAD SECTION */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Case Upload</h2>
                        <Link href="/upload" className="btn btn-primary btn-sm">
                            <FAIcon icon={faCloudUploadAlt} /> New Case Upload
                        </Link>
                        <Link href="/admin/meetings" className="btn btn-outline btn-sm" style={{ marginLeft: '10px' }}>
                            <FAIcon icon={faVideo} /> Live Meeting
                        </Link>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Submit new forensic evidence, scene photos, and case details for reconstruction.
                    </p>
                </div>

                {/* 2. EVIDENCE MANAGEMENT */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Evidence Management</h2>
                        <div className={styles.headerActions}>
                             <button className="btn btn-outline btn-sm" onClick={load} title="Sync Data">
                                <FAIcon icon={faSync} />
                            </button>
                            <Link href="/evidence" className="btn btn-outline btn-sm">View Full Catalog</Link>
                        </div>
                    </div>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Case Ref</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evidence.length === 0 ? (
                                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No records found</td></tr>
                                ) : (
                                    evidence.slice(0, 8).map((e) => (
                                        <tr key={e.id}>
                                            <td style={{ fontSize: '0.7rem' }}>{e.id.slice(0,8)}...</td>
                                            <td>{e.title}</td>
                                            <td>{e.caseRef}</td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${styles[e.status]}`}>
                                                    {e.statusText}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button onClick={() => handleUpdateStatus(e.id, 'statusProcessing', 'Processing')} title="Set Processing">
                                                        <FAIcon icon={faClock} />
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(e.id, 'statusAnalyzed', 'Completed')} title="Mark Completed">
                                                        <FAIcon icon={faCheck} />
                                                    </button>
                                                    <button onClick={() => handleDeleteEvidence(e.id)} title="Delete Evidence" style={{ color: 'var(--danger)' }}>
                                                        <FAIcon icon={faTrashAlt} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* 3. TEAM MANAGEMENT */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Team Management</h2>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowAddMember(!showAddMember)}>
                            <FAIcon icon={faUserPlus} /> Add Team Member
                        </button>
                    </div>

                    {showAddMember && (
                        <form className={styles.addForm} onSubmit={handleAddMember}>
                            <input 
                                type="text" 
                                placeholder="Investigator Name" 
                                value={newMember.name} 
                                onChange={e => setNewMember({...newMember, name: e.target.value})}
                                required
                            />
                            <input 
                                type="text" 
                                placeholder="Designation (e.g. Inspector)" 
                                value={newMember.designation} 
                                onChange={e => setNewMember({...newMember, designation: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder="Contact Number" 
                                value={newMember.phone} 
                                onChange={e => setNewMember({...newMember, phone: e.target.value})}
                            />
                            <select 
                                value={newMember.role} 
                                onChange={e => setNewMember({...newMember, role: e.target.value})}
                            >
                                <option value="employee">Investigator</option>
                                <option value="admin">Administrator</option>
                            </select>
                            <button type="submit" className="btn btn-primary">Grant Access</button>
                            <button type="button" className="btn btn-outline" onClick={() => setShowAddMember(false)}>Cancel</button>
                        </form>
                    )}

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Identity</th>
                                    <th>Clearance</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((p) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className={styles.userInfo}>
                                                <strong>{p.display_name || 'Authorized User'}</strong>
                                                <span className={styles.uid}>{p.id.slice(0,12)}...</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${p.role === 'admin' ? styles.badgeAdmin : styles.badgeEmployee}`}>
                                                {p.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className={styles.deleteBtn}
                                                onClick={() => handleDeleteUser(p.id)}
                                                title="Revoke Access"
                                            >
                                                <FAIcon icon={faTrashAlt} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </PageLoader>
    );
}
