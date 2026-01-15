import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    serviceHours: {
        type: Number,
        default: 5000,
    },
    peopleBenefited: {
        type: Number,
        default: 10000,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
