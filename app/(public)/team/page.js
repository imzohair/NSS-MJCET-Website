import dbConnect from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import TeamClient from './TeamClient';

export const metadata = {
    title: 'Our Team - NSS MJCET',
    description: 'Meet the NSS MJCET team members and office bearers',
};

async function getTeamMembers() {
    await dbConnect();

    const members = await TeamMember.find({})
        .sort({ order: 1, createdAt: -1 })
        .lean();

    return members.map(member => ({
        ...member,
        _id: member._id.toString(),
        linkedUserId: member.linkedUserId ? member.linkedUserId.toString() : null,
        createdAt: member.createdAt ? member.createdAt.toISOString() : null,
        linkedin: member.linkedin || '',
        github: member.github || '',
    }));
}

export default async function TeamPage() {
    const members = await getTeamMembers();
    return <TeamClient members={members} />;
}
