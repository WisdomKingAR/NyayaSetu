'use client';

import { useState, useRef, useEffect } from 'react';
import { chatWithDocument } from '@/lib/apiClient';
import { useUIStore } from '@/stores/ui.store';
import type { ChatMessage, NyayaDocument } from '@/lib/types';

interface ChatBoxProps {
  document: NyayaDocument;
}

export function ChatBox({ document: doc }: ChatBoxProps) {
  const { language } = useUIStore();
  const isMr = language === 'mr';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isReady = doc.status === 'complete';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || isLoading || !isReady) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await chatWithDocument(doc.id, question, language);
      const answer: string = res.data?.answer ?? (isMr ? 'सर्व्हरकडून उत्तर आले नाही.' : 'No response from server.');

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isMr
          ? 'क्षमस्व, तुमच्या प्रश्नावर प्रक्रिया होऊ शकली नाही. कृपया पुन्हा प्रयत्न करा.'
          : 'Sorry, I could not process your question. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const SAMPLE_QUESTIONS = isMr
    ? [
        'या खटल्यातील पक्षकार कोण आहेत?',
        'पुढील सुनावणीची तारीख काय आहे?',
        'न्यायालयाने काय निर्णय दिला?',
      ]
    : [
        'Who are the parties in this case?',
        'What is the next hearing date?',
        'What did the court decide?',
      ];

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary-container rounded-lg overflow-hidden">
      {/* ─── Header ─── */}
      <div className="px-space-lg py-space-md border-b border-outline-variant bg-surface-container-low flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-[20px] text-primary-container">chat_bubble_outline</span>
        <div>
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">
            {isMr ? 'या दस्तऐवजाबद्दल प्रश्न विचारा' : 'Ask about this document'}
          </h3>
          <p className="font-body-sm text-body-sm text-outline">
            {isMr
              ? 'उत्तरे केवळ अपलोड केलेल्या दस्तऐवजावर आधारित आहेत'
              : 'Answers are grounded strictly in the uploaded document'}
          </p>
        </div>
      </div>

      {/* ─── Messages ─── */}
      <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-md" style={{ minHeight: 300 }}>
        {!isReady ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-space-md py-space-xl">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">lock_clock</span>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              {isMr
                ? 'प्रश्नोत्तरे विचारण्यासाठी दस्तऐवज प्रक्रिया पूर्ण असणे आवश्यक आहे.'
                : 'Document processing must be complete before you can ask questions.'}
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-space-lg py-space-xl">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">forum</span>
            <div>
              <p className="font-title-md text-title-md text-on-surface font-semibold mb-space-xs">
                {isMr ? 'या दस्तऐवजाबद्दल प्रश्न विचारा' : 'Ask a question about this document'}
              </p>
              <p className="font-body-sm text-body-sm text-outline">
                {isMr
                  ? 'मूळ न्यायालयाच्या आदेशावर आधारित उत्तरे मिळवा'
                  : 'Get answers grounded in the original court text'}
              </p>
            </div>
            <div className="flex flex-col gap-space-xs w-full max-w-sm">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setInput(q);
                    inputRef.current?.focus();
                  }}
                  className="text-left px-space-md py-space-sm bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container hover:border-primary-container transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-space-md py-space-sm rounded-lg font-body-md text-body-md leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-on-primary'
                      : msg.isError
                      ? 'bg-[#FDF0F0] text-[#8B1A1A] border border-[#8B1A1A]'
                      : 'bg-surface-container-low text-on-surface border border-outline-variant'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface-container-low border border-outline-variant px-space-md py-space-sm rounded-lg flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-outline animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ─── Input bar ─── */}
      <div className="px-space-lg py-space-md border-t border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-space-sm">
          <input
            ref={inputRef}
            type="text"
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !isReady
                ? isMr
                  ? 'दस्तऐवजावर प्रक्रिया सुरू आहे…'
                  : 'Document processing…'
                : isMr
                ? 'दस्तऐवजाबद्दल प्रश्न विचारा… (मराठीत उत्तर मिळेल)'
                : 'Ask a question about this document…'
            }
            disabled={!isReady || isLoading}
            className="flex-1 h-11 px-space-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || !isReady || isLoading}
            className="w-11 h-11 bg-primary-container text-on-primary rounded-lg flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
        <p className="font-label-sm text-label-sm text-outline mt-space-xs">
          {isMr
            ? 'उत्तरे केवळ या दस्तऐवजातील कायदेशीर माहितीवर आधारित आहेत'
            : "Answers are strictly limited to this document's content"}
        </p>
      </div>
    </div>
  );
}
