'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import dynamic from 'next/dynamic';

// Circular dependency: AccordionGroup -> ContentRenderer
const ContentRenderer = dynamic(() => import('./ContentRenderer'));

interface AccordionItem {
    title: string;
    body: any[];
}

export default function AccordionGroup({ items }: { items: AccordionItem[] }) {
    if (!items || !Array.isArray(items)) return null;

    return (
        <div className="space-y-4 my-8">
            {items.map((item, i) => (
                <AccordionItem key={i} item={item} />
            ))}
        </div>
    );
}

function AccordionItem({ item }: { item: AccordionItem }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {item.title}
                </span>
                <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-6 pt-0 border-t border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/30">
                            {/* Recursively render content inside the accordion */}
                            <ContentRenderer blocks={item.body} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
