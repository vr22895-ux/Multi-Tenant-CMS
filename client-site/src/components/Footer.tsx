import Link from 'next/link';
import { Mail, MapPin, Phone, Linkedin, Facebook, Twitter, Instagram, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 pt-20 border-t border-gray-900">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/logo1.png"
                                alt="Metal Ministry Inc."
                                className="h-16 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Metal Ministry Inc. is a premier ISO 9001:2015 certified manufacturer & exporter of ferrous & non-ferrous metal products. We are committed to precision, quality, and global excellence.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all text-white hover:-translate-y-1"><Linkedin size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all text-white hover:-translate-y-1"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all text-white hover:-translate-y-1"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all text-white hover:-translate-y-1"><Instagram size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Link 1 */}
                    <div className="lg:col-span-2 md:col-span-1">
                        <h4 className="text-white font-bold text-base mb-6 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Home</Link></li>
                            <li><Link href="/about-us" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> About Us</Link></li>
                            <li><Link href="/products/quality" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Quality Policy</Link></li>
                            <li><Link href="/blogs" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Latest News</Link></li>
                            <li><Link href="/contact-us" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Quick Link 2 - Products */}
                    <div className="lg:col-span-3 md:col-span-1">
                        <h4 className="text-white font-bold text-base mb-6 uppercase tracking-wider">Key Products</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/products/stainless-steel-316-316l-seamless-welded-erw-pipes-tubes-exporter" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Stainless Steel Pipes</Link></li>
                            <li><Link href="/products/high-nickel-alloy-seamless-welded-pipes-tubes-exporter" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Nickel Alloys</Link></li>
                            <li><Link href="/products/stainless-steel-buttweld-fittings-manufacturer" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Buttweld Fittings</Link></li>
                            <li><Link href="/products/stainless-steel-347-347h-weldneck-flanges-manufacturer-supplier" className="hover:text-blue-500 transition-colors flex items-center gap-2"><div className="w-1 h-1 bg-blue-600 rounded-full" /> Flanges</Link></li>
                            <li><Link href="/products" className="text-blue-400 font-semibold hover:text-white transition-colors flex items-center gap-2 mt-4">View All Products <ArrowRight size={14} /></Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3">
                        <h4 className="text-white font-bold text-base mb-6 uppercase tracking-wider">Get in Touch</h4>
                        <div className="space-y-6 text-sm">
                            <div className="flex gap-4 group">
                                <div className="p-3 bg-blue-900/20 text-blue-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <h6 className="text-white font-bold mb-1">Head Office</h6>
                                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                                        Metal Ministry Inc.<br />
                                        Mumbai, Maharashtra, India
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 group">
                                <div className="p-3 bg-blue-900/20 text-blue-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Phone size={20} />
                                </div>
                                <div className="flex-1">
                                    <h6 className="text-white font-bold mb-1">Phone Support</h6>
                                    <a href="tel:+919892171042" className="block text-gray-400 hover:text-white transition-colors">+91-9892171042</a>
                                </div>
                            </div>

                            <div className="flex gap-4 group">
                                <div className="p-3 bg-blue-900/20 text-blue-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-1">
                                    <h6 className="text-white font-bold mb-1">Email Us</h6>
                                    <a href="mailto:enquiry@metalministry.in" className="block text-gray-400 hover:text-white transition-colors">enquiry@metalministry.in</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black py-6 border-t border-gray-900">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <div>
                        &copy; {new Date().getFullYear()} Metal Ministry Inc. All Rights Reserved.
                    </div>
                    <div className="flex gap-8">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
