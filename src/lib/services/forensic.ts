import { supabase } from '../supabase/client';

export interface ProfileRow {
    id: string;
    display_name: string | null;
    role: string;
    phone?: string | null;
    designation?: string | null;
    created_at: string;
}

export interface EvidenceRow {
    id: string;
    title: string;
    type: string;
    typeText: string;
    status: string;
    statusText: string;
    date: string;
    caseRef: string;
    collector: string;
    notes: string;
    tags: string[];
    imageSrc: string;
}

export interface SharedFileRow {
    id: string;
    original_name: string;
    storage_path: string;
    uploaded_by: string;
    uploader_name: string | null;
    created_at: string;
    case_ref?: string;
}

export interface Activity {
    id: string;
    title: string;
    desc: string;
    time: string;
    case: string;
    user_name?: string;
}

export interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
    isOwn: boolean;
    senderId: string | null;
}

export const forensicService = {
    async getEvidence(): Promise<EvidenceRow[]> {
        const { data, error } = await supabase
            .from('evidence')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            typeText: item.type_text,
            status: item.status,
            statusText: item.status_text,
            date: item.created_at || item.date,
            caseRef: item.case_ref,
            collector: item.collector,
            notes: item.notes,
            tags: item.tags || [],
            imageSrc: item.image_src
        }));
    },

    async listProfiles(): Promise<ProfileRow[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getProfile(userId: string): Promise<ProfileRow | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) return null;
        return data;
    },

    async listSharedFiles(): Promise<SharedFileRow[]> {
        const { data, error } = await supabase
            .from('shared_files')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return [];
        return data || [];
    },

    async getActivities(): Promise<Activity[]> {
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) return [];
        return (data || []).map((a: any) => ({
            id: a.id,
            title: a.title || 'Action',
            desc: a.description || a.action || '',
            time: a.created_at,
            case: a.case_ref || 'General',
            user_name: a.user_name || 'System'
        }));
    },

    async getMessages(currentUserId: string | null): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(100);

        if (error) return [];
        return (data || []).map((m: any) => ({
            id: m.id,
            sender: m.sender_name || 'Anonymous',
            text: m.content || '',
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: m.sender_id === currentUserId,
            senderId: m.sender_id
        }));
    },

    async sendMessage(text: string, userId: string, displayName: string) {
        const { error } = await supabase.from('messages').insert([{
            content: text,
            sender_id: userId,
            sender_name: displayName,
            case_ref: 'CS-2024-001' // Default for demo
        }]);
        if (error) throw error;
    },

    async uploadSharedFile(file: File, userId: string) {
        const path = `${userId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from('shared-resources')
            .upload(path, file);
        
        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('shared_files').insert([{
            original_name: file.name,
            storage_path: path,
            uploaded_by: userId,
            uploader_name: 'You', // In a real app, fetch from profile
            case_ref: 'CS-2024-001'
        }]);

        if (dbError) throw dbError;
    },

    async getSharedFileSignedUrl(path: string) {
        const { data, error } = await supabase.storage
            .from('shared-resources')
            .createSignedUrl(path, 3600);
        
        if (error) throw error;
        return data.signedUrl;
    },

    async deleteSharedFile(id: string, path: string, uploadedBy: string, currentUserId: string) {
        if (uploadedBy !== currentUserId) throw new Error('Not authorized to delete this file');
        
        const { error: storageError } = await supabase.storage
            .from('shared-resources')
            .remove([path]);
        
        if (storageError) throw storageError;

        const { error: dbError } = await supabase.from('shared_files').delete().eq('id', id);
        if (dbError) throw dbError;
    },

    async clearAllData() {
        await Promise.allSettled([
            supabase.from('evidence').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('activities').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
            supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        ]);
    },

    async seedDemoData() {
        const demoEvidence = [
            {
                title: 'Crime Scene Photo 1',
                type: 'typeImage',
                type_text: 'Image',
                status: 'statusAnalyzed',
                status_text: 'Analyzed',
                case_ref: 'CS-2024-001',
                collector: 'Det. Miller',
                notes: 'Primary scene entry point',
                tags: ['entry', 'exterior'],
                image_src: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Suspect Footprints',
                type: 'typeImage',
                type_text: 'Image',
                status: 'statusProcessing',
                status_text: 'Processing',
                case_ref: 'CS-2024-001',
                collector: 'Tech. Rodriguez',
                notes: 'Found near North exit',
                tags: ['trace', 'footprint'],
                image_src: 'https://images.unsplash.com/photo-1518005020250-eccdd5f1d954?auto=format&fit=crop&q=80&w=1000'
            }
        ];

        const { error } = await supabase.from('evidence').insert(demoEvidence);
        if (error) throw error;
    },

    async deleteEvidence(id: string) {
        const { error } = await supabase
            .from('evidence')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async uploadEvidence(item: any) {
        const { error } = await supabase.from('evidence').insert([{
            id: item.id,
            title: item.title,
            type: item.type,
            type_text: item.typeText,
            status: item.status,
            status_text: item.statusText,
            case_ref: item.caseRef,
            collector: item.collector,
            notes: item.notes,
            tags: item.tags,
            image_src: item.imageSrc,
            created_at: item.date
        }]);
        if (error) throw error;
    },

    async startMeeting(roomSlug: string, userId: string) {
        // Optional audit row for meeting start
        await supabase.from('activities').insert([{
            title: 'Meeting Started',
            description: `User joined video room: ${roomSlug}`,
            user_id: userId,
            case_ref: roomSlug.startsWith('CS-') ? roomSlug : 'General'
        }]);
    },

    async updateEvidenceStatus(id: string, status: string, statusText: string) {
        const { error } = await supabase
            .from('evidence')
            .update({ status, status_text: statusText })
            .eq('id', id);
        if (error) throw error;
    },

    async updateProfile(id: string, updates: Partial<ProfileRow>) {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id);
        if (error) throw error;
    },

    async deleteProfile(id: string) {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async addTeamMember(data: { id: string; display_name: string; role: string; phone?: string; designation?: string }) {
        const { error } = await supabase
            .from('profiles')
            .insert([data]);
        if (error) throw error;
    },

    subscribe(table: string, callback: () => void) {
        const channel = supabase
            .channel(`realtime-${table}`)
            .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
                callback();
            })
            .subscribe();

        return {
            unsubscribe: () => {
                void supabase.removeChannel(channel);
            }
        };
    }
};
