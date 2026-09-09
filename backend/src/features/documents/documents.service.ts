import { v4 as uuid } from 'uuid';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { documentsRepository } from './documents.repository';
import { ocrService } from '../ocr/ocr.service';
import { aiService } from '../ai/ai.service';
import { translationService } from '../translation/translation.service';
import type { Document } from './documents.types';

/**
 * Documents feature business logic and pipeline orchestration.
 *
 * Coordinates across services (OCR, AI, Translation).
 * Controllers call methods here — they never orchestrate directly.
 * The repository is the only place that touches the DB.
 */
export const documentsService = {
  /**
   * Uploads a file to Supabase Storage and creates a document record.
   *
   * @param file - Multer file object (buffer from memory storage)
   * @param isHandwritten - Whether to flag document as handwritten
   * @param userId - Optional authenticated user ID
   * @returns Created document with status 'pending'
   */
  async uploadDocument(
    file: Express.Multer.File,
    isHandwritten: boolean,
    userId?: string,
  ): Promise<Document> {
    // Generate a unique storage path to avoid collisions
    const filePath = `${uuid()}-${file.originalname}`;

    // Upload file buffer to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('legal-documents')
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get the public URL for the stored file
    const { data: urlData } = supabaseAdmin.storage
      .from('legal-documents')
      .getPublicUrl(filePath);

    // Create the document record in Postgres
    try {
      return await documentsRepository.create({
        filename: file.originalname,
        filePath,
        fileUrl: urlData.publicUrl,
        isHandwritten,
        userId,
      });
    } catch (dbErr: unknown) {
      const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      if (errMsg.includes('row-level security policy')) {
        throw new Error(
          'Database insert failed due to Row-Level Security policy. Ensure SUPABASE_SERVICE_ROLE_KEY is set to the secret service_role key, not the public anon key.'
        );
      }
      throw dbErr;
    }
  },

  /**
   * Runs the full OCR -> Summarize -> Translate pipeline for a document.
   */
  async processDocument(id: string): Promise<Document> {
    const doc = await documentsRepository.findById(id);
    if (!doc) throw new NotFoundError('Document not found');

    try {
      // Step 1: OCR
      await documentsRepository.updateStatus(id, 'processing');
      const ocrResult = await ocrService.extractText(doc.fileUrl);
      await documentsRepository.updateOcrText(id, ocrResult.text);
      await documentsRepository.updateStatus(id, 'ocr_complete');

      // Step 2: Gemini structured extraction
      const extracted = await aiService.extractStructuredData(ocrResult.text);
      await documentsRepository.updateStatus(id, 'summarized');

      // Step 3: Sarvam translation (parallel, graceful fallback per field)
      const translated = await translationService.translateFields({
        caseNumber: extracted.caseNumber,
        parties: extracted.parties,
        courtName: extracted.courtName,
        nextHearingDate: extracted.nextHearingDate,
        summaryEn: extracted.summaryEn,
      });

      // Persist all extracted + translated fields
      await documentsRepository.updateSummary(id, { ...extracted, ...translated });
      await documentsRepository.updateStatus(id, 'complete');

      const updatedDoc = await documentsRepository.findById(id);
      if (!updatedDoc) throw new Error('Document not found after processing');
      return updatedDoc;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Pipeline failed';
      await documentsRepository.updateStatus(id, 'error', message).catch(() => {});
      throw err;
    }
  },

  /** Retrieve a single document by ID */
  async getDocument(id: string): Promise<Document> {
    const doc = await documentsRepository.findById(id);
    if (!doc) throw new NotFoundError('Document not found');
    return doc;
  },

  /** List all documents, optionally filtered by search */
  async listDocuments(search?: string): Promise<Document[]> {
    return documentsRepository.list(search);
  },

  /**
   * Answers a user question grounded in the document's OCR text.
   * Supports targetLanguage ('en' or 'mr') and ensures proper Marathi output.
   */
  async chatWithDocument(
    id: string,
    question: string,
    targetLanguage?: 'mr' | 'en',
  ): Promise<string> {
    const doc = await documentsRepository.findById(id);
    if (!doc) throw new NotFoundError('Document not found');

    if (doc.status !== 'complete') {
      throw new DocumentNotReadyError(
        'Document processing is not complete. Please wait for status to be "complete" before chatting.',
      );
    }

    if (!doc.ocrText) {
      throw new DocumentNotReadyError('Document has no OCR text. Processing may have failed.');
    }

    // Determine if Marathi is requested either explicitly via targetLanguage,
    // or implicitly by Devanagari characters in question or the word "marathi"
    const isMarathiRequested =
      targetLanguage === 'mr' ||
      /[\u0900-\u097F]/.test(question) ||
      /\bmarathi\b/i.test(question) ||
      question.toLowerCase().includes('मराठी');

    const answer = await aiService.chat(
      doc.ocrText,
      question,
      isMarathiRequested ? 'mr' : 'en',
    );

    if (isMarathiRequested) {
      const devanagariCount = (answer.match(/[\u0900-\u097F]/g) || []).length;
      const latinCount = (answer.match(/[a-zA-Z]/g) || []).length;

      // If the answer contains predominantly English text, translate it to Marathi
      if (devanagariCount < 15 || latinCount > devanagariCount) {
        try {
          const translated = await translationService.translate(answer, 'en-IN', 'mr-IN');
          if (translated && translated.trim().length > 0) {
            return translated.trim();
          }
        } catch {
          // Fall back to the original answer if translation fails
        }
      }
    }

    return answer;
  },
};

/** Custom error classes for semantic HTTP status mapping in the controller */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class DocumentNotReadyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DocumentNotReadyError';
  }
}
