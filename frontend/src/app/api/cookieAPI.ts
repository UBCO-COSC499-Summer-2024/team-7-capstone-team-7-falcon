"use server";
import { cookies } from "next/headers";
export async function fetchAuthToken() {
  try {
    // const response = await fetch("/api/cookies", {
    //   method: "GET",
    //   cache: "no-cache",
    // });
    const cookieStore = cookies();
    const auth_token = cookieStore.get("auth_token");

    const result = `auth_token=${auth_token?.value || ""}`;

    return result;
  } catch (error) {
    console.error("Failed to fetch auth token:", error);
  }
}
