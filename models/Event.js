import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
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
    description: {
        en: {
            type: String,
            required: [true, 'Please provide an English description'],
        },
        te: {
            type: String,
            required: [true, 'Please provide a Telugu description'],
        },
    },
    date: {
        type: Date,
        required: [true, 'Please provide an event date'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    images: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
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

EventSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
