import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase';

const BASE_URL = 'https://metalministry.in'; // Update this if your domain is different

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient();

    // Fetch all products
    const { data: products } = await supabase
        .from('post')
        .select('slug, updated_at')
        .eq('type', 'product')
        .eq('company_id', process.env.NEXT_PUBLIC_COMPANY_ID!);

    const productEntries: MetadataRoute.Sitemap = (products || []).map((product) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact-us`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...productEntries,
    ];
}
