// @ts-ignore
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: any[]) {
                    cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: any }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // This will refresh the session if it's expired
    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes logic
    const isLoginPath = request.nextUrl.pathname === '/login';
    const isAdminLoginPath = request.nextUrl.pathname === '/admin/login';
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin') && !isAdminLoginPath;

    if (isAdminPath) {
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Fetch user profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            // Redirect non-admins to dashboard or home
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // If user is already logged in and tries to go to login pages, redirect to admin or dashboard
    if ((isLoginPath || isAdminLoginPath) && user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}
