'use client';

import { useState, useEffect } from 'react';
import { Company, CreatePostInput } from '@/types';
import { createPost, getCompanies, createCompany } from '@/app/actions';
import { logout } from '@/app/login/actions';

export default function Dashboard() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

    // Post State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<'product' | 'blog'>('product');

    // Company State
    const [showCompanyForm, setShowCompanyForm] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyDomain, setNewCompanyDomain] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const refreshCompanies = () => {
        getCompanies()
            .then(setCompanies)
            .catch((err) => setMessage({ type: 'error', text: 'Failed to load companies' }));
    };

    useEffect(() => {
        refreshCompanies();
    }, []);

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const result = await createCompany(newCompanyName, newCompanyDomain);

        if (result.success) {
            setMessage({ type: 'success', text: `Company "${newCompanyName}" created! ID: ${result.data.id}` });
            setNewCompanyName('');
            setNewCompanyDomain('');
            setShowCompanyForm(false);
            refreshCompanies(); // Refresh the dropdown
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to create company' });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompanyId) {
            setMessage({ type: 'error', text: 'Please select a company' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const postData: CreatePostInput = {
            title,
            slug,
            content,
            company_id: selectedCompanyId,
            type
        };

        const result = await createPost(postData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Post published successfully!' });
            // Reset form
            setTitle('');
            setSlug('');
            setContent('');
            setType('product');
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to create post' });
        }
        setLoading(false);
    };

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                C
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">CMS Admin</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">Logged in as Admin</div>
                            <form action={logout}>
                                <button
                                    type="submit"
                                    className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </form>
                            <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300"></div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Content Dashboard</h1>
                        <p className="mt-2 text-lg text-gray-600">Manage your multi-tenant blog network from one place.</p>
                    </div>

                    <button
                        onClick={() => setShowCompanyForm(!showCompanyForm)}
                        className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    >
                        {showCompanyForm ? 'Cancel Registration' : '🏢 Register New Company'}
                    </button>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-lg border flex items-center gap-3 shadow-sm animate-fade-in-down ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                        <span className="text-xl">{message.type === 'success' ? '✅' : '⚠️'}</span>
                        <p className="font-medium">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Editor */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Company Registration Card (Conditional) */}
                        {showCompanyForm && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ring-1 ring-black/5 animate-fade-in-up">
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                                    <h2 className="text-xl font-bold text-white">Register New Tenant</h2>
                                    <p className="text-gray-300 text-sm mt-1">Create a new isolated environment for a client.</p>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleCreateCompany} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Company Name</label>
                                                <input
                                                    type="text"
                                                    value={newCompanyName}
                                                    onChange={(e) => setNewCompanyName(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                                    placeholder="e.g. Acme Corp"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Domain</label>
                                                <input
                                                    type="text"
                                                    value={newCompanyDomain}
                                                    onChange={(e) => setNewCompanyDomain(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                                    placeholder="e.g. acme.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {loading ? 'Creating...' : 'Create Tenant Environment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Editor Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="border-b border-gray-100 px-8 py-6 flex items-center justify-between bg-white">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Write New Post</h2>
                                    <p className="text-sm text-gray-500 mt-1">Create content for your selected tenant.</p>
                                </div>
                                <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </div>
                            </div>

                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Company Selector */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Target Audience (Company)
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedCompanyId}
                                                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                                                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all appearance-none bg-gray-50 hover:bg-white"
                                                    required
                                                >
                                                    <option value="">Select a company...</option>
                                                    {companies.map((company) => (
                                                        <option key={company.id} value={company.id}>
                                                            {company.name} ({company.domain})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Type Selector */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Content Type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value as 'product' | 'blog')}
                                                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all appearance-none bg-gray-50 hover:bg-white"
                                                    required
                                                >
                                                    <option value="product">📦 Product</option>
                                                    <option value="blog">📝 Blog Post</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title & Slug */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Post Title
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={handleTitleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm placeholder-gray-400"
                                                placeholder="Enter an engaging title..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-700">
                                                URL Slug
                                            </label>
                                            <div className="flex rounded-lg shadow-sm">
                                                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                    {type === 'blog' ? '/blog/' : '/products/'}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={slug}
                                                    onChange={(e) => setSlug(e.target.value)}
                                                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all sm:text-sm text-gray-600 bg-gray-50"
                                                    placeholder="post-url-slug"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Content
                                        </label>
                                        <div className="relative rounded-lg shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                rows={12}
                                                className="block w-full px-4 py-3 rounded-lg border-none resize-y focus:ring-0 sm:text-sm font-mono text-gray-800"
                                                placeholder="# Write your masterpiece...\n\nMarkdown is supported."
                                                required
                                            />
                                            <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                                                Markdown Supported
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {loading ? 'Processing...' : 'Ready to publish'}
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    🚀 Push to Live Site
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats / Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <span className="text-gray-600 font-medium">Active Companies</span>
                                    <span className="text-2xl font-bold text-gray-900">{companies.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                                    <span className="text-blue-700 font-medium">System Status</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Operational
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
