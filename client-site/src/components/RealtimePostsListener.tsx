'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RealtimePostsListener() {
    const router = useRouter();

    useEffect(() => {
        // 1. Subscribe to changes in the 'post' table
        const channel = supabase
            .channel('realtime-posts')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'post',
                },
                () => {
                    // 2. When a change happens, refresh the data
                    console.log('⚡ Realtime Update: Refreshing Data...');
                    router.refresh();
                }
            )
            .subscribe((status) => {
                console.log('🔌 Realtime Connection Status:', status);
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Listening for updates on "post" table...');
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Realtime Connection Error! Check browser console network tab.');
                }
            });

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);

    // This component renders nothing effectively
    return null;
}
