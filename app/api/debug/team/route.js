import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TeamMember from '@/models/TeamMember';

export async function GET() {
    try {
        await dbConnect();

        const members = await TeamMember.find({}).lean();

        return NextResponse.json({
            success: true,
            count: members.length,
            members: members.map(m => ({
                id: m._id.toString(),
                name: m.name,
                role: m.role,
                position: m.position,
            }))
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
