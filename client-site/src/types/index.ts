export interface Post {
    id: string;
    title: string | null;
    content: string;
    slug: string;
    company_id: string;
    published_at: string;
}

export interface Company {
    id: string;
    name: string;
    domain: string;
}
