import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { validateForm } from '@/utils/validation';

// POST - Submit contact form (Public)
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        const validation = validateForm(body, {
            name: { required: true, message: 'Name is required' },
            email: { required: true, email: true },
            subject: { required: true, message: 'Subject is required' },
            message: { required: true, message: 'Message is required' },
        });

        if (!validation.isValid) {
            return NextResponse.json(
                { error: 'Validation failed', errors: validation.errors },
                { status: 400 }
            );
        }

        await dbConnect();

        // Create contact submission
        const contact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        return NextResponse.json(
            { message: 'Your message has been sent successfully! We will get back to you soon.', contact },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to send message: ' + error.message },
            { status: 500 }
        );
    }
}
