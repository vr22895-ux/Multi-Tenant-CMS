'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports to split bundle and handle circular deps
const HeroSection = dynamic(() => import('./HeroSection'));
const ModernDataGrid = dynamic(() => import('./ModernDataGrid'));
const SummaryCard = dynamic(() => import('./SummaryCard'));
const AccordionGroup = dynamic(() => import('./AccordionGroup'));
const ImageBlock = dynamic(() => import('./ImageBlock'));

interface Block {
    type: string;
    variant?: string;
    [key: string]: any;
}

interface ContentRendererProps {
    blocks: Block[] | null;
}

export default function ContentRenderer({ blocks }: ContentRendererProps) {
    if (!blocks || !Array.isArray(blocks)) {
        return null;
    }

    return (
        <div className="space-y-8 lg:space-y-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {blocks.map((block, index) => (
                <ContentBlock key={index} block={block} index={index} />
            ))}
        </div>
    );
}

function ContentBlock({ block, index }: { block: Block; index: number }) {
    const delay = index * 0.1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: delay > 0.5 ? 0.5 : delay }}
        >
            {renderBlock(block)}
        </motion.div>
    );
}

function renderBlock(block: Block) {
    switch (block.type) {
        case 'heading':
            // @ts-ignore - dynamic component inference might trigger legacy lint
            return <HeroSection block={block} />;

        case 'paragraph':
            return (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg max-w-4xl">
                    {block.text}
                </p>
            );

        case 'table':
            // @ts-ignore - rows type mismatch handled in component
            return <ModernDataGrid rows={block.rows} />;

        case 'section':
            if (block.variant === 'summary') {
                // @ts-ignore
                return <SummaryCard title={block.title} content={block.content} />;
            }
            return null;

        case 'accordion':
            // @ts-ignore
            return <AccordionGroup items={block.items} />;

        case 'image':
            // @ts-ignore
            return <ImageBlock src={block.src} alt={block.alt} />;

        case 'list':
            return (
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                    {block.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            );

        default:
            return null;
    }
}
