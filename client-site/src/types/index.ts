export interface Post {
    id: string;
    title: string | null;
    content: string;
    slug: string;
    company_id: string;
    published_at: string;
    // SEO Fields
    meta_title?: string | null;
    meta_description?: string | null;
    keywords?: string | null;
    canonical_url?: string | null;
}

export interface Company {
    id: string;
    name: string;
    domain: string;
}
