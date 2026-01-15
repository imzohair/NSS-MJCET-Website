import dbConnect from '@/lib/db';
import Announcement from '@/models/Announcement';
import AnnouncementsClient from './AnnouncementsClient';

export const metadata = {
    title: 'Announcements - NSS MJCET',
    description: 'Latest announcements and notices from NSS MJCET',
};

async function getAnnouncements() {
    await dbConnect();

    const announcements = await Announcement.find({
        isActive: true,
        $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
        ]
    })
        .sort({ priority: -1, createdAt: -1 })
        .lean();

    return announcements.map(announcement => ({
        ...announcement,
        _id: announcement._id.toString(),
        createdBy: announcement.createdBy?.toString(),
        createdAt: announcement.createdAt.toISOString(),
        expiryDate: announcement.expiryDate?.toISOString(),
    }));
}

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements();

    return <AnnouncementsClient announcements={announcements} />;
}
