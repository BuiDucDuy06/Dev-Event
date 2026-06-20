"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { IEvent } from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/sign-in");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const organizer = user.displayName || user.email?.split("@")[0] || user.uid;
    if (!organizer) return;
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/events?organizer=${encodeURIComponent(organizer)}`
        );
        const data = await res.json();
        setEvents(data.events ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  if (loading || !user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <section className="max-w-2xl mx-auto flex flex-col gap-8 py-10">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* Profile card */}
      <div className="glass rounded-xl p-8 flex flex-col items-center gap-5 card-shadow">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName ?? "User"}
            width={96}
            height={96}
            className="rounded-full border-2 border-primary/40"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
            {user.displayName?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-xl font-semibold">{user.displayName ?? "Anonymous"}</h2>
          <p className="text-light-200 text-sm">{user.email ?? "No email provided"}</p>
          <span className="pill mt-2">
            {user.providerData[0]?.providerId === "github.com" ? "GitHub" : "Facebook"} Account
          </span>
        </div>

        <div className="w-full flex flex-col gap-3 border-t border-[#333] pt-5">
          <div className="flex justify-between text-sm">
            <span className="text-light-200">User ID</span>
            <span className="text-light-100 font-mono truncate max-w-45">{user.uid}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-light-200">Email verified</span>
            <span className={user.emailVerified ? "text-primary" : "text-light-200"}>
              {user.emailVerified ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-light-200">Member since</span>
            <span className="text-light-100">
              {user.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-red-800 text-red-400 hover:bg-red-900/20 transition-colors rounded-lg py-2.5 text-sm font-medium cursor-pointer mt-2"
        >
          Sign Out
        </button>
      </div>

      {/* My Events */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Events</h2>
          <Link
            href="/create-event"
            className="bg-primary text-black text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            + Create Event
          </Link>
        </div>

        {eventsLoading ? (
          <div className="glass rounded-xl p-8 text-center text-light-200 text-sm">
            Loading your events...
          </div>
        ) : events.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center flex flex-col gap-2">
            <p className="text-light-200">You haven't created any events yet.</p>
            <Link href="/create-event" className="text-primary text-sm hover:underline">
              Create your first event →
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {events.map((event) => (
              <li key={event.slug}>
                <Link href={`/events/${event.slug}`}>
                  <div className="glass rounded-xl p-4 flex gap-4 items-center hover:border-primary/30 border border-transparent transition-colors card-shadow">
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-20 h-20 shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-semibold truncate">{event.title}</h3>
                      <p className="text-light-200 text-sm truncate">{event.description}</p>
                      <div className="flex items-center gap-3 text-xs text-light-200 mt-1">
                        <span>📅 {event.date}</span>
                        <span>📍 {event.location}</span>
                        <span className="pill">{event.mode}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}