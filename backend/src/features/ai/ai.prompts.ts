/**
 * All Gemini prompt templates — single source of truth.
 *
 * Centralizing prompts here means:
 * - Easy to tune without touching service logic
 * - Visible to the whole team as a spec artifact
 *
 * DO NOT modify the CHAT_PROMPT constraint text — it is the non-negotiable
 * grounding requirement from the TRD to prevent Gemini from hallucinating
 * answers outside the document.
 */

/**
 * Structured extraction prompt.
 * Instructs Gemini to return ONLY valid JSON with 5 specific fields.
 */
export const EXTRACTION_PROMPT = (ocrText: string): string => `
You are a legal document analyst specializing in Indian court documents.
Extract key information from the document text below.

Return ONLY valid JSON — no markdown, no code blocks, no explanation.
The response must start with { and end with }

{
  "case_number": "case reference number exactly as written, or Unknown if not found",
  "parties": ["Petitioner name", "Respondent name"],
  "court_name": "full court name, or Unknown if not found",
  "next_hearing_date": "next hearing date as written, or Not found if not mentioned",
  "summary_en": "plain-language English summary max 200 words understandable by a non-lawyer. Include: what the case is about, what happened in this order/judgment, any key decisions made."
}

DOCUMENT TEXT:
${ocrText}
`;

/**
 * Chat / Q&A prompt (NON-NEGOTIABLE per TRD ADR-002).
 * Gemini must only answer from the provided document — no external knowledge.
 */
export const CHAT_PROMPT = (ocrText: string, question: string): string => `
You are a legal document assistant. Answer the user question ONLY from the
document text provided below.

If the answer is not present in the document, respond with exactly:
"This information is not mentioned in the provided document."

Rules:
- Do not infer or guess anything not stated in the document
- Do not use any external legal or general knowledge
- Quote or cite the relevant part of the document when answering
- Keep your answer concise and clear for a non-lawyer

DOCUMENT TEXT:
${ocrText}

USER QUESTION:
${question}
`;
