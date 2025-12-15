// client-site/src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');

    // Check for secret to confirm this is a valid request
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (secret !== expectedSecret) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (slug) {
        // Revalidate specific post
        revalidatePath(`/blog/${slug}`);
        return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
}
