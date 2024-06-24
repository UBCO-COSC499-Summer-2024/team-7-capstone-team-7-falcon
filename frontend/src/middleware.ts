import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { usersAPI } from "@/app/api/usersAPI";
import { User } from "@/app/typings/backendDataTypes";
import { fetchAuthToken } from "@/app/api/cookieAPI";

const auth_pages = ["/login", "/signup"];
const isAuthPages = (url: string) =>
  auth_pages.some((page) => page.startsWith(url));
const userRoleMap = {
  student: "/student",
  professor: "/instructor",
  admin: "/admin",
};

/**
 * Fetches user details and extracts the role property.
 *
 * @async
 * @function getUserRole
 * @returns {Promise<string>} - A promise that resolves to the role of the user.
 * @throws Will log an error message to the console if fetching the user details fails.
 */
const getUserRole = async (): Promise<string> => {
  try {
    const userDetails: User = await usersAPI.getUserDetails();
    const userRole: string = userDetails.role;
    return userRole;
  } catch (error) {
    throw error;
  }
};

export async function middleware(request: NextRequest) {
  // const { url, nextUrl, cookies } = request;
  // const auth_token = await fetchAuthToken();

  // const isAuthPageRequested = isAuthPages(nextUrl.pathname);
  // const hasVerifiedToken = auth_token.replace("auth_token=", ""); // based on implementation of fetchAuthToken

  // // Redirect to dashboard if user is authenticated and tries to access login/signup page
  // if (isAuthPageRequested) {
  //   if (!hasVerifiedToken) {
  //     const response = NextResponse.next();
  //     response.cookies.delete("auth_token");
  //     return response;
  //   }
  //   const userRole = await getUserRole();
  //   const response = NextResponse.redirect(
  //     new URL(userRoleMap[userRole as keyof typeof userRoleMap], url),
  //   );
  //   return response;
  // }

  // // Redirect to login page if user is not authenticated
  // if (!hasVerifiedToken) {
  //   const response = NextResponse.redirect(new URL("/login", url));
  //   response.cookies.delete("auth_token");
  //   return response;
  // }

  // // Users should not be able to access pages that are not meant for their role
  // // Redirecting here, but could also show a 404 page
  // const userRole = await getUserRole();
  // const userRolePath = userRoleMap[userRole as keyof typeof userRoleMap];
  // if (!nextUrl.pathname.startsWith(userRolePath)) {
  //   const response = NextResponse.redirect(new URL(userRolePath, url));
  //   return response;
  // }

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
     */
    "/((?!api|_next/static|_next/image|favicon.ico|scripts|styles).*)",
  ],
};
