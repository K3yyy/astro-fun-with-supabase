import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
    // ✅ Skip auth for public pages
    const publicPaths = ["/"]; // add more public paths here if needed
    if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({ request });

    // Skip proxy check if env vars not set
    if (!hasEnvVars) return supabaseResponse;

    // Create SSR client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // Get user session claims
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    // Redirect only if user is not logged in and page requires auth
    if (
        request.nextUrl.pathname !== "/" &&
        !user &&
        !request.nextUrl.pathname.startsWith("/login") &&
        !request.nextUrl.pathname.startsWith("/auth")
    ) {
        const url = request.nextUrl.clone();
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
