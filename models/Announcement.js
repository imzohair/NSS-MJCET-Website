import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
    title: {
        en: {
            type: String,
            required: [true, 'Please provide an English title'],
            trim: true,
        },
        te: {
            type: String,
            required: [true, 'Please provide a Telugu title'],
            trim: true,
        },
    },
    content: {
        en: {
            type: String,
            required: [true, 'Please provide English content'],
        },
        te: {
            type: String,
            required: [true, 'Please provide Telugu content'],
        },
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    expiryDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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

AnnouncementSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
