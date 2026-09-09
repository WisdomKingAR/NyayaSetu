import { Router } from 'express';
import multer from 'multer';
import { documentsController } from './documents.controller';
import { fileFilter, MAX_FILE_SIZE_BYTES } from '../../middleware/fileValidator';

export const documentsRouter = Router();

// Configure Multer for in-memory uploads with size limits and MIME filtering
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES, // 10MB
  },
  fileFilter,
});

/**
 * GET /api/documents
 * List all documents, optional search filter
 */
documentsRouter.get('/', documentsController.handleList);

/**
 * POST /api/documents/upload
 * Upload document to Supabase storage + create document entity
 */
documentsRouter.post(
  '/upload',
  upload.single('file'),
  documentsController.handleUpload,
);

/**
 * GET /api/documents/:id
 * Retrieve single document details
 */
documentsRouter.get('/:id', documentsController.handleGetOne);

/**
 * POST /api/documents/:id/process
 * Run OCR -> Gemini Summarize -> Sarvam Translate pipeline
 */
documentsRouter.post('/:id/process', documentsController.handleProcess);

/**
 * POST /api/documents/:id/chat
 * Context-grounded legal assistant chat
 */
documentsRouter.post('/:id/chat', documentsController.handleChat);
