import { config } from '../../config';
import type { OcrResult } from './ocr.types';

/**
 * Sarvam Document Digitisation API integration.
 *
 * Handles OCR for both typed and handwritten Indian legal documents.
 * High accuracy on Marathi and Indic scripts.
 */
export const ocrService = {
  /**
   * Sends a publicly accessible file URL to Sarvam's OCR API.
   *
   * @param fileUrl - Public Supabase Storage URL of the uploaded document
   * @returns OcrResult with extracted text and optional confidence score
   */
  async extractText(fileUrl: string): Promise<OcrResult> {
    const response = await fetch(
      `${config.sarvam.baseUrl}/v1/document-digitize`,
      {
        method: 'POST',
        headers: {
          'api-subscription-key': config.sarvam.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_url: fileUrl,
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Sarvam OCR failed: ${response.status} ${response.statusText}. Details: ${body}`,
      );
    }

    const data = (await response.json()) as Record<string, unknown>;

    const text =
      (data.text as string) ??
      (data.extracted_text as string) ??
      (data.content as string) ??
      (data.result as string) ??
      '';

    return {
      text,
      confidence: typeof data.confidence === 'number' ? data.confidence : undefined,
    };
  },
};
