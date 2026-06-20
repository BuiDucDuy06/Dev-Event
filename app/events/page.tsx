import EventsClient from './EventsClient';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getEvents() {
  'use cache';
  cacheLife('hours');
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  return events ?? [];
}

const EventsPage = async ({ searchParams }: { searchParams: Promise<{ search?: string; tag?: string }> }) => {
  const { search, tag } = await searchParams;
  const events = await getEvents();
  return <EventsClient events={events} initialSearch={search ?? ''} initialTag={tag ?? ''} />;
};

export default EventsPage;