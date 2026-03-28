'use client';

import { useState, useEffect, useRef } from 'react';
import { Company, CreatePostInput } from '@/types';
import { createPost, getCompanies, createCompany, parseUploadedFile, getPosts, deletePost } from '@/app/actions';
import { logout } from '@/app/login/actions';
import RichTextEditor from './RichTextEditor';

export default function Dashboard() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
    const [companySearch, setCompanySearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCompanyDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const refreshData = () => {
        getCompanies()
            .then(setCompanies)
            .catch((err) => setMessage({ type: 'error', text: 'Failed to load companies' }));
        getPosts().then(setPosts);
    };

    useEffect(() => {
        refreshData();
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
            refreshData(); // Refresh dropdown and history
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to create company' });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCompanyIds.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one company' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const postData: CreatePostInput = {
            title,
            slug,
            content,
            company_ids: selectedCompanyIds,
            type
        };

        const result = await createPost(postData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Post published successfully to selected companies!' });
            // Reset form
            setTitle('');
            setSlug('');
            setContent('');
            setType('product');
            refreshData();
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to create post' });
        }
        setLoading(false);
    };

    const handleDeletePost = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete the blog post "${title}"?`)) return;

        setLoading(true);
        const result = await deletePost(id);
        if (result.success) {
            setMessage({ type: 'success', text: 'Post deleted successfully.' });
            refreshData();
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to delete post.' });
        }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setMessage({ type: 'success', text: 'Parsing document...' });

        const formData = new FormData();
        formData.append('file', file);

        const result = await parseUploadedFile(formData);

        if (result.success && result.data && result.data.length > 0) {
            let successCount = 0;
            
            // Process all items in result.data (could be 1 or many)
            for (const row of result.data) {
                if (!row.title && !row.content) continue;
                
                // Determine which companies to target for this row
                // Mapping Priority: 1. CSV/Word mapping -> 2. Manual selection -> 3. Error
                let targetCompanyIds = selectedCompanyIds;
                const rowMappedValue = (row.company || row.domain || '').toString().trim();
                
                if (rowMappedValue) {
                    const matchedCompany = companies.find(c => 
                        c.name.toLowerCase() === rowMappedValue.toLowerCase() || 
                        c.domain.toLowerCase() === rowMappedValue.toLowerCase()
                    );
                    if (matchedCompany) {
                        targetCompanyIds = [matchedCompany.id];
                    }
                }

                if (targetCompanyIds.length === 0) continue;

                // For Word docs, row.slug is already generated by the server. 
                // For CSV, we generate it here or in createPost.
                const finalSlug = row.slug || (row.title || 'batch-post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

                const postResult = await createPost({
                    title: row.title || 'Untitled Batch Post',
                    slug: finalSlug,
                    content: row.content || '',
                    company_ids: targetCompanyIds,
                    type: 'blog'
                });

                if (postResult.success) {
                    successCount++;
                }
            }
            
            if (successCount === 0 && result.data.length > 0) {
                 setMessage({ type: 'error', text: 'Failed to post blogs. Ensure you selected a company or the file includes company mapping.' });
            } else {
                 setMessage({ type: 'success', text: `Successfully published ${successCount} article(s)!` });
                 // If it was just one blog and we are NOT doing bulk CSV, maybe populate the editor too?
                 // But user wants "multiple blogs to be posted", so jumping to bulk is better.
            }
            refreshData();
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to parse file.' });
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
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
                                        <div className="space-y-2" ref={dropdownRef}>
                                            <label className="block text-sm font-semibold text-gray-700">
                                                Target Audience (Companies)
                                            </label>
                                            <div className="relative">
                                                <div 
                                                    className="appearance-none flex justify-between items-center w-full px-4 py-3 pr-4 rounded-lg shadow-sm border border-gray-300 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white sm:text-sm font-medium text-gray-700 cursor-pointer transition-all"
                                                    onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                                                >
                                                    <span className="truncate pr-4">
                                                        {selectedCompanyIds.length === 0 
                                                            ? 'Select a company...' 
                                                            : selectedCompanyIds.length === companies.length 
                                                                ? 'All Companies Selected' 
                                                                : `${selectedCompanyIds.length} companies selected`}
                                                    </span>
                                                    <div className="pointer-events-none flex items-center text-gray-500 shrink-0">
                                                        <svg className={`h-4 w-4 transition-transform duration-200 ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>

                                                {isCompanyDropdownOpen && (
                                                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
                                                        {/* Search bar inside Dropdown */}
                                                        <div className="p-2 border-b border-gray-100 bg-white">
                                                            <div className="relative">
                                                                <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Search companies..." 
                                                                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800"
                                                                    value={companySearch}
                                                                    onChange={(e) => setCompanySearch(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-2 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-2">Companies</span>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => {
                                                                    const displayedCompanies = companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()) || c.domain.toLowerCase().includes(companySearch.toLowerCase()));
                                                                    const allDisplayedSelected = displayedCompanies.every(c => selectedCompanyIds.includes(c.id)) && displayedCompanies.length > 0;
                                                                    
                                                                    if (allDisplayedSelected) {
                                                                        // Deselect displayed
                                                                        setSelectedCompanyIds(selectedCompanyIds.filter(id => !displayedCompanies.find(c => c.id === id)));
                                                                    } else {
                                                                        // Select all displayed
                                                                        const newSelects = [...selectedCompanyIds];
                                                                        displayedCompanies.forEach(c => {
                                                                            if (!newSelects.includes(c.id)) newSelects.push(c.id);
                                                                        });
                                                                        setSelectedCompanyIds(newSelects);
                                                                    }
                                                                }} 
                                                                className="text-xs text-blue-600 hover:text-blue-800 font-bold tracking-wide cursor-pointer px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                                            >
                                                                Select All (Filtered)
                                                            </button>
                                                        </div>
                                                        <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                                                            {companies.length === 0 ? (
                                                                <div className="p-4 text-sm text-gray-500 text-center">No companies registered yet.</div>
                                                            ) : (
                                                                companies.filter(company => 
                                                                    company.name.toLowerCase().includes(companySearch.toLowerCase()) || 
                                                                    company.domain.toLowerCase().includes(companySearch.toLowerCase())
                                                                ).map((company) => (
                                                                    <label key={company.id} className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors m-0">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer shrink-0 mr-3"
                                                                            checked={selectedCompanyIds.includes(company.id)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) {
                                                                                    setSelectedCompanyIds([...selectedCompanyIds, company.id]);
                                                                                } else {
                                                                                    setSelectedCompanyIds(selectedCompanyIds.filter(id => id !== company.id));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="text-sm font-medium text-gray-900 truncate">{company.name}</span>
                                                                            <span className="text-[11px] text-gray-500 truncate">{company.domain}</span>
                                                                        </div>
                                                                    </label>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
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
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-gray-700">
                                                    Post Title
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={title}
                                                        onChange={handleTitleChange}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm placeholder-gray-400"
                                                        placeholder="Enter an engaging title..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <label className="flex flex-col cursor-pointer sm:w-max">
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                        Upload Word, CSV
                                                    </span>
                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef}
                                                        className="hidden" 
                                                        accept=".csv,.docx,.txt"
                                                        onChange={handleFileUpload} 
                                                    />
                                                </label>
                                                <div className="mt-2 flex flex-col gap-1">
                                                    <p className="text-xs text-gray-500 ml-1"> Bulk-publish multiple blogs from a single file.</p>
                                                    <details className="text-[10px] text-blue-600 cursor-pointer ml-1 select-none">
                                                        <summary className="hover:underline font-medium">View Formatting Guide</summary>
                                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 space-y-2">
                                                            <p><strong>Word (.docx):</strong> Use H1 or H2 headers for each blog title. The text following will be the content.</p>
                                                            <p><strong>CSV:</strong> Include <code>title</code> and <code>content</code> columns. Add <code>company</code> or <code>domain</code> for auto-mapping.</p>
                                                        </div>
                                                    </details>
                                                </div>
                                            </div>
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
                                        <RichTextEditor 
                                            content={content} 
                                            onChange={(newContent) => setContent(newContent)} 
                                        />
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

                        {/* Recent History */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50">
                                <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Recent Publications
                                </h3>
                            </div>
                            <ul className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                                {posts.length === 0 ? (
                                    <div className="p-6 text-sm text-gray-500 text-center">No posts published yet.</div>
                                ) : (
                                    posts.map(post => (
                                        <li key={post.id} className="p-4 hover:bg-gray-50 transition-colors group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-semibold text-gray-900 line-clamp-2 text-sm" title={post.title}>{post.title}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {post.type === 'blog' && (
                                                        <button 
                                                            onClick={() => handleDeletePost(post.id, post.title)}
                                                            className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                            title="Delete Blog"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    )}
                                                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                                        {post.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 flex justify-between items-center mt-2">
                                                <span className="truncate bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-sm max-w-[150px]">{post.company?.name || 'Multiple'}</span>
                                                <span className="shrink-0 ml-2">{new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
