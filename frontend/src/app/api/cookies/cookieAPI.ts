export async function fetchAuthToken() {
  try {
    const response = await fetch("/api/cookies", {
      method: "GET",
      credentials: "include",
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = response.headers.get("Get-Cookie");

    return result;
  } catch (error) {
    console.error("Failed to fetch auth token:", error);
  }
}
