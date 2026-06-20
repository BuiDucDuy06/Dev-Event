'use client';

import { useState, useMemo, useEffect } from 'react';
import EventCard from '@/components/EventCard';
import { IEvent } from '@/database/event.model';

const MODES = ['online', 'offline', 'hybrid'] as const;

const DATE_FILTERS = [
  { label: 'All Dates', value: 'all' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Upcoming', value: 'upcoming' },
] as const;

type DateFilter = typeof DATE_FILTERS[number]['value'];

function isWithinRange(dateStr: string, filter: DateFilter): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  if (filter === 'upcoming') return date >= now;
  if (filter === 'week') {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    return date >= now && date <= weekEnd;
  }
  if (filter === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  return true;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border ${
        active
          ? 'bg-primary text-black border-primary'
          : 'bg-transparent text-light-200 border-[#333] hover:border-primary/50 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

export default function EventsClient({ events, initialSearch = '' }: { events: IEvent[], initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Derive all unique tags and locations from events
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    events.forEach((e) => e.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [events]);

  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    events.forEach((e) => { if (e.location) locs.add(e.location); });
    return Array.from(locs).sort();
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        event.title?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q) ||
        event.organizer?.toLowerCase().includes(q);

      const matchMode =
        selectedModes.length === 0 || selectedModes.includes(event.mode);

      const matchTag =
        selectedTags.length === 0 ||
        selectedTags.every((t) => event.tags?.includes(t));

      const matchDate = isWithinRange(event.date, dateFilter);

      const matchLocation =
        !selectedLocation || event.location === selectedLocation;

      return matchSearch && matchMode && matchTag && matchDate && matchLocation;
    });
  }, [events, search, selectedModes, selectedTags, dateFilter, selectedLocation]);

  const toggleMode = (mode: string) =>
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const clearAll = () => {
    setSearch('');
    setSelectedModes([]);
    setSelectedTags([]);
    setDateFilter('all');
    setSelectedLocation('');
  };

  const hasFilters = search || selectedModes.length || selectedTags.length || dateFilter !== 'all' || selectedLocation;

  return (
    <section className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">All Events</h1>
        <p className="text-light-200">Browse and filter upcoming developer events</p>
      </div>

      {/* Active search indicator */}
      {search && (
        <div className="flex items-center gap-2">
          <span className="text-light-200 text-sm">Searching for:</span>
          <span className="pill flex items-center gap-2">
            "{search}"
            <button onClick={() => setSearch('')} className="hover:text-white cursor-pointer">×</button>
          </span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Date filter */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-light-200 uppercase tracking-wider">Date</p>
          <div className="flex flex-wrap gap-2">
            {DATE_FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                label={f.label}
                active={dateFilter === f.value}
                onClick={() => setDateFilter(f.value)}
              />
            ))}
          </div>
        </div>

        {/* Mode filter */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-light-200 uppercase tracking-wider">Mode</p>
          <div className="flex flex-wrap gap-2">
            {MODES.map((mode) => (
              <FilterChip
                key={mode}
                label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                active={selectedModes.includes(mode)}
                onClick={() => toggleMode(mode)}
              />
            ))}
          </div>
        </div>

        {/* Location filter */}
        {allLocations.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-light-200 uppercase tracking-wider">Location</p>
            <div className="flex flex-wrap gap-2">
              {allLocations.map((loc) => (
                <FilterChip
                  key={loc}
                  label={loc}
                  active={selectedLocation === loc}
                  onClick={() => setSelectedLocation(selectedLocation === loc ? '' : loc)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-light-200 uppercase tracking-wider">Tags</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <FilterChip
                  key={tag}
                  label={tag}
                  active={selectedTags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="self-start text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-light-200 text-sm">
        {filtered.length} of {events.length} events
      </p>

      {/* Events */}
      {filtered.length > 0 ? (
        <ul className="events list-none">
          {filtered.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass rounded-xl p-12 text-center flex flex-col gap-2">
          <p className="text-light-100 text-lg">No events match your filters</p>
          <button onClick={clearAll} className="text-primary text-sm hover:underline cursor-pointer">
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}