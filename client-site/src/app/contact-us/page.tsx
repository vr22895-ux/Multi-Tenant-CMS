import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactUsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            {/* Header Strip */}
            <div className="bg-blue-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-blue-200 text-lg">We are here to help you with your metal requirements.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2">

                    {/* Contact Form (Left) */}
                    <div className="p-12 order-2 lg:order-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="john@company.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Interest</label>
                                <select className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white">
                                    <option>Stainless Steel Pipes</option>
                                    <option>Butt Weld Fittings</option>
                                    <option>Flanges</option>
                                    <option>High Nickel Alloys</option>
                                    <option>Other / General Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" placeholder="Tell us about your requirements..."></textarea>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-blue-600/30">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info (Right) */}
                    <div className="bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden order-1 lg:order-2">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 shrink-0 text-blue-200 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-blue-100 mb-1">Registered Office</h3>
                                        <p className="text-lg leading-relaxed">
                                            Metal Ministry Inc.<br />
                                            Siddhivinayak Co-op Hsg.Soc, ( Durgadas Building )<br />
                                            Shop No 3, Ground Floor, Ardeshir Dadi,<br />
                                            CP Tank Cross Ln, near CP Tank,<br />
                                            Mumbai - 400004, Maharashtra, India.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 shrink-0 text-blue-200 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-blue-100 mb-1">Phone</h3>
                                        <p className="text-lg">+91-9892171042</p>
                                        <p className="text-sm text-blue-200 mt-1">(Mon-Sat, 9am - 7pm IST)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 shrink-0 text-blue-200 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-blue-100 mb-1">Email</h3>
                                        <p className="text-lg">enquiry@metalministry.in</p>
                                        <p className="text-sm text-blue-200 mt-1">Response within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-blue-500 relative z-10">
                            <div className="flex items-center gap-4 text-blue-100">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm">Operating Hours: 09:00 AM - 07:00 PM</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Map Section */}
                <div className="mt-16 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 h-[400px] relative overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.666427320496!2d72.822998!3d18.953506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce18e9555555%3A0x1234567890abcdef!2sCP%20Tank%20Circle!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
