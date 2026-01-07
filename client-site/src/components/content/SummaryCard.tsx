'use client';

import React from 'react';
import { Quote } from 'lucide-react';

export default function SummaryCard({ title, content }: { title: string, content: string }) {
    const contentStr = content || "";

    // Extract Rating
    const ratingMatch = contentStr.match(/Author Rating\s*(\d+)/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 5; // Default to 5 if not found

    // Remove formatting keys to clean up "legacyText" fallback if needed
    // We want to try and verify if we can extract fields.

    // Regex to extract known fields
    const reviewerMatch = contentStr.match(/Reviewer\s*:\s*(.*?)(?=\s*Review Date|$)/i);
    const dateMatch = contentStr.match(/Review Date\s*:\s*(.*?)(?=\s*Reviewed Product|$)/i);
    const productMatch = contentStr.match(/Reviewed Product\s*:\s*(.*?)(?=\s*Author Rating|$)/i); // Stop at Author Rating or End

    const reviewer = reviewerMatch ? reviewerMatch[1].trim() : "";
    const date = dateMatch ? dateMatch[1].trim() : "";
    const product = productMatch ? productMatch[1].trim() : "";

    // If parsing failed significantly (no fields found), treat as raw text
    const isParsed = reviewer || date || product;
    const legacyText = !isParsed ? contentStr : "";

    return (
        <div className="my-12 relative max-w-4xl mx-auto px-4">
            {/* Floating Icon */}
            <div className="absolute -top-5 -left-2 md:-left-6 bg-blue-600 text-white p-3 rounded-full shadow-xl z-20 border-4 border-white dark:border-slate-950">
                <Quote size={28} fill="currentColor" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 pt-12 shadow-2xl border border-gray-100 dark:border-slate-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-bl-full -mr-10 -mt-10 z-0" />

                <div className="relative z-10">
                    <h4 className="text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest text-sm mb-8 border-b border-gray-100 dark:border-slate-800 pb-4">
                        {title.replace(':', '')}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        {/* Reviewer */}
                        {reviewer && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reviewer</span>
                                <span className="text-gray-900 dark:text-white font-semibold text-lg">{reviewer}</span>
                            </div>
                        )}

                        {/* Date */}
                        {date && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Review Date</span>
                                <span className="text-gray-900 dark:text-white font-medium">{date}</span>
                            </div>
                        )}

                        {/* Product - Full Width */}
                        {product && (
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product</span>
                                <span className="text-gray-800 dark:text-sky-100 font-medium italic text-lg leading-snug">{product}</span>
                            </div>
                        )}

                        {/* Rating - Full Width */}
                        <div className="flex flex-col gap-2 md:col-span-2 mt-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon key={star} filled={star <= rating} />
                                ))}
                                <span className="ml-3 text-sm font-bold text-yellow-500">{rating}/5</span>
                            </div>
                        </div>
                    </div>

                    {/* Fallback Only */}
                    {legacyText && (
                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-medium mt-4">
                            {legacyText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StarIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={filled ? "#FBBF24" : "none"}
            stroke={filled ? "#FBBF24" : "#D1D5DB"}
            strokeWidth={1.5}
            className={`w-6 h-6 transition-all ${filled ? 'scale-110 drop-shadow-sm' : ''}`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    );
}
