'use client';

import { useState } from 'react';
import { chatApi } from '../api/chat.api';
import type { ChatMessage } from '../types';

export function useChat(documentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading || !documentId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(documentId, trimmed);
      const answer = response.answer || (response as any).text || 'No response generated.';

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      return answer;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error?.message ||
        err?.message ||
        'Could not get answer. Please try again.';

      setError(errorMsg);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
