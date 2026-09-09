import type { DocumentStatus } from '../../types';

/** Full Document entity — camelCase mirror of the Supabase 'documents' table */
export interface Document {
  id: string;
  filename: string;
  filePath: string;
  fileUrl: string;
  docType: string;
  isHandwritten: boolean;
  // Extracted fields (English)
  caseNumber?: string;
  parties?: string[];
  courtName?: string;
  nextHearingDate?: string;
  summaryEn?: string;
  // Translated fields (Marathi)
  caseNumberMr?: string;
  partiesMr?: string[];
  courtNameMr?: string;
  nextHearingDateMr?: string;
  summaryMr?: string;
  // Processing
  ocrText?: string;
  status: DocumentStatus;
  errorMessage?: string;
  // Timestamps
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
}

/** Input to create a new document record (after file upload to Supabase Storage) */
export interface CreateDocumentInput {
  filename: string;
  filePath: string;
  fileUrl: string;
  isHandwritten: boolean;
}

/** All fields that can be updated after OCR extraction + translation */
export interface UpdateSummaryInput {
  caseNumber?: string;
  parties?: string[];
  courtName?: string;
  nextHearingDate?: string;
  summaryEn?: string;
  caseNumberMr?: string;
  partiesMr?: string[];
  courtNameMr?: string;
  nextHearingDateMr?: string;
  summaryMr?: string;
}

/** Lightweight DTO used in the dashboard list view */
export interface DocumentListItem {
  id: string;
  filename: string;
  caseNumber?: string;
  docType: string;
  status: DocumentStatus;
  uploadDate: string;
  isHandwritten: boolean;
}
