import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string) => {
    fs.unlink(filePath, (error) => {
        if (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        } else {
            console.log(`File deleted successfully: ${filePath}`);
        }
    });
};
