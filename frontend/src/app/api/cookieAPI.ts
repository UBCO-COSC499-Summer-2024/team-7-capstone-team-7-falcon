"use server";
import { cookies } from "next/headers";

/**
 * Fetches the 'auth_token' from the cookies.
 *
 * @async
 * @function fetchAuthToken
 * @returns {Promise<string>} - A promise that resolves to a string containing the 'auth_token'.
 * @throws Will log an error message to the console if fetching the 'auth_token' fails.
 */
export async function fetchAuthToken() {
  try {
    const cookieStore = cookies();
    const auth_token = cookieStore.get("auth_token");

    const result = `auth_token=${auth_token?.value || ""}`;

    return result;
  } catch (error) {
    console.error("Failed to fetch auth token", error);
    return "";
  }
}

/**
 * Sets the 'auth_token' cookie.
 *
 * @async
 * @function setAuthToken
 * @throws Will log an error message to the console if setting the 'auth_token' fails.
 */
export async function setAuthToken(auth_token: string) {
  try {
    const cookieStore = cookies();
    cookieStore.set("auth_token", auth_token);
  } catch (error) {
    console.error("Failed to set auth token", error);
  }
}
