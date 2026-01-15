import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    pageId: {
        type: String,
        required: true,
        unique: true,
        // Examples: 'about', 'unit-details', 'nss-motto', etc.
    },
    title: {
        en: {
            type: String,
            required: true,
        },
        te: {
            type: String,
            required: true,
        },
    },
    content: {
        en: {
            type: String,
            required: true,
        },
        te: {
            type: String,
            required: true,
        },
    },
    sections: [{
        heading: {
            en: String,
            te: String,
        },
        content: {
            en: String,
            te: String,
        },
    }],
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

ContentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
