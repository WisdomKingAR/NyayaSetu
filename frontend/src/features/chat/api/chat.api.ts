import { chatWithDocument } from '@/lib/apiClient';
import type { ChatResponse } from '../types';

export const chatApi = {
  sendMessage: async (documentId: string, question: string): Promise<ChatResponse> => {
    const res = await chatWithDocument(documentId, question);
    return res.data || res;
  },
};
