import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config';
import { EXTRACTION_PROMPT, CHAT_PROMPT } from './ai.prompts';
import type { ExtractionResult } from './ai.types';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * Generates content using the configured model with automatic fallback to alternate models
 * if a specific model experiences a temporary Google Cloud capacity spike (503).
 */
async function generateWithFallback(prompt: string): Promise<string> {
  const candidateModels = [config.gemini.model, 'gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
  const uniqueModels = [...new Set(candidateModels)];

  let lastError: unknown;
  for (const modelName of uniqueModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      lastError = err;
      console.warn(`[aiService] Model ${modelName} failed, trying fallback model...`);
    }
  }
  throw lastError || new Error('All Gemini models failed');
}

/**
 * Google Gemini Flash integration.
 * Used for two distinct tasks:
 * 1. Structured data extraction from OCR text (JSON output)
 * 2. Constrained single-document Q&A (context-stuffing, no RAG)
 */
export const aiService = {
  /**
   * Extracts 5 structured fields from OCR text using Gemini.
   * Forces JSON-only output via the prompt - falls back gracefully
   * if Gemini returns prose instead of valid JSON.
   */
  async extractStructuredData(ocrText: string): Promise<ExtractionResult> {
    const rawText = await generateWithFallback(EXTRACTION_PROMPT(ocrText));

    try {
      // Strip any accidental markdown code fences before parsing
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      return {
        caseNumber:
          parsed.case_number === 'Unknown' ? undefined : parsed.case_number,
        parties: Array.isArray(parsed.parties) ? parsed.parties : undefined,
        courtName:
          parsed.court_name === 'Unknown' ? undefined : parsed.court_name,
        nextHearingDate:
          parsed.next_hearing_date === 'Not found'
            ? undefined
            : parsed.next_hearing_date,
        summaryEn: parsed.summary_en,
      };
    } catch {
      // JSON parse failed - salvage what we can as a plain summary
      console.warn('[aiService] Gemini did not return valid JSON. Using raw text as summary fallback.');
      return { summaryEn: rawText.substring(0, 500) };
    }
  },

  /**
   * Answers a user question grounded strictly in the provided document text.
   * This is context-stuffing (not RAG) - full OCR text goes into the prompt.
   * No vector DB or embeddings are used (out of scope per PRD).
   */
  async chat(ocrText: string, question: string): Promise<string> {
    return generateWithFallback(CHAT_PROMPT(ocrText, question));
  },
};