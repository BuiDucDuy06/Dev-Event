"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateEventForm from "@/components/CreateEventForm";

export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/sign-in");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <section className="max-w-2xl mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl">Create Event</h1>
        <p className="text-light-200">
          Fill in the details below to publish your developer event
        </p>
      </div>
      <CreateEventForm />
    </section>
  );
}