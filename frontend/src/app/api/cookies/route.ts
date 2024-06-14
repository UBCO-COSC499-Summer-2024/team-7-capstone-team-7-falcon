import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const auth_token = cookieStore.get("auth_token");
  console.log("auth_token", auth_token);
  return new Response("ok", {
    status: 200,
    headers: { "Get-Cookie": `auth_token=${auth_token?.value}` },
  });
}
