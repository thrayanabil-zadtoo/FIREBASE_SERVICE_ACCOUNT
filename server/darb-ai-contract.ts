// DARB AI integration contract.
// Keep provider/API keys on the server only.
// POST /api/ai/chat -> { message, history[] } -> { answer, source }
// The frontend must never contain provider secrets.
// Implement retrieval from data/darb_knowledge.json or ai_knowledge table first.
// Optional external search is only performed after explicit user request.
export const DARB_AI_ENDPOINT = "/api/ai/chat";
