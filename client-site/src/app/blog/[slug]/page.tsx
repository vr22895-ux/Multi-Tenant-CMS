// client-site/src/app/blog/[slug]/page.tsx
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { notFound } from 'next/navigation';

// 1. Generate Static Params (The "Magic" for SEO)
// This tells Next.js which pages to build at build time.
export async function generateStaticParams() {
    const { data: posts } = await supabase.from('post').select('slug');
    return (posts || []).map((post) => ({
        slug: post.slug,
    }));
}

// 2. Fetch Data for the Page
async function getPost(slug: string) {
    const { data, error } = await supabase
        .from('post')
        .select('*, companies(name, domain)')
        .eq('slug', slug)
        .eq('company_id', process.env.NEXT_PUBLIC_COMPANY_ID) // Ensure we only fetch for this company
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

// 3. The Page Component
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-8">
                <div className="text-sm text-gray-500 mb-2">
                    Published by {post.companies?.name} • {new Date(post.published_at).toLocaleDateString()}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl mb-4">
                    {post.title}
                </h1>
            </header>

            <div className="prose prose-lg prose-blue mx-auto text-gray-700">
                {/* In a real app, you'd use a Markdown renderer here */}
                <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
        </article>
    );
}
