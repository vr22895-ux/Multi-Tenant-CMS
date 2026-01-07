import { createClient } from '@/lib/supabase';
import Link from 'next/link';

import { Calendar, User, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Industry Insights & News - Metal Ministry Inc.',
    description: 'Latest updates, technical articles, and news from Metal Ministry Inc.',
};

export default async function BlogsIndexPage() {
    const supabase = createClient();

    // Fetch only BLOG posts
    const { data: posts, error } = await supabase
        .from('post')
        .select('*')
        .eq('company_id', process.env.NEXT_PUBLIC_COMPANY_ID!)
        .eq('type', 'blog')
        .order('published_at', { ascending: false });

    if (error) {
        console.error("Error fetching blogs:", error);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Blog</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Industry Insights</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Stay updated with the latest news, technical guides, and market trends in the metal industry.
                    </p>
                </div>

                {!posts || posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
                        <p className="text-gray-500">Check back soon for our latest updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blogs/${post.slug}`}
                                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {/* Placeholder Image or Regex Extract from Content if possible */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-90 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                        <span className="text-white/20 text-6xl font-black select-none">BLOG</span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(post.published_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={14} />
                                            Admin
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                                        {post.meta_description || "Read our latest article to learn more about this topic..."}
                                    </p>

                                    <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:underline">
                                        Read Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
