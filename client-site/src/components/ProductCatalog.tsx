'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { imageMap } from '@/lib/imageMap';

type Product = {
    title: string;
    slug: string;
    meta_description: string;
};

// Helper function repeated here or imported if utility exists (keeping self-contained for component)
function findBestImage(slug: string): string | null {
    if (!slug) return null;
    let match = imageMap.find(img => img.toLowerCase().startsWith(slug.toLowerCase()));
    if (!match) {
        const cleanSlug = slug.replace(/-manufacturer|-exporter|-supplier/g, '');
        match = imageMap.find(img => img.toLowerCase().includes(cleanSlug.toLowerCase()));
    }
    if (!match) {
        match = imageMap.find(img => slug.includes(img.replace(/\.(jpg|png|jpeg)/, '').toLowerCase()));
    }
    return match ? `/images/${match}` : null;
}

export default function ProductCatalog({ products }: { products: Product[] }) {
    const [query, setQuery] = useState('');

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.meta_description?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div>
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-12 relative">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
                <AnimatePresence>
                    {filteredProducts.map((product) => {
                        const imagePath = findBestImage(product.slug);
                        return (
                            <motion.div
                                layout
                                key={product.slug}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col h-full"
                                >
                                    <div className="relative h-48 overflow-hidden bg-gray-200">
                                        {imagePath ? (
                                            <Image
                                                src={imagePath}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                                            {product.meta_description || 'Premium quality metal products.'}
                                        </p>
                                        <span className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:underline">
                                            View Details <ArrowRight size={16} className="ml-1" />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">No products found matching &quot;{query}&quot;</p>
                </div>
            )}
        </div>
    );
}
