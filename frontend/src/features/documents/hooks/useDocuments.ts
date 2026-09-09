'use client';

import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '../api/documents.api';
import type { DocumentListItem } from '../types';

export function useDocuments(search?: string) {
  const query = useQuery<DocumentListItem[]>({
    queryKey: ['documents', search],
    queryFn: async () => {
      return await documentsApi.list(search);
    },
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
