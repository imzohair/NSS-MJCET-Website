import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';
import Volunteer from '@/models/Volunteer';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Admin Dashboard Stats
        const usersCount = await User.countDocuments({});
        const eventsCount = await Event.countDocuments({}); // Total events (including drafts)
        const pendingVolunteersCount = await Volunteer.countDocuments({ status: 'pending' });

        return NextResponse.json({
            users: usersCount,
            events: eventsCount,
            volunteers: pendingVolunteersCount
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
