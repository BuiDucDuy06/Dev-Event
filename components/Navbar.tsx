"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          {user && <Link href="/create-event">Create Event</Link>}

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