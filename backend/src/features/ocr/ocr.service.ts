import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config';
import type { OcrResult } from './ocr.types';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * High-accuracy OCR service for Indian legal documents.
 *
 * Primary: Sarvam AI Document Intelligence API (/doc-ai/v1/job/digitise).
 * Fallback: Google Gemini Multimodal OCR (if Sarvam job fails or times out).
 */
export const ocrService = {
  /**
   * Extracts all readable text from a publicly accessible document URL.
   *
   * @param fileUrl - Public Supabase Storage URL of the uploaded document
   * @returns OcrResult with extracted text
   */
  async extractText(fileUrl: string): Promise<OcrResult> {
    // Step 1: Download the file buffer from Supabase Storage
    const fileRes = await fetch(fileUrl, { signal: AbortSignal.timeout(20_000) });
    if (!fileRes.ok) {
      throw new Error(`Failed to download document from storage: ${fileRes.status} ${fileRes.statusText}`);
    }
    const contentType = fileRes.headers.get('content-type') || 'application/pdf';
    const arrayBuf = await fileRes.arrayBuffer();
    const fileBlob = new Blob([arrayBuf], { type: contentType });

    // Derive a clean filename from the URL
    const urlFilename = fileUrl.split('/').pop()?.split('?')[0] || 'document.pdf';

    // Step 2: Attempt Sarvam AI Document Intelligence OCR
    try {
      const sarvamText = await this.extractWithSarvam(fileBlob, urlFilename);
      if (sarvamText && sarvamText.trim().length > 0) {
        return { text: sarvamText.trim() };
      }
    } catch (sarvamErr) {
      console.warn('[ocrService] Sarvam Document AI failed or timed out. Falling back to Gemini OCR.', sarvamErr);
    }

    // Step 3: Fallback to Google Gemini Multimodal OCR
    try {
      const geminiText = await this.extractWithGemini(Buffer.from(arrayBuf), contentType);
      if (geminiText && geminiText.trim().length > 0) {
        return { text: geminiText.trim() };
      }
    } catch (geminiErr) {
      console.error('[ocrService] Gemini multimodal OCR fallback also failed:', geminiErr);
    }

    throw new Error('All OCR extraction methods failed to process the document.');
  },

  /**
   * Sarvam AI Document Intelligence (/doc-ai/v1/job/digitise)
   */
  async extractWithSarvam(fileBlob: Blob, filename: string): Promise<string> {
    const form = new FormData();
    form.append('file', fileBlob, filename);
    form.append('output_format', 'json');

    // 1. Submit digitise job
    const submitRes = await fetch(`${config.sarvam.baseUrl}/doc-ai/v1/job/digitise`, {
      method: 'POST',
      headers: {
        'api-subscription-key': config.sarvam.apiKey,
      },
      body: form,
      signal: AbortSignal.timeout(30_000),
    });

    if (!submitRes.ok) {
      const errBody = await submitRes.text().catch(() => '');
      throw new Error(`Sarvam digitise submission failed: ${submitRes.status} ${errBody}`);
    }

    const submitData = (await submitRes.json()) as { job_id?: string };
    const jobId = submitData.job_id;
    if (!jobId) {
      throw new Error('Sarvam API did not return a job_id');
    }

    // 2. Poll job status (up to 30 seconds)
    const startTime = Date.now();
    let isCompleted = false;

    while (Date.now() - startTime < 30_000) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const statusRes = await fetch(`${config.sarvam.baseUrl}/doc-ai/v1/job/${jobId}/status`, {
        headers: { 'api-subscription-key': config.sarvam.apiKey },
        signal: AbortSignal.timeout(10_000),
      });

      if (!statusRes.ok) continue;

      const statusData = (await statusRes.json()) as { status?: string };
      if (statusData.status === 'completed') {
        isCompleted = true;
        break;
      } else if (statusData.status === 'failed' || statusData.status === 'rejected') {
        throw new Error(`Sarvam digitise job ended with status: ${statusData.status}`);
      }
    }

    if (!isCompleted) {
      throw new Error('Sarvam digitise job timed out after 30 seconds');
    }

    // 3. Fetch structured results
    const resultsRes = await fetch(`${config.sarvam.baseUrl}/doc-ai/v1/job/${jobId}/results`, {
      headers: { 'api-subscription-key': config.sarvam.apiKey },
      signal: AbortSignal.timeout(15_000),
    });

    if (!resultsRes.ok) {
      throw new Error(`Failed to fetch Sarvam job results: ${resultsRes.status}`);
    }

    interface SarvamBlock {
      text?: string;
    }
    interface SarvamPage {
      blocks?: SarvamBlock[];
    }
    interface SarvamDoc {
      pages?: SarvamPage[];
    }
    interface SarvamResult {
      documents?: SarvamDoc[];
    }

    const resultsData = (await resultsRes.json()) as SarvamResult;
    const textPieces: string[] = [];

    for (const doc of resultsData.documents ?? []) {
      for (const page of doc.pages ?? []) {
        for (const block of page.blocks ?? []) {
          if (block.text) {
            textPieces.push(block.text);
          }
        }
      }
    }

    return textPieces.join('\n\n');
  },

  /**
   * Google Gemini Multimodal OCR Fallback
   */
  async extractWithGemini(fileBuffer: Buffer, mimeType: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: config.gemini.model });
    const part = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType.startsWith('image/') || mimeType === 'application/pdf' ? mimeType : 'application/pdf',
      },
    };

    const prompt =
      'Extract all readable text verbatim from this legal court document. Maintain all case details, dates, court names, parties, and orders.';
    const result = await model.generateContent([prompt, part]);
    return result.response.text();
  },
};