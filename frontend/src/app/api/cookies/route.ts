import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const auth_token = cookieStore.get("auth_token");

    return new Response("ok", {
      status: 200,
      headers: { "Get-Cookie": `auth_token=${auth_token?.value || ""}` },
    });
  } catch (error) {
    console.error("Error fetching cookie:", error);
    return new Response("Error fetching cookie", { status: 500 });
  }
}
