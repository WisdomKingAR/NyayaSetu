import {
  uploadDocument,
  processDocument,
  listDocuments,
  getDocument,
} from '@/lib/apiClient';
import type { NyayaDocument, DocumentListItem, UploadResponse, ProcessResponse } from '../types';

export const documentsApi = {
  upload: async (file: File, userId?: string): Promise<UploadResponse> => {
    const res = await uploadDocument(file, userId);
    return res.data || res;
  },

  process: async (documentId: string): Promise<ProcessResponse> => {
    const res = await processDocument(documentId);
    return res.data || res;
  },

  list: async (search?: string): Promise<DocumentListItem[]> => {
    const res = await listDocuments(search);
    if (Array.isArray(res)) return res;
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.documents && Array.isArray(res.documents)) return res.documents;
    return [];
  },

  getById: async (documentId: string): Promise<NyayaDocument> => {
    const res = await getDocument(documentId);
    return res.data || res;
  },
};
