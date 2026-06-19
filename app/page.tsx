import EventCard from '@/components/EventCard'
import ExploreBtn from '@/components/ExploreBtn'
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  (process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000');

const page = async() => {
  'use cache';
  cacheLife('hours')
  const response = await fetch(`${BASE_URL}/api/events`);
  const {events} = await response.json();

  return (
    <section>
      <div className='flex flex-col items-center text-center gap-5 px-4'>
      <h1 className='text-center'>Developer Events</h1>
      <p className='text-center mt-5 max-w-xl'>From hackathons to conferences, find events that level up your skills,
          grow your network, and connect you with the dev community.</p>
          
      <ExploreBtn />
      </div>


      <div id="events" className="mt-10 space-y-7 scroll-mt-24">
        <div className="flex items-center justify-between">
          <h3>Featured Events</h3>
          <span className="text-light-200 text-sm">{events?.length ?? 0} events</span>
        </div>

        {events && events.length > 0 ? (
          <ul className="events list-none">
            {events.map((event: IEvent) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="glass rounded-xl p-12 text-center text-light-200">
            <p className="text-lg">No events yet.</p>
            <p className="text-sm mt-2">Be the first to create one!</p>
          </div>
        )}
      </div>

    </section>
  )
}

export default page