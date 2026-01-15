import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['super_admin', 'member'],
        default: 'member',
    },
    profilePicture: {
        type: String,
        default: '',
    },
    position: {
        type: String,
        default: '',
        // Examples: Documentation Lead, Media Team, Core Team, etc.
    },
    permissions: {
        pages: {
            events: { type: Boolean, default: false },
            activities: { type: Boolean, default: false },
            announcements: { type: Boolean, default: false },
            gallery: { type: Boolean, default: false },
            content: { type: Boolean, default: false },
            team: { type: Boolean, default: false },
        },
        modules: {
            canCreateEvents: { type: Boolean, default: false },
            canEditEvents: { type: Boolean, default: false },
            canDeleteEvents: { type: Boolean, default: false },
            canCreateActivities: { type: Boolean, default: false },
            canEditActivities: { type: Boolean, default: false },
            canDeleteActivities: { type: Boolean, default: false },
            canCreateAnnouncements: { type: Boolean, default: false },
            canEditAnnouncements: { type: Boolean, default: false },
            canDeleteAnnouncements: { type: Boolean, default: false },
            canUploadGallery: { type: Boolean, default: false },
            canDeleteGallery: { type: Boolean, default: false },
            canEditContent: { type: Boolean, default: false },
        }
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
