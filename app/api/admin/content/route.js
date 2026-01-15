import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import SiteSettings from '@/models/SiteSettings';

// GET - Fetch content by pageId or SiteSettings
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'content' or 'settings'

        if (type === 'settings') {
            let settings = await SiteSettings.findOne();
            if (!settings) settings = await SiteSettings.create({});
            return Response.json({ settings }, { status: 200 });
        }

        const pageId = searchParams.get('pageId');

        if (pageId) {
            const content = await Content.findOne({ pageId });
            return Response.json({ content }, { status: 200 });
        }

        // List all content pages if no ID
        const contents = await Content.find({}).select('pageId title updatedAt');
        return Response.json({ contents }, { status: 200 });

    } catch (error) {
        console.error('Error fetching content:', error);
        return Response.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

// PUT - Update or Create Content / Settings
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const { type } = body;

        if (type === 'settings') {
            const { serviceHours, peopleBenefited } = body;
            const settings = await SiteSettings.findOneAndUpdate(
                {},
                {
                    serviceHours,
                    peopleBenefited,
                    updatedBy: session.user.id,
                    updatedAt: Date.now()
                },
                { new: true, upsert: true }
            );
            return Response.json({ settings }, { status: 200 });
        }

        const { pageId, title, content, sections } = body;

        if (!pageId) {
            return Response.json({ error: 'Page ID is required' }, { status: 400 });
        }

        // Upsert operations
        const updatedContent = await Content.findOneAndUpdate(
            { pageId },
            {
                title,
                content,
                sections,
                updatedBy: session.user.id,
                updatedAt: Date.now(),
            },
            { new: true, upsert: true, runValidators: true }
        );

        return Response.json({ content: updatedContent }, { status: 200 });
    } catch (error) {
        console.error('Error updating content:', error);
        return Response.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
