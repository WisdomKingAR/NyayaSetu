/** Fields sent to the translation service for EN->MR translation */
export interface FieldsToTranslate {
  caseNumber?: string;
  parties?: string[];
  courtName?: string;
  nextHearingDate?: string;
  summaryEn?: string;
}

/** Marathi-translated equivalents of the extracted document fields */
export interface TranslatedFields {
  caseNumberMr?: string;
  partiesMr?: string[];
  courtNameMr?: string;
  nextHearingDateMr?: string;
  summaryMr?: string;
}
