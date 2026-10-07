/**
 * Direct server-action login for admin — bypasses NextAuth client signIn()
 * which has reliability issues in App Router with JWT sessions and redirect:false.
 */
"use server";

import { signIn } from "../../../../auth";

export async function loginAction(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/inquiries",
    });
    // signIn with redirectTo throws a NEXT_REDIRECT — that's the success path
    return { error: null };
  } catch (err: unknown) {
    // NEXT_REDIRECT is a special error thrown by Next.js redirect() — re-throw it
    if (
      err instanceof Error &&
      (err.message.includes("NEXT_REDIRECT") || err.message.includes("redirect"))
    ) {
      throw err;
    }
    return { error: "Invalid email or password." };
  }
}
