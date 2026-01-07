'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, Mail, Menu, X, ArrowRight } from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    const handleMouseEnter = (menu: string) => setActiveDropdown(menu);
    const handleMouseLeave = () => setActiveDropdown(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logic: 
    // Home Page: Transparent at top -> Solid on scroll. Fixed position (overlay).
    // Other Pages: Always Solid. Sticky position (normal flow).

    const isTransparent = isHomePage && !isScrolled;

    // Text color: White if transparent, Gray/Black if solid
    const textColorClass = isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-blue-600';

    // Logo: Invert brightness if transparent (to make it white), else normal
    const logoClass = isTransparent ? 'brightness-0 invert drop-shadow-md' : '';

    return (
        <header
            className={`z-50 transition-all duration-300 border-b 
            ${isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0 bg-white shadow-sm'}
            ${isTransparent ? 'bg-transparent border-white/10 py-4' : 'bg-white/95 backdrop-blur-md border-gray-100 shadow-sm py-2'}
            `}
        >
            {/* Top Strip - Only on Home Page */}
            {isHomePage && (
                <div className={`absolute top-0 left-0 w-full overflow-hidden transition-all duration-500 ${isScrolled ? 'h-0 opacity-0' : 'h-8 opacity-100 bg-black/40 backdrop-blur-sm'}`}>
                    <div className="w-full h-full flex items-center">
                        <div className="animate-marquee whitespace-nowrap flex gap-16 text-xs font-medium tracking-widest text-white/90 uppercase px-4">
                            <span>ISO 9001:2015 Certified Manufacturer & Exporter</span>
                            <span><Mail size={12} className="inline mr-1" /> enquiry@metalministry.in</span>
                            <span><Phone size={12} className="inline mr-1" /> +91-9892171042</span>
                            <span>Global Shipping Available</span>
                            {/* //adding extra space to avoid overflow */}
                            <span> </span>
                            <span> </span>
                            {/* Duplicate for seamless loop */}
                            <span>ISO 9001:2015 Certified Manufacturer & Exporter</span>
                            <span><Mail size={12} className="inline mr-1" /> enquiry@metalministry.in</span>
                            <span><Phone size={12} className="inline mr-1" /> +91-9892171042</span>
                            <span>Global Shipping Available</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={`container mx-auto px-4 transition-all duration-300 ${isTransparent ? 'mt-6' : 'mt-0'}`}>
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 relative group z-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/logo1.png"
                            alt="Metal Ministry Inc. Logo"
                            className={`h-16 md:h-20 w-auto object-contain transition-all duration-500 ${logoClass}`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex gap-10 items-center">
                        <Link href="/" className={`${textColorClass} font-bold tracking-wide text-sm uppercase transition-colors relative group py-2`}>
                            Home
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full`}></span>
                        </Link>

                        {/* Mega Menu: About */}
                        <div
                            className="relative group h-full"
                            onMouseEnter={() => handleMouseEnter('about')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button className={`flex items-center gap-1 ${textColorClass} font-bold tracking-wide text-sm uppercase py-4 group`}>
                                About Us <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'about' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 w-56 bg-white/95 backdrop-blur-xl shadow-2xl rounded-lg border border-gray-100 overflow-hidden"
                                    >
                                        <div className="py-2">
                                            <Link href="/about-us" className="block px-6 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Company Profile</Link>
                                            <Link href="/products/quality" className="block px-6 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Quality Policy</Link>
                                            <Link href="/products/technical-data" className="block px-6 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">Technical Data</Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mega Menu: Products */}
                        <div
                            className="relative group h-full"
                            onMouseEnter={() => handleMouseEnter('products')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button className={`flex items-center gap-1 ${textColorClass} font-bold tracking-wide text-sm uppercase py-4`}>
                                Products <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'products' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full -left-20 w-[600px] bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl border border-gray-100 overflow-hidden grid grid-cols-2 p-6 gap-6"
                                    >
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">By Product Type</h4>
                                            <ul className="space-y-2">
                                                <li><Link href="/products/stainless-steel-316-316l-seamless-welded-erw-pipes-tubes-exporter" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Pipes & Tubes</Link></li>
                                                <li><Link href="/products/stainless-steel-buttweld-fittings-manufacturer" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Butt Weld Fittings</Link></li>
                                                <li><Link href="/products/stainless-steel-forged-fittings-manufacturer" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Forged Fittings</Link></li>
                                                <li><Link href="/products/stainless-steel-347-347h-weldneck-flanges-manufacturer-supplier" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Flanges</Link></li>
                                                <li><Link href="/products" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Fasteners</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">By Material</h4>
                                            <ul className="space-y-2">
                                                <li><Link href="/products/stainless-steel-316-316l-seamless-welded-erw-pipes-tubes-exporter" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Stainless Steel Pipes</Link></li>
                                                <li><Link href="/products/high-nickel-alloy-seamless-welded-pipes-tubes-exporter" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">High Nickel Alloys</Link></li>
                                                <li><Link href="/products/duplex-steel-uns-s31803-pipe-fitting-manufacturer" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Duplex Steel</Link></li>
                                                <li><Link href="/products/super-duplex-uns-s32750-pipe-fitting-manufacturer" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Super Duplex</Link></li>
                                                <li><Link href="/products/copper-nickel-pipes-tubes-manufacturer" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Cupro Nickel</Link></li>
                                                <li><Link href="/products/titanium-pipe-fittings-manufacturer" className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all inline-block">Titanium</Link></li>
                                            </ul>
                                        </div>
                                        <div className="col-span-2 mt-4 pt-4 border-t border-gray-100 text-center">
                                            <Link href="/products" className="text-blue-600 font-bold text-sm hover:underline flex items-center justify-center gap-1">
                                                View Complete Catalog <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/blogs" className={`${textColorClass} font-bold tracking-wide text-sm uppercase transition-colors relative group py-2`}>
                            Blogs
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full`}></span>
                        </Link>
                        <Link href="/contact-us" className={`${textColorClass} font-bold tracking-wide text-sm uppercase transition-colors relative group py-2`}>
                            Contact
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full`}></span>
                        </Link>
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden lg:block shrink-0">
                        <Link href="/contact-us" className={`px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 transition-all text-base flex items-center gap-2 whitespace-nowrap tracking-wide border ${!isTransparent ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white border-transparent' : 'bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white hover:text-blue-900'}`}>
                            Get Quote <ArrowRight size={18} />
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button className={`lg:hidden ${textColorClass}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: '100vh', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden fixed inset-0 top-[60px] bg-white z-40 overflow-y-auto"
                    >
                        <nav className="p-6 flex flex-col space-y-6 mt-10">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-800">Home</Link>
                            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-800">Products</Link>
                            <Link href="/about-us" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-800">About Us</Link>
                            <Link href="/blogs" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-gray-800">Blogs</Link>
                            <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-blue-600">Contact Us</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
