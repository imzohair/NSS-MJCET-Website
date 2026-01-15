import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { saveFile } from '@/lib/upload';

// GET - Get all team members grouped by role (Publicly accessible but Admin filters)
export async function GET(request) {
    try {
        await dbConnect();
        const members = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ team: members }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create Team Member (Admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['super_admin', 'member'].includes(session.user.role)) { // Basic RBAC
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const name = formData.get('name');
        const role = formData.get('role');
        const position = formData.get('position');
        const email = formData.get('email');
        const linkedin = formData.get('linkedin');
        const github = formData.get('github');
        const imageFile = formData.get('image');

        if (!name || !role) {
            return NextResponse.json({ error: 'Name and Role are required' }, { status: 400 });
        }

        let imagePath = '';
        if (imageFile && imageFile.name) {
            imagePath = await saveFile(imageFile);
        }

        await dbConnect();

        const member = await TeamMember.create({
            name,
            role,
            position,
            email,
            linkedin: linkedin || '',
            github: github || '',
            image: imagePath
        });

        return NextResponse.json({ message: 'Team member added', member }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add member: ' + error.message }, { status: 500 });
    }
}

// PUT - Update Member
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await request.formData();
        const id = formData.get('id');
        const name = formData.get('name');
        const role = formData.get('role');
        const position = formData.get('position');
        const email = formData.get('email');
        const linkedin = formData.get('linkedin');
        const github = formData.get('github');
        const imageFile = formData.get('image');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await dbConnect();

        const updateData = {};
        if (name) updateData.name = name;
        if (role) updateData.role = role;
        if (position) updateData.position = position;
        if (email) updateData.email = email;
        if (linkedin !== null && linkedin !== undefined) updateData.linkedin = linkedin;
        if (github !== null && github !== undefined) updateData.github = github;

        if (imageFile && imageFile.size > 0) {
            updateData.image = await saveFile(imageFile);
        }

        const member = await TeamMember.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ message: 'Updated successfully', member }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete Member
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await dbConnect();
        await TeamMember.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
