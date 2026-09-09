/** Structured fields extracted from a legal document by Gemini */
export interface ExtractionResult {
  caseNumber?: string;
  parties?: string[];
  courtName?: string;
  nextHearingDate?: string;
  summaryEn?: string;
}
