import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    // Get the pathname
    const path = request.nextUrl.pathname;

    // Check if the path starts with /dashboard or other protected routes
    const isProtectedRoute =
        path.startsWith('/dashboard') ||
        path.startsWith('/loans') ||
        path.startsWith('/subscriptions') ||
        path.startsWith('/expenses') ||
        path.startsWith('/settings');

    if (isProtectedRoute) {
        // Get the session token
        const token = await getToken({
            req: request,
            secret: process.env.NEXT_PUBLIC_SECRET,
        });

        // If there's no token and trying to access a protected route,
        // redirect to the login page
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }
    }

    // Continue with the request if authenticated or accessing a public route
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/loans/:path*',
        '/subscriptions/:path*',
        '/expenses/:path*',
        '/settings/:path*'
    ]
};
