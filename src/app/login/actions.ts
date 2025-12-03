'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const password = formData.get('password') as string;

    // In a real app, use a strong environment variable.
    // Default to 'admin123' for this demo if not set.
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (password === correctPassword) {
        // Set a session cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        redirect('/');
    } else {
        return { error: 'Invalid password' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/login');
}
