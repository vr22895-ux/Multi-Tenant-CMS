// client-site/src/app/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import RealtimePostsListener from '@/components/RealtimePostsListener';

export const revalidate = 0; // Ensure this page is always fresh for testing

export default async function Home() {
  const { data: posts } = await supabase
    .from('post')
    .select('*, companies(name)')
    .eq('company_id', process.env.NEXT_PUBLIC_COMPANY_ID) // Filter by the specific company
    .order('published_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RealtimePostsListener />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Blog Posts</h1>

        <div className="space-y-4">
          {posts?.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
              <div className="text-sm text-gray-500">
                By {post.companies?.name} • {new Date(post.published_at).toLocaleDateString()}
              </div>
            </Link>
          ))}

          {(!posts || posts.length === 0) && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border-2 border-dashed">
              No posts found. Go to the Admin Dashboard to create one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
