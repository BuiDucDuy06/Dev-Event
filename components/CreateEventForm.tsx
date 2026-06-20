"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Image from "next/image";

const BASE_URL =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

const MODES = ["online", "offline", "hybrid"] as const;

export default function CreateEventForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [agendaInput, setAgendaInput] = useState("");
  const [agendaItems, setAgendaItems] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "online" as (typeof MODES)[number],
    audience: "",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const addAgenda = () => {
    const trimmed = agendaInput.trim();
    if (trimmed && !agendaItems.includes(trimmed)) {
      setAgendaItems((prev) => [...prev, trimmed]);
      setAgendaInput("");
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.image) return setError("Please upload an event image.");
    if (agendaItems.length === 0) return setError("Add at least one agenda item.");
    if (tags.length === 0) return setError("Add at least one tag.");

    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key !== "image" && val !== null) data.append(key, val as string);
    });
    data.append("image", form.image);
    const organizer = user?.displayName || user?.email?.split("@")[0] || user?.uid || "Anonymous";
    data.append("organizer", organizer);
    data.append("agenda", JSON.stringify(agendaItems));
    data.append("tags", JSON.stringify(tags));

    try {
      const res = await fetch(`${BASE_URL}/api/events`, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create event");
      router.push(`/events/${json.event.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-light-100">Event Banner *</label>
        <label
          htmlFor="image-upload"
          className="cursor-pointer glass rounded-xl border border-dashed border-[#333] flex flex-col items-center justify-center gap-3 py-10 hover:border-primary/50 transition-colors"
        >
          {preview ? (
            <Image
              src={preview}
              alt="preview"
              width={600}
              height={300}
              className="w-full max-h-56 object-cover rounded-lg"
            />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-light-200 text-sm">Click to upload event image</p>
            </>
          )}
        </label>
        <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </div>

      <Field label="Event Title *">
        <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. React Conf 2025" className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50" />
      </Field>

      <Field label="Short Description *">
        <textarea name="description" value={form.description} onChange={handleChange} required rows={2} maxLength={1000} placeholder="A short description shown on the event card" className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
      </Field>

      <Field label="Full Overview *">
        <textarea name="overview" value={form.overview} onChange={handleChange} required rows={3} maxLength={500} placeholder="A detailed description of what attendees can expect" className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Venue *">
          <input name="venue" value={form.venue} onChange={handleChange} required placeholder="e.g. Convention Center Hall A" className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50" />
        </Field>
        <Field label="City / Location *">
          <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. San Francisco, CA" className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date *">
          <input name="date" type="date" value={form.date} onChange={handleChange} required className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50" />
        </Field>
        <Field label="Time *">
          <input name="time" type="time" value={form.time} onChange={handleChange} required className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Mode *">
          <select name="mode" value={form.mode} onChange={handleChange} className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50">
            {MODES.map((m) => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
        </Field>
        <Field label="Target Audience *">
          <input name="audience" value={form.audience} onChange={handleChange} required placeholder="e.g. Frontend Developers" className="bg-dark-200 rounded-lg px-5 py-2.5 w-full text-sm outline-none focus:ring-1 focus:ring-primary/50" />
        </Field>
      </div>

      <Field label="Agenda Items *">
        <div className="flex gap-2">
          <input value={agendaInput} onChange={(e) => setAgendaInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAgenda())} placeholder="e.g. Keynote: The Future of React" className="bg-dark-200 rounded-lg px-5 py-2.5 flex-1 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
          <button type="button" onClick={addAgenda} className="bg-dark-200 hover:bg-dark-200/70 border border-[#333] px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">Add</button>
        </div>
        {agendaItems.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1">
            {agendaItems.map((item, i) => (
              <li key={i} className="flex items-center justify-between bg-dark-200/50 rounded-lg px-4 py-2 text-sm">
                <span className="text-light-100">{item}</span>
                <button type="button" onClick={() => setAgendaItems((prev) => prev.filter((_, idx) => idx !== i))} className="text-light-200 hover:text-white cursor-pointer ml-4">×</button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      <Field label="Tags *">
        <div className="flex gap-2">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="e.g. react, typescript, nextjs" className="bg-dark-200 rounded-lg px-5 py-2.5 flex-1 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
          <button type="button" onClick={addTag} className="bg-dark-200 hover:bg-dark-200/70 border border-[#333] px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">Add</button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="pill flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} className="hover:text-white cursor-pointer">×</button>
              </span>
            ))}
          </div>
        )}
      </Field>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 px-4 py-3 rounded-lg">{error}</p>
      )}

      <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold rounded-lg py-3 text-base transition-colors cursor-pointer">
        {loading ? "Publishing…" : "Publish Event"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-light-100">{label}</label>
      {children}
    </div>
  );
}