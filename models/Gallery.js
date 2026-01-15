import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    caption: {
        en: {
            type: String,
            default: '',
        },
        te: {
            type: String,
            default: '',
        },
    },
    category: {
        type: String,
        enum: ['events', 'team', 'awards', 'other'],
        default: 'other',
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
