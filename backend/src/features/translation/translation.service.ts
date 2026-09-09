import { config } from '../../config';
import type { FieldsToTranslate, TranslatedFields } from './translation.types';

/**
 * Sarvam Translate (Mayura model) integration.
 *
 * Used for EN->MR translation of the 5 extracted document fields.
 * Translation is called ONCE during processing and stored in the DB.
 * It is NOT called per page view - the toggle reads stored translations.
 *
 * Graceful degradation: if translation fails for any field, the original
 */
/**
 * Splits text into chunks of at most maxChars (default 1500),
 * respecting sentence and newline boundaries so context is maintained.
 */
function chunkText(text: string, maxChars = 800): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChars) {
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      if (sentence.length > maxChars) {
        const words = sentence.split(' ');
        for (const word of words) {
          if ((currentChunk + ' ' + word).length > maxChars) {
            if (currentChunk.trim().length > 0) {
              chunks.push(currentChunk.trim());
              currentChunk = '';
            }
          }
          currentChunk = (currentChunk ? currentChunk + ' ' : '') + word;
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Translates a single raw chunk (<= 1800 chars) via Sarvam.
 */
async function translateSingleChunk(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<string> {
  try {
    const response = await fetch(`${config.sarvam.baseUrl}/translate`, {
      method: 'POST',
      headers: {
        'api-subscription-key': config.sarvam.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        source_language_code: sourceLang,
        target_language_code: targetLang,
        model: 'mayura:v1',
        enable_preprocessing: true,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(`[translationService] Translate API error: ${response.status} ${errText}. Falling back to original chunk.`);
      return text;
    }

    const data = (await response.json()) as Record<string, unknown>;
    return (data.translated_text as string) ?? (data.translation as string) ?? text;
  } catch (err) {
    console.warn(`[translationService] Chunk translation failed: ${err}. Falling back to original chunk.`);
    return text;
  }
}

/**
 * Sarvam Translate (Mayura model) integration.
 *
 * Used for EN->MR translation of the 5 extracted document fields and chat answers.
 * Translation is called ONCE during processing and stored in the DB.
 * Handles texts of any length with automatic sentence-boundary chunking.
 */
export const translationService = {
  /**
   * Translates text from one language to another.
   * Chunks large text so it never violates Sarvam's 2,000-character input ceiling.
   *
   * @param text - Text to translate
   * @param sourceLang - BCP-47 language code (default: en-IN)
   * @param targetLang - BCP-47 language code (default: mr-IN for Marathi)
   */
  async translate(
    text: string,
    sourceLang = 'en-IN',
    targetLang = 'mr-IN',
  ): Promise<string> {
    if (!text || !text.trim()) return text;

    const chunks = chunkText(text.trim(), 800);
    if (chunks.length === 1) {
      return translateSingleChunk(chunks[0], sourceLang, targetLang);
    }

    // Translate multiple chunks in order
    const translatedPieces: string[] = [];
    for (const chunk of chunks) {
      const translated = await translateSingleChunk(chunk, sourceLang, targetLang);
      translatedPieces.push(translated);
    }

    return translatedPieces.join('\n\n');
  },

  /**
   * Translates all 5 extracted document fields in parallel using Promise.all.
   * Individual field failures are handled gracefully by translate() - no
   * single field failure will abort the others.
   */
  async translateFields(fields: FieldsToTranslate): Promise<TranslatedFields> {
    const t = (text?: string) =>
      text ? this.translate(text) : Promise.resolve<string | undefined>(undefined);

    const [caseNumberMr, courtNameMr, nextHearingDateMr, summaryMr, ...partiesMrArr] =
      await Promise.all([
        t(fields.caseNumber),
        t(fields.courtName),
        t(fields.nextHearingDate),
        t(fields.summaryEn),
        ...(fields.parties ?? []).map((p) => this.translate(p)),
      ]);

    return {
      caseNumberMr,
      courtNameMr,
      nextHearingDateMr,
      summaryMr,
      partiesMr: partiesMrArr.length > 0 ? partiesMrArr : undefined,
    };
  },
};
