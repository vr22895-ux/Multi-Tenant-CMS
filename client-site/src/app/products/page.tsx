import { createClient } from '@/lib/supabase';
import ProductCatalog from '@/components/ProductCatalog';

// export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Our Products - Metal Ministry Inc.',
    description: 'Explore our comprehensive range of Stainless Steel, High Nickel Alloy, and Duplex Steel products.',
};

export default async function ProductsIndexPage() {
    const supabase = createClient();
    let posts = null;
    let error = null;

    try {
        console.log("Fetching products for Company:", process.env.NEXT_PUBLIC_COMPANY_ID);
        const result = await supabase
            .from('post')
            .select('title, slug, meta_description')
            .eq('company_id', process.env.NEXT_PUBLIC_COMPANY_ID!)
            .eq('type', 'product')
            .order('title', { ascending: true });

        posts = result.data;
        error = result.error;

        if (error) {
            console.error("Error fetching products:", error);
        }
    } catch (err) {
        console.error("Unexpected error in ProductsIndexPage:", err);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Our Product Catalog</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        We manufacture and export a wide range of ferrous and non-ferrous metal products complying with international standards.
                    </p>
                </div>

                {/* Client Component with Search & Filter */}
                {posts && <ProductCatalog products={posts} />}
            </div>
        </div>
    );
}
