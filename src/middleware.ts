import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const adminSession = request.cookies.get('admin_session');
    const isLoginPage = request.nextUrl.pathname === '/login';

    // 1. If trying to access Dashboard (/) without session -> Redirect to Login
    if (!adminSession && !isLoginPage && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. If already logged in and trying to access Login -> Redirect to Dashboard
    if (adminSession && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login'],
};
