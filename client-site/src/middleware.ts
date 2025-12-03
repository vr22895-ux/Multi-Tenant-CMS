import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Client sites are public, so we just allow everything.
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
