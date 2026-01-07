'use client';

import { useEffect } from 'react';

export default function LegacyInteractivity() {
    useEffect(() => {
        // Helper to toggle collapse
        const toggleCollapse = (targetId: string, trigger: Element) => {
            const target = document.querySelector(targetId);
            if (!target) return;

            const isExpanded = target.classList.contains('in');

            // Close all others in the same group (accordian behavior)
            const parentSelector = trigger.getAttribute('data-parent');
            if (parentSelector) {
                const parent = document.querySelector(parentSelector);
                if (parent) {
                    const allCollapses = parent.querySelectorAll('.panel-collapse.in');
                    allCollapses.forEach(el => {
                        if (el !== target) {
                            el.classList.remove('in');
                            el.setAttribute('aria-expanded', 'false');
                            // Update icon if exists
                            const otherTrigger = document.querySelector(`a[href="#${el.id}"]`);
                            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            }

            // Toggle current
            if (isExpanded) {
                target.classList.remove('in');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                target.classList.add('in');
                trigger.setAttribute('aria-expanded', 'true');
            }
        };

        const handleClick = (e: Event) => {
            const el = e.currentTarget as Element;
            const href = el.getAttribute('href');
            // Bootstrap data-toggle="collapse" links often use href="#id"
            if (href && href.startsWith('#')) {
                e.preventDefault();
                toggleCollapse(href, el);
            }
        };

        // Attach listeners to legacy elements
        // Selector based on legacy markup: <a data-toggle="collapse" ...>
        const toggles = document.querySelectorAll('[data-toggle="collapse"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', handleClick);
        });

        return () => {
            toggles.forEach(toggle => {
                toggle.removeEventListener('click', handleClick);
            });
        };
    }, []);

    return null; // This component renders nothing, just attaches behavior
}
