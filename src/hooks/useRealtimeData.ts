'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useRealtimeData<T>(initialData: T, interval = 5000) {
    const [data, setData] = useState<T>(initialData);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const updateData = useCallback((updater: (prev: T) => T) => {
        setData(prev => {
            const next = updater(prev);
            setLastUpdate(new Date());
            return next;
        });
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setLastUpdate(new Date());
        }, interval);
        return () => clearInterval(timer);
    }, [interval]);

    return { data, setData, updateData, lastUpdate };
}

export function useLiveStats() {
    const [stats, setStats] = useState({
        activeCases: 0,
        evidenceItems: 0,
        teamMembers: 0,
        aiAnalyses: 0,
    });

    const fetchStats = useCallback(async () => {
        try {
            const [evidenceCount, profiles, activities, activeCases] = await Promise.all([
                supabase.from('evidence').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('activities').select('id', { count: 'exact', head: true }),
                supabase.from('evidence').select('case_ref', { count: 'exact', head: true })
            ]);

            setStats({
                activeCases: activeCases.count || 0,
                evidenceItems: evidenceCount.count || 0,
                teamMembers: profiles.count || 0,
                aiAnalyses: activities.count || 0,
            });
        } catch (err) {
            console.error('Error fetching live stats:', err);
        }
    }, []);

    useEffect(() => {
        void fetchStats();
        
        // Listen for real-time changes
        const channel = supabase
            .channel('db-stats-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'evidence' }, fetchStats)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchStats]);

    return stats;
}
