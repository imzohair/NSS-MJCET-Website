import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Volunteer from '@/models/Volunteer';

// GET - Fetch all volunteers
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const volunteers = await Volunteer.find({})
            .sort({ submittedAt: -1 });

        return Response.json({ volunteers }, { status: 200 });
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        return Response.json({ error: 'Failed to fetch volunteers' }, { status: 500 });
    }
}

// PUT - Update volunteer status
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return Response.json({ error: 'ID and status are required' }, { status: 400 });
        }

        const volunteer = await Volunteer.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!volunteer) {
            return Response.json({ error: 'Volunteer not found' }, { status: 404 });
        }

        return Response.json({ volunteer }, { status: 200 });
    } catch (error) {
        console.error('Error updating volunteer:', error);
        return Response.json({ error: 'Failed to update volunteer' }, { status: 500 });
    }
}
