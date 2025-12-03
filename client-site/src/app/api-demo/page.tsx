import { COMPANY_ID } from '@/lib/supabase';

// This page demonstrates how an EXTERNAL website would fetch data
// using our REST API instead of a direct database connection.
export default async function ApiDemoPage() {
    // In a real app, this URL would be https://your-admin-dashboard.com
    const API_BASE_URL = 'http://localhost:3000';

    // Fetch from the API
    const res = await fetch(`${API_BASE_URL}/api/external/posts?company_id=${COMPANY_ID}`, {
        cache: 'no-store', // Always fetch fresh data for this demo
    });

    const { posts, error } = await res.json();

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>API Demo Mode:</strong> This page is fetching data via HTTP Request from
                                <code className="bg-yellow-100 px-1 rounded mx-1">{API_BASE_URL}/api/external/posts</code>
                                instead of the database.
                            </p>
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">External API Integration Demo</h1>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md">
                        Error: {error}
                    </div>
                )}

                <div className="space-y-4">
                    {posts?.map((post: any) => (
                        <div key={post.id} className="block bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                            <div className="text-sm text-gray-500">
                                Published: {new Date(post.published_at).toLocaleDateString()}
                            </div>
                            <p className="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
