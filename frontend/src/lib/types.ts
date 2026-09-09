// ─── Document types ────────────────────────────────────────────────────────

export type DocumentStatus =
  | 'pending'
  | 'processing'
  | 'ocr_complete'
  | 'summarized'
  | 'complete'
  | 'error';

export type DocType =
  | 'judgment'
  | 'order'
  | 'fir'
  | 'notice'
  | 'petition'
  | 'affidavit'
  | 'other';

/** Full document entity — mirrors backend documents.types.ts */
export interface NyayaDocument {
  id: string;
  userId?: string;
  user_id?: string;
  filename: string;
  original_filename?: string;
  filePath?: string;
  storage_path?: string;
  file_type?: string;
  file_size_bytes?: number;
  fileUrl?: string;
  docType?: string;
  isHandwritten?: boolean;
  is_handwritten?: boolean;
  language_detected?: string;
  // Extracted fields (English)
  caseNumber?: string;
  case_number?: string;
  parties?: string[];
  courtName?: string;
  court_name?: string;
  judge_name?: string;
  nextHearingDate?: string;
  summaryEn?: string;
  summary?: any;
  facts?: any;
  // Translated fields (Marathi)
  caseNumberMr?: string;
  partiesMr?: string[];
  courtNameMr?: string;
  nextHearingDateMr?: string;
  summaryMr?: string;
  // Raw OCR
  ocrText?: string;
  // Processing
  status: DocumentStatus;
  errorMessage?: string;
  // Timestamps
  uploadDate?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

/** Lightweight DTO used in the dashboard list view */
export interface DocumentListItem {
  id: string;
  filename?: string;
  original_filename?: string;
  caseNumber?: string;
  case_number?: string;
  docType?: string;
  status: DocumentStatus;
  uploadDate?: string;
  created_at?: string;
  isHandwritten?: boolean;
  is_handwritten?: boolean;
}

// ─── Auth types ─────────────────────────────────────────────────────────────

export type UserRole = 'citizen' | 'advocate' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType: string;
  user: AuthUser;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

// ─── Language ─────────────────────────────────────────────────────────────

export type Language = 'en' | 'mr';

// ─── API response wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface DocumentsListResponse {
  documents: DocumentListItem[];
  total: number;
}

export interface UploadResponse {
  documentId: string;
  filename: string;
  status: DocumentStatus;
}

export interface ProcessResponse {
  documentId: string;
  status: DocumentStatus;
  caseNumber?: string;
  parties?: string[];
  courtName?: string;
  nextHearingDate?: string;
  summaryEn?: string;
  summaryMr?: string;
}

export interface ChatResponse {
  answer: string;
}
