import { Request } from 'express';

/**
 * Get a cookie from the request
 * @param req {Request} - The request object
 * @param cookieName {string} - The name of the cookie to get
 * @returns {string} - The cookie value or null
 */
export function getCookie(req: Request, cookieName: string): string {
  const cookieHeader = req.headers?.cookie ?? req.body?.headers?.cookie;
  console.log('req.cookies', req.cookies);
  if (!cookieHeader) {
    return null;
  }

  const cookies: string[] = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name.trim() === cookieName) {
      return value;
    }
  }
}
