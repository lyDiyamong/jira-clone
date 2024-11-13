import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
const isProtectedRoute = createRouteMatcher([
    "/onboarding(.*)",
    "/organization(.*)",
    "/project(.*)",
    "/issue(.*)",
]);
export default clerkMiddleware((auth, req: NextRequest) => {
    // if user is not logged in and try to access to the protected route
    if (!auth().userId && isProtectedRoute(req)) {
        return auth().redirectToSignIn();
    }
    // if user is logged in, not org, not on onboarding, not on homepage
    if (
        auth().userId &&
        !auth().orgId &&
        req.nextUrl.pathname !== "/onboarding" &&
        req.nextUrl.pathname !== "/"
    ) {
        // redirect to
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
