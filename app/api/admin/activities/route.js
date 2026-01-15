import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Activity from '@/models/Activity';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkPermission } from '@/lib/rbac';

// GET - Get all activities
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        await dbConnect();

        let query = {};

        // Public users only see published activities
        if (!session) {
            query.status = 'published';
        } else if (session.user.role !== 'super_admin') {
            // Members see their own activities or published ones
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

        const activities = await Activity.find(query)
            .populate('createdBy', 'name email')
            .sort({ date: -1 });

        return NextResponse.json({ activities }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch activities: ' + error.message },
            { status: 500 }
        );
    }
}

// POST - Create new activity
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        if (!checkPermission(session.user, 'activities', 'create')) {
            return NextResponse.json(
                { error: 'You do not have permission to create activities' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, date, category, participantsCount, status } = body;

        if (!title?.en || !title?.te || !description?.en || !description?.te || !date) {
            return NextResponse.json(
                { error: 'Title (both languages), description (both languages), and date are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const activity = await Activity.create({
            title,
            description,
            date,
            category: category || 'other',
            participantsCount: participantsCount || 0,
            status: status || 'draft',
            createdBy: session.user.id,
        });

        return NextResponse.json(
            { message: 'Activity created successfully', activity },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create activity: ' + error.message },
            { status: 500 }
        );
    }
}

// PUT - Update activity
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        if (!checkPermission(session.user, 'activities', 'edit')) {
            return NextResponse.json(
                { error: 'You do not have permission to edit activities' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { activityId, ...updateData } = body;

        if (!activityId) {
            return NextResponse.json(
                { error: 'Activity ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Members can only edit their own activities
        let query = { _id: activityId };
        if (session.user.role !== 'super_admin') {
            query.createdBy = session.user.id;
        }

        const activity = await Activity.findOneAndUpdate(
            query,
            updateData,
            { new: true, runValidators: true }
        );

        if (!activity) {
            return NextResponse.json(
                { error: 'Activity not found or you do not have permission to edit it' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Activity updated successfully', activity },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update activity: ' + error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete activity
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        if (!checkPermission(session.user, 'activities', 'delete')) {
            return NextResponse.json(
                { error: 'You do not have permission to delete activities' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get('activityId');

        if (!activityId) {
            return NextResponse.json(
                { error: 'Activity ID is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Members can only delete their own activities
        let query = { _id: activityId };
        if (session.user.role !== 'super_admin') {
            query.createdBy = session.user.id;
        }

        const activity = await Activity.findOneAndDelete(query);

        if (!activity) {
            return NextResponse.json(
                { error: 'Activity not found or you do not have permission to delete it' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Activity deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete activity: ' + error.message },
            { status: 500 }
        );
    }
}
