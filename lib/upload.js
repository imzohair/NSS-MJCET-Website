import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function saveFile(file) {
    if (!file) return null;

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${timestamp}-${originalName}`;

        // Check if we're in production (Vercel) or development
        const isProduction = process.env.VERCEL_ENV === 'production' || process.env.BLOB_READ_WRITE_TOKEN;

        if (isProduction && process.env.BLOB_READ_WRITE_TOKEN) {
            // Use Vercel Blob in production
            console.log('Uploading to Vercel Blob:', filename);
            const blob = await put(filename, buffer, {
                access: 'public',
                contentType: file.type || 'image/jpeg',
            });
            console.log('Blob uploaded:', blob.url);
            return blob.url;
        } else {
            // Use local filesystem in development
            console.log('Saving to local filesystem:', filename);
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            const path = join(uploadDir, filename);
            await writeFile(path, buffer);

            return `/uploads/${filename}`;
        }
    } catch (error) {
        console.error('Error saving file:', error);
        throw new Error('Failed to save file: ' + error.message);
    }
}
