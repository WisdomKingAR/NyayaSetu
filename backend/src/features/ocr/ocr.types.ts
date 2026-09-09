/** Result returned by the Sarvam Document Digitisation API after OCR */
export interface OcrResult {
  /** The extracted text content from the document */
  text: string;
  /** Optional confidence score from the OCR engine (0-1 if provided) */
  confidence?: number;
}
