import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { usersAPI } from "@/app/api/usersAPI";
import { fetchAuthToken } from "@/app/api/cookieAPI";

const auth_pages = ["/login", "/signup"];
const isAuthPages = (url) => auth_pages.some((page) => page.startsWith(url));
const userRoleMap = {
  student: "/student",
  professor: "/instructor",
  admin: "/admin",
};

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;
  const auth_token = await fetchAuthToken();

  const isAuthPageRequested = isAuthPages(nextUrl.pathname);
  const hasVerifiedToken = auth_token.substring(11) !== ""; // based on implementation of fetchAuthToken

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

// define pages which do not require authentication
export const config = { matcher: auth_pages };
