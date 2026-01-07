import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Users, Globe, Clock, Target, Rocket } from 'lucide-react';

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="relative bg-blue-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 opacity-90" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="text-blue-300 font-bold tracking-widest uppercase text-sm mb-4 block animate-fade-in-up">The Metal Ministry Legacy</span>
                    <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up delay-100">
                        Building the Future with <br className="hidden md:block" /> Quality Metals
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        Since our inception, we have been dedicated to precision, quality, and global service in the metal manufacturing industry.
                    </p>
                </div>
            </div>

            {/* Trust Strip */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm relative z-20 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
                    <div className="flex flex-col items-center text-center">
                        <Globe className="w-8 h-8 text-blue-600 mb-2" />
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">25+</div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">Countries Served</div>
                    </div>
                    <div className="flex flex-col items-center text-center border-l border-gray-100 dark:border-slate-800">
                        <ShieldCheck className="w-8 h-8 text-blue-600 mb-2" />
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">ISO</div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">9001:2015 Certified</div>
                    </div>
                    <div className="flex flex-col items-center text-center border-l border-gray-100 dark:border-slate-800">
                        <Users className="w-8 h-8 text-blue-600 mb-2" />
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">500+</div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">Happy Clients</div>
                    </div>
                    <div className="flex flex-col items-center text-center border-l border-gray-100 dark:border-slate-800">
                        <Clock className="w-8 h-8 text-blue-600 mb-2" />
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">Support Team</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-24 space-y-24">

                {/* Our Story */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Our Story</h2>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">A Journey of Excellence</h3>
                        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                            <p>
                                <strong>Metal Ministry Inc.</strong> is a leading Manufacturer & Exporter of Ferrous & Non-Ferrous Metals.
                                Incorporated by <strong className="text-blue-600">Mr. Dinesh Chandan</strong>, we embarked on a journey not just to sell products,
                                but to build lasting relationships.
                            </p>
                            <p>
                                We are a proactive organization engaged in supplying quality products that meet and exceed specific requirements.
                                Our extensive product range includes Stainless Steel Pipes, Tubes, Fittings, Flanges, and High Nickel Alloys.
                            </p>
                            <p>
                                With our head office in Mumbai, the commercial hub of India, we are strategically positioned to serve clients globally
                                with efficiency and speed.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-3 opacity-10"></div>
                        <div className="relative bg-gray-200 dark:bg-slate-800 rounded-3xl h-[500px] overflow-hidden flex items-center justify-center">
                            <Image
                                src="/images/about-vision.png"
                                alt="Metal Ministry Leadership"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <Target size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To become the globally most preferred steel supplier by providing superior quality products and complying with various International Standards.
                            We aim to set new benchmarks in the industry through innovation and customer satisfaction.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <Rocket size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            To provide total customer satisfaction through our quality products and services. We strive to improve our processes continuously
                            and maintain a safe and healthy environment for our employees and community.
                        </p>
                    </div>
                </div>

            </div>

            {/* CTA Section */}
            <div className="bg-gray-900 text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Ready to work with us?</h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                        Contact our team today to discuss your requirements and get a custom quotation.
                    </p>
                    <Link href="/contact-us" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-blue-600/40">
                        Get in Touch
                    </Link>
                </div>
            </div>
        </div>
    );
}
