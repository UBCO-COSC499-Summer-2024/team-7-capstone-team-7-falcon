import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { usersAPI } from "@/app/api/usersAPI";
import { User } from "@/app/typings/backendDataTypes";
import { fetchAuthToken } from "@/app/api/cookieAPI";
import { authAPI, isTokenExpired } from "@/app/api/authAPI";

const auth_pages = ["/login", "/signup", "/reset-password", "/change-password"];

const isAuthPages = (url: string) =>
  auth_pages.some((page) => page.startsWith(url));

const userRoleMap = {
  student: "/student",
  professor: "/instructor",
  admin: "/admin",
};

/**
 * Verify that an authenticated user has at least one ID (employee or student) set.
 *
 * @async
 * @function verifyIdPresence
 * @returns {Promise<boolean>} - A promise that shows whether a user has at least one ID or not.
 * @throws Will log an error message to the console if fetching the user details fails.
 */
const verifyIdPresence = async (): Promise<boolean> => {
  try {
    const userDetails: User = await usersAPI.getUserDetails();
    return (
      userDetails.student_user !== null || userDetails.employee_user !== null
    );
  } catch (error) {
    throw error;
  }
};

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;
  const fetched_auth_token = await fetchAuthToken();
  const auth_token = fetched_auth_token.replace("auth_token=", ""); // based on implementation of fetchAuthToken

  const isAuthPageRequested = isAuthPages(nextUrl.pathname);
  const hasVerifiedToken = !isTokenExpired(auth_token);

  // verify if user is trying to validate their email
  // if yes, redirect to login page which will handle that
  if (nextUrl.pathname.startsWith("/auth/confirm")) {
    const token = nextUrl.searchParams.get("token");
    const redirectURL = new URL("/login", url);
    redirectURL.searchParams.set("confirm_token", token);

    const response = NextResponse.redirect(redirectURL);
    return response;
  }

  // verify if user is trying to reset their password
  // if yes, redirect to the change password page which will handle that
  if (nextUrl.pathname.startsWith("/auth/reset-password")) {
    const token = nextUrl.searchParams.get("token");
    const redirectURL = new URL("/change-password", url);
    redirectURL.searchParams.set("reset_token", token);

    const response = NextResponse.redirect(redirectURL);
    return response;
  }

  // Redirect to dashboard if user is authenticated and tries to access login/signup page
  if (isAuthPageRequested) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
    const userRole = await usersAPI.getUserRole();
    const response = NextResponse.redirect(
      new URL(userRoleMap[userRole as keyof typeof userRoleMap], url),
    );
    return response;
  }

  // Redirect to login page if user is not authenticated
  if (!hasVerifiedToken) {
    const response = NextResponse.redirect(new URL("/login", url));
    response.cookies.delete("auth_token");
    return response;
  }

  // if user is authenticated, verify that they have at least one ID set
  const hasID = await verifyIdPresence();
  if (!hasID) {
    return NextResponse.redirect(new URL("/setup-account", url));
  }

  // Users should not be able to access pages that are not meant for their role
  // Redirecting here, but could also show a 404 page
  const userRole = await usersAPI.getUserRole();
  const userRolePath = userRoleMap[userRole as keyof typeof userRoleMap];
  if (!nextUrl.pathname.startsWith(userRolePath)) {
    const response = NextResponse.redirect(new URL(userRolePath, url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - scripts
     * - styles
     * - setup-account (setup account page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|scripts|styles|setup-account).*)",
  ],
};
