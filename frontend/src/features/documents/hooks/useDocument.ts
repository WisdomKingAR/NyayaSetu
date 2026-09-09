'use client';

import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '../api/documents.api';
import type { NyayaDocument } from '../types';

export function useDocument(documentId: string) {
  const query = useQuery<NyayaDocument>({
    queryKey: ['document', documentId],
    queryFn: async () => {
      return await documentsApi.getById(documentId);
    },
    enabled: !!documentId,
  });

  return {
    document: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
