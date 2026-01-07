import Link from 'next/link';
import { Phone, Mail, ChevronRight } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="w-full lg:w-1/4 px-4 border-l border-gray-100 dark:border-slate-800">
            {/* Sticky Container - Compacted for better visibility */}
            <div className="sticky top-20 space-y-4">

                {/* Main Pages Widget */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3 border-b dark:border-slate-700 pb-2">Our Products</h3>
                    <ul className="space-y-1.5">
                        <li>
                            <Link href="/products/stainless-steel-316-316l-seamless-welded-erw-pipes-tubes-exporter" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Stainless Steel Pipes
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/stainless-steel-buttweld-fittings-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Butt Welded Fittings
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/stainless-steel-forged-fittings-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Forged Fittings
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Flanges Widget */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3 border-b dark:border-slate-700 pb-2">Flanges</h3>
                    <ul className="space-y-1.5">
                        {/* Validated Links based on DB check (slipon vs slip-on) */}
                        <li>
                            {/* Uses 'slipon' based on debug finding */}
                            <Link href="/products/stainless-steel-nickel-alloy-duplex-steel-slipon-flanges-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Slip On Flange
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/stainless-steel-nickel-alloy-duplex-steel-blind-flanges-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Blind Flange
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/stainless-steel-nickel-alloy-duplex-steel-weld-neck-flanges-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Weld Neck Flange
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/stainless-steel-nickel-alloy-duplex-steel-threaded-flanges-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Threaded Flange
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/stainless-steel-nickel-alloy-duplex-steel-lap-joint-flanges-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Lap Joint Flange
                            </Link>
                        </li>
                        <li>
                            <Link href="/products/stainless-steel-nickel-alloy-duplex-steel-plate-flanges-manufacturer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <span className="mr-2">›</span> Plate Flange
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Widget - Sticky & Last */}
                <div className="bg-blue-600 dark:bg-blue-700 text-white p-5 rounded-xl shadow-lg border border-blue-500 dark:border-blue-600 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />

                    <h3 className="font-bold text-lg text-white mb-3">Quick Contact</h3>
                    <div className="space-y-3 text-sm relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                                <Phone size={16} />
                            </div>
                            <a href="tel:+919892171042" className="text-white hover:text-blue-100 font-medium transition-colors">
                                +91-9892171042
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                                <Mail size={16} />
                            </div>
                            <a href="mailto:enquiry@metalministry.in" className="text-white hover:text-blue-100 font-medium transition-colors break-all">
                                enquiry@metalministry.in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
