import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';

// GET - Fetch all contact submissions
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const contacts = await Contact.find({})
            .sort({ submittedAt: -1 });

        return Response.json({ contacts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        return Response.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
    }
}

// PUT - Update contact status
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

        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!contact) {
            return Response.json({ error: 'Contact submission not found' }, { status: 404 });
        }

        return Response.json({ contact }, { status: 200 });
    } catch (error) {
        console.error('Error updating contact status:', error);
        return Response.json({ error: 'Failed to update contact status' }, { status: 500 });
    }
}

// DELETE - Delete contact submission
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
            return Response.json({ error: 'ID is required' }, { status: 400 });
        }

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return Response.json({ error: 'Contact submission not found' }, { status: 404 });
        }

        return Response.json({ message: 'Deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting contact submission:', error);
        return Response.json({ error: 'Failed to delete contact submission' }, { status: 500 });
    }
}
