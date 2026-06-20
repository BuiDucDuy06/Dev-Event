'use client';

import { useState, useEffect, useRef } from 'react';
import EventCard from '@/components/EventCard';
import { IEvent } from '@/database/event.model';

const AUTO_SLIDE_INTERVAL = 3000;
const VISIBLE = 3;

export default function SimilarEventsSlider({ events }: { events: IEvent[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = events.length;
  const maxIndex = Math.max(0, total - VISIBLE);

  const next = () => setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  const prev = () => setCurrent((c) => (c <= 0 ? maxIndex : c - 1));

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), AUTO_SLIDE_INTERVAL);
  };

  useEffect(() => {
    if (total <= VISIBLE) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total]);

  if (total === 0) return null;

  // Calculate translateX per card width including gap
  const translateX = total > VISIBLE ? `calc(-${current} * (100% / ${VISIBLE} + ${16 / VISIBLE}px))` : '0%';

  return (
    <div className="flex w-full flex-col gap-4 pt-20">
      <h2>Similar Events</h2>

      <div className="relative group">
        {/* Left arrow */}
        {total > VISIBLE && (
          <button
            onClick={() => { prev(); resetTimer(); }}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-dark-200 border border-[#333] flex items-center justify-center text-light-200 hover:text-white hover:border-primary/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}

        {/* Cards */}
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * (100 / VISIBLE)}%)` }}
          >
            {events.map((event) => (
              <div
                key={event.title}
                className="shrink-0"
                style={{ width: `calc((100% - ${(VISIBLE - 1) * 16}px) / ${VISIBLE})` }}
              >
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        {total > VISIBLE && (
          <button
            onClick={() => { next(); resetTimer(); }}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-dark-200 border border-[#333] flex items-center justify-center text-light-200 hover:text-white hover:border-primary/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dots */}
      {total > VISIBLE && (
        <div className="flex justify-center gap-1.5 mt-1">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetTimer(); }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === current ? 'w-6 bg-primary' : 'w-1.5 bg-[#333] hover:bg-primary/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}