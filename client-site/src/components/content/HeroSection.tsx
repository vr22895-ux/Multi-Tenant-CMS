'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SIZE_STYLES: Record<number, string> = {
    1: "text-3xl lg:text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400",
    2: "text-2xl lg:text-3xl mt-10 mb-5 border-l-4 border-blue-500 pl-4",
    3: "text-xl lg:text-2xl mt-6 mb-3",
    4: "text-lg font-semibold mt-4 mb-2",
    5: "text-base font-semibold mt-3 mb-2",
    6: "text-sm font-semibold mt-3 mb-2",
};

export default function HeroSection({ block }: { block: any }) {
    // Safely cast the heading tag
    const Level = (`h${block.level}` as unknown) as React.ElementType;

    // Dynamic styles based on level
    const baseStyles = "font-bold tracking-tight text-gray-900 dark:text-white";
    const sizeStyle = SIZE_STYLES[block.level] || SIZE_STYLES[1];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
        >
            {/* Decorative background element for H1 */}
            {block.level === 1 && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 blur-xl opacity-50 -z-10 group-hover:opacity-75 transition-opacity" />
            )}

            <Level className={`${baseStyles} ${sizeStyle}`}>
                {block.text}
            </Level>
        </motion.div>
    );
}
