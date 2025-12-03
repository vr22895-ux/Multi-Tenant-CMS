export interface Company {
    id: string;
    name: string;
    domain: string;
    api_key: string;
}

export interface Post {
    id: string;
    title: string | null;
    content: string;
    slug: string;
    company_id: string;
    published_at: string;
}

export type CreatePostInput = Omit<Post, 'id' | 'published_at'>;
