import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
    },
    rollNumber: {
        type: String,
        required: [true, 'Please provide your roll number'],
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Please provide your department'],
    },
    year: {
        type: String,
        required: [true, 'Please provide your year'],
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    interests: [{
        type: String,
    }],
    message: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);
