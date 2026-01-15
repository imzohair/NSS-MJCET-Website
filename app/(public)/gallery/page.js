import dbConnect from '@/lib/db';
import Gallery from '@/models/Gallery';
import GalleryClient from './GalleryClient';

export const metadata = {
    title: 'Gallery - NSS MJCET',
    description: 'Photo gallery of NSS MJCET events and activities',
};

async function getGalleryImages() {
    await dbConnect();

    // Fetch all images, sorted by newest first (assuming createdAt exists, or just implicit _id order)
    // The Gallery model doesn't explicitly have createdAt in the earlier view_file, checking if timestamps: true is there?
    // Looking at models/Gallery.js (viewed earlier): "timestamps: true" was present.

    const images = await Gallery.find({})
        .sort({ createdAt: -1 })
        .lean();

    return images.map(img => ({
        ...img,
        _id: img._id.toString(),
        eventId: img.eventId ? img.eventId.toString() : null,
        activityId: img.activityId ? img.activityId.toString() : null,
        uploadedBy: img.uploadedBy ? img.uploadedBy.toString() : null,
        createdAt: img.createdAt ? img.createdAt.toISOString() : null,
        updatedAt: img.updatedAt ? img.updatedAt.toISOString() : null,
    }));
}

export default async function GalleryPage() {
    const images = await getGalleryImages();
    return <GalleryClient initialImages={images} />;
}
