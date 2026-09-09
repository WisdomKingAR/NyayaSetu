import type { Request, Response, NextFunction } from 'express';
import {
  documentsService,
  NotFoundError,
  DocumentNotReadyError,
} from './documents.service';
import type { ApiResponse } from '../../types';

// Regex for basic UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

export const documentsController = {
  /**
   * GET /api/documents
   * List all documents, with optional search query (filename or case number).
   */
  async handleList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let search: string | undefined;
      if (typeof req.query.search === 'string') {
        search = req.query.search.trim().slice(0, 100);
      }

      const documents = await documentsService.listDocuments(search);
      const response: ApiResponse<{ documents: typeof documents; total: number }> = {
        success: true,
        data: {
          documents,
          total: documents.length,
        },
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/documents/upload
   * Upload a legal document (PDF / JPEG / PNG / WEBP, max 10MB) to Supabase Storage.
   */
  async handleUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file provided. Please attach a document with key "file".',
          },
        });
        return;
      }

      // Check isHandwritten flag
      const isHandwritten =
        req.body?.isHandwritten === true ||
        req.body?.isHandwritten === 'true';

      const doc = await documentsService.uploadDocument(file, isHandwritten);

      res.status(201).json({
        success: true,
        data: {
          documentId: doc.id,
          filename: doc.filename,
          status: doc.status,
          fileUrl: doc.fileUrl,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/documents/:id
   * Get single document metadata, extracted fields, and translated fields.
   */
  async handleGetOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid document ID format (UUID expected).',
          },
        });
        return;
      }

      const doc = await documentsService.getDocument(id);
      res.json({
        success: true,
        data: doc,
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: err.message,
          },
        });
        return;
      }
      next(err);
    }
  },

  /**
   * POST /api/documents/:id/process
   * Trigger the asynchronous-style OCR -> AI Summarization -> Translation pipeline.
   */
  async handleProcess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid document ID format (UUID expected).',
          },
        });
        return;
      }

      const updatedDoc = await documentsService.processDocument(id);
      res.json({
        success: true,
        data: updatedDoc,
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: err.message,
          },
        });
        return;
      }
      // Pipeline failures (OCR/AI/Translation) return 502 Bad Gateway
      res.status(502).json({
        success: false,
        error: {
          code: 'PIPELINE_ERROR',
          message: err instanceof Error ? err.message : 'Pipeline execution failed.',
        },
      });
    }
  },

  /**
   * POST /api/documents/:id/chat
   * Ask questions grounded exclusively in the document text.
   */
  async handleChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid document ID format (UUID expected).',
          },
        });
        return;
      }

      const { question } = req.body ?? {};
      if (typeof question !== 'string' || !question.trim()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_QUESTION',
            message: 'A non-empty "question" string is required.',
          },
        });
        return;
      }

      const trimmedQuestion = question.trim();
      if (trimmedQuestion.length > 500) {
        res.status(400).json({
          success: false,
          error: {
            code: 'QUESTION_TOO_LONG',
            message: 'Question must not exceed 500 characters.',
          },
        });
        return;
      }

      const answer = await documentsService.chatWithDocument(id, trimmedQuestion);
      res.json({
        success: true,
        data: { answer },
      });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: err.message,
          },
        });
        return;
      }
      if (err instanceof DocumentNotReadyError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'NOT_READY',
            message: err.message,
          },
        });
        return;
      }
      res.status(502).json({
        success: false,
        error: {
          code: 'CHAT_FAILED',
          message: err instanceof Error ? err.message : 'Chat inference failed.',
        },
      });
    }
  },
};
