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

        // Ensure directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Save file
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        // Return public path
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Error saving file:', error);
        throw new Error('Failed to save file');
    }
}
