// src/app/actions.ts
'use server';

import { supabase } from '@/lib/supabase';
import { Company, CreatePostInput } from '@/types';
import { revalidatePath } from 'next/cache';
import { parse } from 'papaparse';
import * as mammoth from 'mammoth';


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

export async function getPosts(): Promise<any[]> {
    const { data: companiesData } = await supabase.from('companies').select('id, name, domain');
    const companyMap = new Map();
    if (companiesData) {
        companiesData.forEach((c: any) => companyMap.set(c.id, c));
    }

    const { data, error } = await supabase
        .from('post')
        .select(`id, title, slug, type, published_at, company_id`)
        .order('published_at', { ascending: false })
        .limit(20);
        
    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    
    return data.map((post: any) => ({
        ...post,
        company: companyMap.get(post.company_id) || null
    }));
}

export async function createPost(postData: CreatePostInput) {
    // 1. Save to Database (Multiple Inserts)
    const inserts = postData.company_ids.map(id => ({
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        type: postData.type,
        company_id: id
    }));

    const { data, error } = await supabase
        .from('post')
        .insert(inserts)
        .select();

    if (error) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
    }

    // 2. Trigger "Push" (Revalidation)
    // Fetch all relevant company domains
    const { data: companies } = await supabase
        .from('companies')
        .select('id, domain')
        .in('id', postData.company_ids);

    if (companies && companies.length > 0) {
        let warningMessage = '';
        for (const company of companies) {
            try {
                // In a real scenario, we would use a secret key here 
                const revalidateUrl = `https://${company.domain}/api/revalidate?slug=${postData.slug}&secret=${process.env.REVALIDATION_SECRET}`;
                console.log(`[Mock Push] Triggering revalidation on: ${revalidateUrl}`);
                // await fetch(revalidateUrl); 
            } catch (err) {
                console.error(`Failed to trigger revalidation for ${company.domain}:`, err);
                warningMessage = 'Some revalidations failed.';
            }
        }
        if (warningMessage) {
            return { success: true, data, warning: warningMessage };
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

export async function parseUploadedFile(formData: FormData) {
    try {
        const file = formData.get('file') as File | null;
        if (!file) return { success: false, error: 'No file provided' };

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.toLowerCase();

        let extractedText = '';

        if (filename.endsWith('.csv')) {
            const text = buffer.toString('utf-8');
            const result = parse(text, { header: true, skipEmptyLines: true });
            return { success: true, isCsv: true, data: result.data as any[] };
        } else if (filename.endsWith('.docx')) {
            const result = await mammoth.convertToHtml({ buffer });
            extractedText = result.value;
        } else if (filename.endsWith('.txt')) {
            extractedText = buffer.toString('utf-8');
        } else {
            return { success: false, error: 'Unsupported file type.' };
        }

        // Auto-extract a title if we just have text (first line usually)
        const lines = extractedText.split('\n').filter(l => l.trim().length > 0);
        const title = lines.length > 0 ? lines[0].substring(0, 100).trim() : 'Document Extract';

        return { success: true, isCsv: false, data: [{ title, content: extractedText }] };
    } catch (err: any) {
        console.error('Parse error:', err);
        return { success: false, error: err.message };
    }
}