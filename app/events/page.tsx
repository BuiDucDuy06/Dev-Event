import EventsClient from './EventsClient';

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getEvents() {
  'use cache';
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  return events ?? [];
}

const EventsPage = async ({ searchParams }: { searchParams: Promise<{ search?: string }> }) => {
  const { search } = await searchParams;
  const events = await getEvents();

  return <EventsClient events={events} initialSearch={search ?? ''} />;
};

export default EventsPage;