import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['GBS', 'Execom', 'Core'],
        default: 'Core',
        required: true,
    },
    position: {
        type: String,
        default: '',
    },
    image: {
        type: String, // Path to image
        default: '',
    },
    email: {
        type: String,
        trim: true,
    },
    linkedin: {
        type: String,
        default: '',
    },
    github: {
        type: String,
        default: '',
    },
    order: {
        type: Number,
        default: 0,
    },
    linkedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
