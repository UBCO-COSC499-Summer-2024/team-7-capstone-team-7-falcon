export async function fetchAuthToken() {
  try {
    const response = await fetch("/api/cookies", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.headers.get("Get-Cookie");
    console.log("Fetched result:", result);
    return result;
  } catch (error) {
    console.error("Failed to fetch auth token:", error);
  }
}
