/**
 * Standardized API response envelope used by all routes.
 * Every endpoint returns { success, data? } or { success, error? }
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * All possible statuses a document can be in throughout its lifecycle.
 * pending -> processing -> ocr_complete -> summarized -> complete
 *                      ? error (at any stage)
 */
export type DocumentStatus =
  | 'pending'
  | 'processing'
  | 'ocr_complete'
  | 'summarized'
  | 'complete'
  | 'error';
