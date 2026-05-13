import { supabase } from './supabase/client';

export interface EvidenceItem {
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

export const evidenceService = {
    async getAll() {
        const { data, error } = await supabase
            .from('evidence')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map snake_case to camelCase
        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            typeText: item.type_text,
            status: item.status,
            statusText: item.status_text,
            date: item.created_at,
            caseRef: item.case_ref,
            collector: item.collector,
            notes: item.notes,
            tags: item.tags,
            imageSrc: item.image_src
        }));
    },

    async upload(item: EvidenceItem) {
        const { error } = await supabase.from('evidence').insert([{
            id: item.id,
            title: item.title,
            type: item.type,
            type_text: item.typeText,
            status: item.status,
            status_text: item.statusText,
            date: item.date,
            case_ref: item.caseRef,
            collector: item.collector,
            notes: item.notes,
            tags: item.tags,
            image_src: item.imageSrc
        }]);
        
        if (error) throw error;
    },

    subscribe(callback: () => void) {
        return supabase
            .channel('evidence-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'evidence' }, () => {
                callback();
            })
            .subscribe();
    }
};
