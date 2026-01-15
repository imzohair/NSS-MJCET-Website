import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Announcement from '@/models/Announcement';

// GET - Fetch all announcements
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const announcements = await Announcement.find({})
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        return Response.json({ announcements }, { status: 200 });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return Response.json({ error: 'Failed to fetch announcements' }, { status: 500 });
    }
}

// POST - Create new announcement
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const { title, content, priority, expiryDate, isActive } = body;

        const announcement = await Announcement.create({
            title,
            content,
            priority: priority || 'medium',
            expiryDate: expiryDate || null,
            isActive: isActive !== undefined ? isActive : true,
            createdBy: session.user.id,
        });

        return Response.json({ announcement }, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return Response.json({ error: 'Failed to create announcement' }, { status: 500 });
    }
}

// PUT - Update announcement
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const { id, title, content, priority, expiryDate, isActive } = body;

        if (!id) {
            return Response.json({ error: 'Announcement ID is required' }, { status: 400 });
        }

        const announcement = await Announcement.findByIdAndUpdate(
            id,
            {
                title,
                content,
                priority,
                expiryDate,
                isActive,
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true }
        );

        if (!announcement) {
            return Response.json({ error: 'Announcement not found' }, { status: 404 });
        }

        return Response.json({ announcement }, { status: 200 });
    } catch (error) {
        console.error('Error updating announcement:', error);
        return Response.json({ error: 'Failed to update announcement' }, { status: 500 });
    }
}

// DELETE - Delete announcement
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return Response.json({ error: 'Announcement ID is required' }, { status: 400 });
        }

        const announcement = await Announcement.findByIdAndDelete(id);

        if (!announcement) {
            return Response.json({ error: 'Announcement not found' }, { status: 404 });
        }

        return Response.json({ message: 'Announcement deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return Response.json({ error: 'Failed to delete announcement' }, { status: 500 });
    }
}
