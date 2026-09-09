import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

/**
 * Whitelist of accepted MIME types for document uploads.
 * Checked explicitly against file.mimetype (not just the extension)
 * to prevent MIME spoofing (e.g. renaming an .exe to .pdf).
 */
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/x-pdf',
  'application/acrobat',
  'applications/vnd.pdf',
  'text/pdf',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp',
]);

/**
 * Multer fileFilter callback - rejects files with disallowed MIME types.
 * Supports fallback for Windows browsers that send generic application/octet-stream.
 */
export function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  const mime = (file.mimetype || '').toLowerCase();
  const ext = (file.originalname || '').toLowerCase().split('.').pop() || '';

  if (ALLOWED_MIME_TYPES.has(mime)) {
    return cb(null, true);
  }

  // Fallback for Windows clients reporting application/octet-stream with valid extension
  if (['application/octet-stream', 'binary/octet-stream', ''].includes(mime)) {
    if (['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      if (ext === 'pdf') file.mimetype = 'application/pdf';
      else if (ext === 'png') file.mimetype = 'image/png';
      else if (ext === 'webp') file.mimetype = 'image/webp';
      else file.mimetype = 'image/jpeg';
      return cb(null, true);
    }
  }

  cb(
    new Error(
      `INVALID_FILE_TYPE: Only PDF, JPEG, PNG, and WEBP files are accepted. Received: ${file.mimetype || 'unknown'} (.${ext})`,
    ),
  );
}

/** 10MB file size limit - enforced by multer before file buffer is read */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
