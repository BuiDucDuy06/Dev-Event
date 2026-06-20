"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/events?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <header>
      <nav className="flex items-center justify-between gap-4 px-6 py-3">
        {/* Logo */}
        <Link href="/" className="logo flex-shrink-0">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>

        {/* Center search bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md"
        >
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-200"
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-dark-200 border border-[#333] focus:border-primary/50 rounded-full pl-9 pr-4 py-2 text-sm outline-none text-white placeholder:text-light-200 transition-colors"
            />
          </div>
        </form>

        {/* Right nav links */}
        <ul className="flex items-center gap-5">
          <Link href="/" className="text-sm text-light-200 hover:text-white transition-colors">Home</Link>
          <Link href="/events" className="text-sm text-light-200 hover:text-white transition-colors">Events</Link>
          {user && (
            <Link href="/create-event" className="text-sm text-light-200 hover:text-white transition-colors">
              Create Event
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full border border-primary/40 hover:border-primary transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center text-primary text-sm font-semibold transition-colors">
                    {user.displayName?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="text-light-200 hover:text-white text-sm cursor-pointer transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="bg-primary text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
            >
              Sign in
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;