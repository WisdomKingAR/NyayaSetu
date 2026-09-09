import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

/**
 * Whitelist of accepted MIME types for document uploads.
 * Checked explicitly against file.mimetype (not just the extension)
 * to prevent MIME spoofing (e.g. renaming an .exe to .pdf).
 */
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

/**
 * Multer fileFilter callback - rejects files with disallowed MIME types.
 * Throws an error with INVALID_FILE_TYPE prefix so errorHandler can catch it.
 */
export function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `INVALID_FILE_TYPE: Only PDF, JPEG, PNG, and WEBP files are accepted. Received: ${file.mimetype}`,
      ),
    );
  }
}

/** 10MB file size limit - enforced by multer before file buffer is read */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
