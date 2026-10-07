"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await loginAction(email, password);
      if (result?.error) {
        setError(result.error);
      }
      // On success the server action calls Next.js redirect() which navigates automatically
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--dusk-deep)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ background: "var(--paper)" }}
      >
        <div className="text-center mb-8">
          <Image
            src="/brand/logo.png"
            alt="Impact Energy Solution"
            width={140}
            height={46}
            className="h-10 w-auto mx-auto mb-4"
          />
          <h1 className="font-fraunces text-2xl text-ink font-bold">Admin Portal</h1>
          <p className="text-ink/60 text-sm mt-1">Sign in to manage inquiries</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-ink/20 bg-paper-deep px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
              placeholder="admin@ies.engineer"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink/20 bg-paper-deep px-4 py-3 text-ink text-sm focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-700 text-sm font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-gold text-dusk-deep font-bold text-sm hover:bg-gold-hi transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
