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
 * English text is returned as a fallback. We never throw from this service.
 */
export const translationService = {
  /**
   * Translates a single text string from one language to another.
   * Returns the original text as a fallback if the API call fails.
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
    try {
      const response = await fetch(
        `${config.sarvam.baseUrl}/v1/translate`,
        {
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
        },
      );

      if (!response.ok) {
        console.warn(`[translationService] Translate API error: ${response.status}. Falling back to English.`);
        return text;
      }

      const data = (await response.json()) as Record<string, unknown>;
      const translated = (data.translated_text as string) ?? (data.translation as string) ?? text;
      return translated;
    } catch (err) {
      // Never throw - return English as fallback
      console.warn(`[translationService] Translation failed: ${err}. Falling back to English.`);
      return text;
    }
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
