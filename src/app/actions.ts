'use server';

import { supabase } from '@/lib/supabase';
import { Company, CreatePostInput } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching companies:', error);
        throw new Error('Failed to fetch companies');
    }

    return data || [];
}

export async function createPost(postData: CreatePostInput) {
    // 1. Save to Database
    const { data, error } = await supabase
        .from('post')
        .insert([postData])
        .select()
        .single();

    if (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
    }

    // 2. Trigger "Push" (Revalidation)
    // We need to fetch the company domain to know where to push
    const { data: company } = await supabase
        .from('companies')
        .select('domain')
        .eq('id', postData.company_id)
        .single();

    if (company) {
        try {
            // In a real scenario, we would use a secret key here 
            const revalidateUrl = `https://${company.domain}/api/revalidate?slug=${postData.slug}&secret=${process.env.REVALIDATION_SECRET}`;

            // We don't await this strictly to avoid blocking the UI if the remote site is slow,
            // but for an admin dashboard, it's often better to await to confirm it worked.
            // For now, we'll just log it as we don't have the real sites yet.
            console.log(`[Mock Push] Triggering revalidation on: ${revalidateUrl}`);

            // await fetch(revalidateUrl); 
        } catch (err) {
            console.error('Failed to trigger revalidation:', err);
            // We don't fail the whole request just because revalidation failed, 
            // but we should warn the user.
            return { success: true, data, warning: 'Post saved but failed to push to live site.' };
        }
    }

    revalidatePath('/');
    return { success: true, data };
}

export async function createCompany(name: string, domain: string) {
    // Generate a simple API key (in real app, use crypto)
    const api_key = `key_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}`;

    const { data, error } = await supabase
        .from('companies')
        .insert([{ name, domain, api_key }])
        .select()
        .single();

    if (error) {
        console.error('Error creating company:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true, data };
}