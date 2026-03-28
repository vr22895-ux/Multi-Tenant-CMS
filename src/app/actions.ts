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
        .limit(50); // Increased limit slightly for history visibility
        
    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    
    return data.map((post: any) => ({
        ...post,
        company: companyMap.get(post.company_id) || null
    }));
}

export async function deletePost(id: string) {
    const { error } = await supabase
        .from('post')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/');
    return { success: true };
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

        if (filename.endsWith('.csv')) {
            const text = buffer.toString('utf-8');
            const result = parse(text, { header: true, skipEmptyLines: true });
            return { success: true, isCsv: true, data: result.data as any[] };
        } else if (filename.endsWith('.docx')) {
            const result = await mammoth.convertToHtml({ buffer });
            const html = result.value;

            // Smart Splitter for Multi-Blog Word Docs
            // Strategy: Split by <h1> or <h2> tags first. 
            // If none, split by paragraphs starting with "1.", "2." etc.
            
            let blogs: any[] = [];
            
            // Try splitting by H1/H2
            const hMatch = html.match(/<(h1|h2)>.*?<\/\1>/gi);
            if (hMatch && hMatch.length > 1) {
                const parts = html.split(/<(?:h1|h2)>.*?<\/(?:h1|h2)>/gi);
                // parts[0] is usually empty or intro text if there are headers
                hMatch.forEach((header, index) => {
                    const title = header.replace(/<[^>]*>/g, '').trim();
                    const content = header + (parts[index + 1] || '');
                    if (title && content) {
                        blogs.push({ 
                            title, 
                            content,
                            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7)
                        });
                    }
                });
            } 
            
            // Fallback: Split by numbered patterns if no clear headers found or only one blog found
            if (blogs.length <= 1) {
                // Look for patterns like "1.", "1) ", "Blog 1:"
                const pattern = /<p>(?:\d+[\.\)]|Blog\s+\d+:)\s*<strong>?(.*?)<\/strong>?<\/p>/gi;
                let matches = Array.from(html.matchAll(pattern));
                
                if (matches.length > 1) {
                    blogs = []; // Reset if we found a better split pattern
                    const parts = html.split(pattern);
                    // Match 0 title is in matches[0][1], content starts after it.
                    matches.forEach((match, index) => {
                        const title = match[1].replace(/<[^>]*>/g, '').trim() || `Blog Section ${index + 1}`;
                        const content = `<p><strong>${title}</strong></p>` + (parts[index * 2 + 2] || '');
                        blogs.push({ 
                            title, 
                            content,
                            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7)
                        });
                    });
                }
            }

            // Final fallback: Single blog
            if (blogs.length === 0) {
                const lines = html.replace(/<[^>]*>/g, '\n').split('\n').filter(l => l.trim().length > 0);
                const title = lines.length > 0 ? lines[0].substring(0, 100).trim() : 'Document Extract';
                blogs = [{ 
                    title, 
                    content: html,
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                }];
            }

            return { success: true, isCsv: false, data: blogs };
        } else if (filename.endsWith('.txt')) {
            const text = buffer.toString('utf-8');
            const lines = text.split('\n').filter(l => l.trim().length > 0);
            const title = lines.length > 0 ? lines[0].substring(0, 100).trim() : 'Text Extract';
            return { 
                success: true, 
                isCsv: false, 
                data: [{ 
                    title, 
                    content: text.replace(/\n/g, '<br>'), 
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
                }] 
            };
        } else {
            return { success: false, error: 'Unsupported file type.' };
        }
    } catch (err: any) {
        console.error('Parse error:', err);
        return { success: false, error: err.message };
    }
}