import { supabaseAdmin } from '../../lib/supabaseAdmin';
import type { DocumentStatus } from '../../types';
import type {
  Document,
  CreateDocumentInput,
  UpdateSummaryInput,
} from './documents.types';

/**
 * Maps raw database row (snake_case) to domain Document entity (camelCase).
 */
function toDomain(row: Record<string, unknown>): Document {
  return {
    id: row.id as string,
    userId: (row.user_id as string) ?? undefined,
    filename: row.filename as string,
    filePath: row.file_path as string,
    fileUrl: row.file_url as string,
    docType: (row.doc_type as string) ?? 'unknown',
    isHandwritten: Boolean(row.is_handwritten),
    status: row.status as DocumentStatus,
    errorMessage: (row.error_message as string) ?? undefined,
    ocrText: (row.ocr_text as string) ?? undefined,
    summaryEn: (row.summary_en as string) ?? undefined,
    summaryMr: (row.summary_mr as string) ?? undefined,
    caseNumber: (row.case_number as string) ?? undefined,
    caseNumberMr: (row.case_number_mr as string) ?? undefined,
    parties: (row.parties as string[]) ?? undefined,
    partiesMr: (row.parties_mr as string[]) ?? undefined,
    courtName: (row.court_name as string) ?? undefined,
    courtNameMr: (row.court_name_mr as string) ?? undefined,
    nextHearingDate: (row.next_hearing_date as string) ?? undefined,
    nextHearingDateMr: (row.next_hearing_date_mr as string) ?? undefined,
    uploadDate: (row.upload_date as string) ?? (row.created_at as string) ?? new Date().toISOString(),
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
    updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
  };
}

export const documentsRepository = {
  /**
   * Create a new document record.
   */
  async create(input: CreateDocumentInput): Promise<Document> {
    const insertPayload: Record<string, unknown> = {
      filename: input.filename,
      file_path: input.filePath,
      file_url: input.fileUrl,
      is_handwritten: input.isHandwritten ?? false,
      status: 'pending',
    };

    if (input.userId) {
      insertPayload.user_id = input.userId;
    }

    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return toDomain(data);
  },

  /**
   * Find a single document by ID.
   */
  async findById(id: string): Promise<Document | null> {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    return data ? toDomain(data) : null;
  },

  /**
   * Update the status and optional error message of a document.
   */
  async updateStatus(
    id: string,
    status: DocumentStatus,
    errorMessage?: string,
  ): Promise<void> {
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (errorMessage !== undefined) {
      updatePayload.error_message = errorMessage;
    }

    const { error } = await supabaseAdmin
      .from('documents')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      throw new Error(`Status update failed: ${error.message}`);
    }
  },

  /**
   * Update OCR extracted text.
   */
  async updateOcrText(id: string, ocrText: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('documents')
      .update({
        ocr_text: ocrText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(`OCR update failed: ${error.message}`);
    }
  },

  /**
   * Update extracted + translated summary fields.
   */
  async updateSummary(id: string, input: UpdateSummaryInput): Promise<void> {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.caseNumber !== undefined) updatePayload.case_number = input.caseNumber;
    if (input.caseNumberMr !== undefined) updatePayload.case_number_mr = input.caseNumberMr;
    if (input.parties !== undefined) updatePayload.parties = input.parties;
    if (input.partiesMr !== undefined) updatePayload.parties_mr = input.partiesMr;
    if (input.courtName !== undefined) updatePayload.court_name = input.courtName;
    if (input.courtNameMr !== undefined) updatePayload.court_name_mr = input.courtNameMr;
    if (input.nextHearingDate !== undefined) updatePayload.next_hearing_date = input.nextHearingDate;
    if (input.nextHearingDateMr !== undefined) updatePayload.next_hearing_date_mr = input.nextHearingDateMr;
    if (input.summaryEn !== undefined) updatePayload.summary_en = input.summaryEn;
    if (input.summaryMr !== undefined) updatePayload.summary_mr = input.summaryMr;

    const { error } = await supabaseAdmin
      .from('documents')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      throw new Error(`Summary update failed: ${error.message}`);
    }
  },

  /**
   * List all documents, ordered by creation date descending.
   * Supports optional case_number or filename search.
   */
  async list(search?: string): Promise<Document[]> {
    let query = supabaseAdmin
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (search && search.trim()) {
      const sanitized = search.trim();
      query = query.or(`case_number.ilike.%${sanitized}%,filename.ilike.%${sanitized}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Document list query failed: ${error.message}`);
    }

    return (data ?? []).map(toDomain);
  },
};
