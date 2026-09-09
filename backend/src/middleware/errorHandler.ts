import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types';

/**
 * Global error handler — must be the LAST middleware registered in app.ts.
 * Catches any error thrown or passed via next(err) and formats
 * a standardized { success: false, error: { code, message } } response.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[NyayaSetu Error]', err);

  const errorObj = err instanceof Error ? err : new Error(String(err));

  // Multer file size error
  if ('code' in errorObj && (errorObj as { code: string }).code === 'LIMIT_FILE_SIZE') {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'Uploaded file exceeds the 10MB size limit.',
      },
    };
    res.status(400).json(response);
    return;
  }

  // Multer file type rejection
  if (errorObj.message.startsWith('INVALID_FILE_TYPE:')) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: errorObj.message.replace('INVALID_FILE_TYPE: ', ''),
      },
    };
    res.status(400).json(response);
    return;
  }

  // Body parser syntax error (invalid JSON payload)
  if ('status' in errorObj && (errorObj as { status: number }).status === 400 && 'body' in errorObj) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON body in request.',
      },
    };
    res.status(400).json(response);
    return;
  }

  // Default internal server error (never leak stack trace in production)
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: errorObj.message || 'An unexpected internal error occurred.',
    },
  };
  res.status(500).json(response);
}
