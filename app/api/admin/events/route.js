import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkPermission } from '@/lib/rbac';

// GET - Get all events (Public for published, filtered for members)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        await dbConnect();

        let query = {};

        // Public users only see published events
        if (!session) {
            query.status = 'published';
        } else if (session.user.role !== 'super_admin') {
            // Members see their own events or published ones
            query = {
                $or: [
                    { status: 'published' },
                    { createdBy: session.user.id }
                ]
            };
        }

        // Admin can filter by status
        if (session?.user.role === 'super_admin' && status) {
            query.status = status;
        }

        const events = await Event.find(query)
            .populate('createdBy', 'name email')
            .sort({ date: -1 });

        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch events: ' + error.message },
            { status: 500 }
        );
    }
}

// POST - Create new event (Requires permission)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        if (!checkPermission(session.user, 'events', 'create')) {
            return NextResponse.json(
                { error: 'You do not have permission to create events' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, date, location, images, status } = body;

        if (!title?.en || !title?.te || !description?.en || !description?.te || !date || !location) {
            return NextResponse.json(
                { error: 'Title (both languages), description (both languages), date, and location are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const event = await Event.create({
            title,
            description,
            date,
            location,
            images: images || [],
            status: status || 'draft',
            createdBy: session.user.id,
        });

        return NextResponse.json(
            { message: 'Event created successfully', event },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create event: ' + error.message },
            { status: 500 }
        );
    }
}

// PUT - Update event (Requires permission)
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        if (!checkPermission(session.user, 'events', 'edit')) {
            return NextResponse.json(
                { error: 'You do not have permission to edit events' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { eventId, ...updateData } = body;

        if (!eventId) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Members can only edit their own events
        let query = { _id: eventId };
        if (session.user.role !== 'super_admin') {
            query.createdBy = session.user.id;
        }

        const event = await Event.findOneAndUpdate(
            query,
            updateData,
            { new: true, runValidators: true }
        );

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found or you do not have permission to edit it' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Event updated successfully', event },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update event: ' + error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete event (Requires permission)
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        if (!checkPermission(session.user, 'events', 'delete')) {
            return NextResponse.json(
                { error: 'You do not have permission to delete events' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json(
                { error: 'Event ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Members can only delete their own events
        let query = { _id: eventId };
        if (session.user.role !== 'super_admin') {
            query.createdBy = session.user.id;
        }

        const event = await Event.findOneAndDelete(query);

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found or you do not have permission to delete it' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Event deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete event: ' + error.message },
            { status: 500 }
        );
    }
}
