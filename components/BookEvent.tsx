'use client'

import { createBooking, checkBooking } from "@/lib/actions/booking.action";
import { useAuth } from "@/components/AuthProvider";
import posthog from "posthog-js";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const { user, loading } = useAuth();
  const [booked, setBooked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) { setChecking(false); return; }
    checkBooking({ eventId, userId: user.uid }).then(({ booked }) => {
      setBooked(booked);
      setChecking(false);
    });
  }, [user, eventId]);

  const handleBook = async () => {
    if (!user) return;
    setSubmitting(true);
    const userName = user.displayName || user.email?.split("@")[0] || "Anonymous";
    const userEmail = user.email ?? "";
    const { success, alreadyBooked } = await createBooking({ eventId, userId: user.uid, userName, userEmail });
    if (success || alreadyBooked) {
      setBooked(true);
      posthog.capture("event_booked", { eventId, slug, userId: user.uid });
    }
    setSubmitting(false);
  };

  if (loading || checking) {
    return <div className="w-full h-12 rounded-xl bg-white/5 animate-pulse mt-4" />;
  }

  // Not signed in
  if (!user) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-200 shrink-0">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
          <p className="text-light-200 text-sm">Sign in to reserve your spot</p>
        </div>
        <Link
          href="/sign-in"
          className="w-full text-center bg-primary hover:bg-primary/90 text-black font-bold rounded-xl py-3 text-sm transition-all shadow-lg shadow-primary/20"
        >
          Sign in to Book
        </Link>
      </div>
    );
  }

  // Already booked
  if (booked) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        <div className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 text-primary font-semibold rounded-xl py-3 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          You're booked!
        </div>
        <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-3">
          {user.photoURL ? (
            <Image src={user.photoURL} alt="avatar" width={28} height={28} className="rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-light-100 text-xs font-medium truncate">{user.displayName || "User"}</span>
            <span className="text-light-200 text-xs truncate">{user.email}</span>
          </div>
        </div>
      </div>
    );
  }

  // Ready to book
  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={handleBook}
        disabled={submitting}
        className="w-full bg-primary hover:bg-primary/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold rounded-xl py-3 text-sm transition-all shadow-lg shadow-primary/20 cursor-pointer"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Reserving...
          </span>
        ) : "Book My Spot"}
      </button>

      <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-3">
        {user.photoURL ? (
          <Image src={user.photoURL} alt="avatar" width={28} height={28} className="rounded-full" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-light-100 text-xs font-medium truncate">{user.displayName || "User"}</span>
          <span className="text-light-200 text-xs truncate">{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default BookEvent;