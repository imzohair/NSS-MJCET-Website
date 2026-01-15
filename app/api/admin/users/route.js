import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import TeamMember from '@/models/TeamMember';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { saveFile } from '@/lib/upload';

// GET - List all users (Super Admin only)
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        await dbConnect();

        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch users: ' + error.message },
            { status: 500 }
        );
    }
}

// POST - Create new user (Super Admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');
        const position = formData.get('position');
        const permissionsStr = formData.get('permissions');
        const isActiveStr = formData.get('isActive');
        const imageFile = formData.get('image');

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Handle image upload
        let imagePath = '';
        if (imageFile && imageFile.name) {
            imagePath = await saveFile(imageFile);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const permissions = permissionsStr ? JSON.parse(permissionsStr) : { pages: {}, modules: {} };
        const isActive = isActiveStr === 'true';

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'member',
            position: position || '',
            permissions,
            isActive,
            profilePicture: imagePath,
            createdBy: session.user.id,
        });

        // Automatically create TeamMember entry
        if (role !== 'super_admin') { // Don't add super_admin to team list automatically
            await TeamMember.create({
                name,
                role: position && position.toLowerCase().includes('secretary') ? 'GBS' : (position && position.toLowerCase().includes('lead') ? 'Execom' : 'Core'), // Simple heuristic, can be edited later
                position: position || 'Member',
                email,
                image: imagePath,
                linkedUserId: newUser._id
            });
        }

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return NextResponse.json(
            { message: 'User created successfully', user: userResponse },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create user: ' + error.message },
            { status: 500 }
        );
    }
}

// PUT - Update user (Super Admin only)
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const userId = formData.get('userId');
        const name = formData.get('name');
        const role = formData.get('role');
        const position = formData.get('position');
        const permissionsStr = formData.get('permissions');
        const isActiveStr = formData.get('isActive');
        const imageFile = formData.get('image');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await dbConnect();

        const updateData = {};
        if (name) updateData.name = name;
        if (role) updateData.role = role;
        if (position) updateData.position = position;
        if (permissionsStr) updateData.permissions = JSON.parse(permissionsStr);
        if (isActiveStr !== null) updateData.isActive = isActiveStr === 'true';

        if (imageFile && imageFile.size > 0) {
            updateData.profilePicture = await saveFile(imageFile);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Sync with TeamMember if it exists
        const linkedMember = await TeamMember.findOne({ linkedUserId: userId });
        if (linkedMember) {
            const memberUpdate = {};
            if (name) memberUpdate.name = name;
            if (position) memberUpdate.position = position;
            if (updateData.profilePicture) memberUpdate.image = updateData.profilePicture;

            await TeamMember.findByIdAndUpdate(linkedMember._id, memberUpdate);
        } else if (role !== 'super_admin') {
            // Create if not exists (and not super admin)
            await TeamMember.create({
                name: updatedUser.name,
                role: position && position.toLowerCase().includes('secretary') ? 'GBS' : (position && position.toLowerCase().includes('lead') ? 'Execom' : 'Core'),
                position: updatedUser.position || 'Member',
                email: updatedUser.email,
                image: updatedUser.profilePicture,
                linkedUserId: userId
            });
        }

        return NextResponse.json(
            { message: 'User updated successfully', user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update user: ' + error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete user (Super Admin only)
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await dbConnect();

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Also delete from TeamMember
        await TeamMember.findOneAndDelete({ linkedUserId: userId });

        return NextResponse.json(
            { message: 'User deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete user: ' + error.message },
            { status: 500 }
        );
    }
}
