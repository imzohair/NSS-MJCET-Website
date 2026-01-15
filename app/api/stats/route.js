import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Volunteer from '@/models/Volunteer';
import TeamMember from '@/models/TeamMember';
import Event from '@/models/Event';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    try {
        await dbConnect();

        // 1. Active Volunteers: Unique count of (Approved Volunteers + Team Members)
        const volunteerEmails = await Volunteer.find({ status: 'approved' }).distinct('email');
        const teamEmails = await TeamMember.find({}).distinct('email');

        // Combine and count unique emails
        const uniqueVolunteers = new Set([...volunteerEmails, ...teamEmails]);
        const volunteerCount = uniqueVolunteers.size;

        // 2. Events Conducted
        let eventCount = 0;
        try {
            eventCount = await Event.countDocuments({ status: 'published' }); // Only count published events? Or all? Usually conducted implies published/completed.
            // If no status field, countDocuments({})
            // Previous view of Event.js showed `status` field enum ['draft', 'published'].
        } catch (e) {
            console.warn("Event model error", e);
        }

        // 3. Service Hours & Beneficiaries from SiteSettings
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({});
        }

        return NextResponse.json({
            volunteers: volunteerCount,
            events: eventCount,
            serviceHours: settings.serviceHours,
            beneficiaries: settings.peopleBenefited
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
