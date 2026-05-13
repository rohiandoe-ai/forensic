'use client';

import PageLoader from '@/components/PageLoader';
import MeetingPanel from '@/components/admin/MeetingPanel';
import FAIcon from '@/components/FontAwesome';
import { faArrowLeft, faVideo } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import styles from '../page.module.css';

export default function AdminMeetingsPage() {
    return (
        <PageLoader type="admin">
            <div className={styles.admin}>
                <div className={styles.intro}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <Link href="/admin" className="btn btn-outline btn-sm">
                            <FAIcon icon={faArrowLeft} /> Back
                        </Link>
                        <h1 style={{ margin: 0 }}>
                            <FAIcon icon={faVideo} /> Investigation Meetings
                        </h1>
                    </div>
                    <p>
                        Generate secure Jitsi Meet links for real-time scene collaboration and share them instantly with authorized personnel. No external account or OAuth required.
                    </p>
                </div>

                <MeetingPanel />
            </div>
        </PageLoader>
    );
}
