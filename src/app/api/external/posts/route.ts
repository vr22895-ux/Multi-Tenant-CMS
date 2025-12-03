import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/external/posts?company_id=...
// This is the REST API that external companies would use to fetch their blogs.
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('company_id');
    const apiKey = request.headers.get('x-api-key');

    if (!companyId) {
        return NextResponse.json({ error: 'Missing company_id' }, { status: 400 });
    }

    // Optional: Verify API Key for security
    // const isValid = await verifyApiKey(companyId, apiKey);
    // if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: posts, error } = await supabase
        .from('post')
        .select('*')
        .eq('company_id', companyId)
        .order('published_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts });
}
