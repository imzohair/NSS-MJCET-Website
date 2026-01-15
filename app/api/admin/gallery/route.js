import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Gallery from '@/models/Gallery';

// GET - Fetch all gallery images
export async function GET(request) {
    try {
        await dbConnect();

        // Allow public access to GET gallery, but filter if needed?
        // Actually, the prompt says "Admin routes... Public/Admin layout separation".
        // This is an /api/admin/... route, so it should be protected.
        // Public fetching will surely go through a different route or directly use server actions/mongoose in page.js (since public page is moving to server component).
        // BUT, the admin page needs to fetch all images to manage them.

        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const images = await Gallery.find({})
            .sort({ createdAt: -1 })
            .populate('eventId', 'title')
            .populate('activityId', 'title') // keeping activityId for legacy data support if any, though activities are removed from UI
            .populate('uploadedBy', 'name');

        return Response.json({ images }, { status: 200 });
    } catch (error) {
        console.error('Error fetching gallery:', error);
        return Response.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

// POST - Add new gallery image
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'super_admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const formData = await request.formData();
        const imageFile = formData.get('image');
        const captionEn = formData.get('captionEn');
        const captionTe = formData.get('captionTe');
        const category = formData.get('category');
        const eventId = formData.get('eventId');

        if (!imageFile || !imageFile.name) {
            return Response.json({ error: 'Image file is required' }, { status: 400 });
        }

        // Import saveFile dynamically
        const { saveFile } = await import('@/lib/upload');
        const imagePath = await saveFile(imageFile);

        const galleryItem = await Gallery.create({
            imageUrl: imagePath,
            caption: {
                en: captionEn || '',
                te: captionTe || '',
            },
            category: category || 'other',
            eventId: eventId || null,
            uploadedBy: session.user.id,
        });

        return Response.json({ galleryItem }, { status: 201 });
    } catch (error) {
        console.error('Error creating gallery item:', error);
        return Response.json({ error: 'Failed to create gallery item' }, { status: 500 });
    }
}

// DELETE - Delete gallery image
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
            return Response.json({ error: 'Gallery ID is required' }, { status: 400 });
        }

        const galleryItem = await Gallery.findByIdAndDelete(id);

        if (!galleryItem) {
            return Response.json({ error: 'Gallery item not found' }, { status: 404 });
        }

        return Response.json({ message: 'Gallery item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return Response.json({ error: 'Failed to delete gallery item' }, { status: 500 });
    }
}
