'use client';

import { useState } from 'react';
import { login } from './actions';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(formData: FormData) {
        setLoading(true);
        setError(null);

        try {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
            }
            // If success, the server action redirects, so we don't need to do anything here.
        } catch (e) {
            // Next.js redirects throw an error, we need to let it pass if it's a redirect
            // But usually server actions handle this. If it's a real error:
            console.error(e);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm mx-auto mb-4">
                        C
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                    <p className="text-gray-500 mt-2">Please enter your password to continue.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form action={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="text-center text-xs text-gray-400 mt-4">
                        Default password: <code>admin123</code>
                    </div>
                </form>
            </div>
        </div>
    );
}
