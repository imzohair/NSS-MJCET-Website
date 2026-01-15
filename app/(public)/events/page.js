import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import EventsClient from './EventsClient';

export const metadata = {
    title: 'Events - NSS MJCET',
    description: 'Upcoming and past events organized by NSS MJCET',
};

async function getEvents() {
    await dbConnect();

    const events = await Event.find({ status: 'published' })
        .sort({ date: -1 })
        .lean();

    // Convert MongoDB ObjectId to string
    return events.map(event => ({
        ...event,
        _id: event._id.toString(),
        createdBy: event.createdBy?.toString(),
        date: event.date.toISOString(),
    }));
}

export default async function EventsPage() {
    const events = await getEvents();

    return <EventsClient events={events} />;
}
