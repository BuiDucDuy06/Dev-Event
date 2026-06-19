"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider, facebookProvider } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push("/");
  }, [user, loading, router]);

  const authenticate = async (provider: "github" | "facebook") => {
    setError(null);
    setSigningIn(true);
    try {
      const authProvider = provider === "github" ? githubProvider : facebookProvider;
      await signInWithPopup(auth, authProvider);
      router.push("/");
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  // Always render the UI — never return null
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl">Sign in to DevEvent</h1>
        <p className="text-light-200">
          Create and manage developer events with your existing account
        </p>
      </div>

      <div className="glass flex flex-col gap-4 w-full max-w-sm p-8 rounded-xl card-shadow">
        {/* GitHub */}
        <button
          onClick={() => authenticate("github")}
          disabled={loading || signingIn}
          className="flex items-center justify-center gap-3 w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 border border-[#333] text-white rounded-lg px-5 py-3 transition-colors cursor-pointer font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {signingIn ? "Signing in..." : "Log In With GitHub"}
        </button>

        {/* Facebook */}
        <button
          onClick={() => authenticate("facebook")}
          disabled={loading || signingIn}
          className="flex items-center justify-center gap-3 w-full bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-50 text-white rounded-lg px-5 py-3 transition-colors cursor-pointer font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
          </svg>
          {signingIn ? "Signing in..." : "Log In With Facebook"}
        </button>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 px-4 py-3 rounded-lg">
            {error}
          </p>
        )}

        <p className="text-center text-light-200 text-xs mt-2">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </section>
  );
}