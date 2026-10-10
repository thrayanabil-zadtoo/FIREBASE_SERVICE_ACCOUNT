import React, { useEffect, useState, useRef } from "react";
import { 
  Sparkles, 
  Search, 
  ExternalLink, 
  Globe, 
  Clock, 
  X, 
  Plus, 
  Trash2,
  Send,
  Loader2,
  Check,
  AlertTriangle,
  Layers,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Copy,
  ChevronDown
} from "lucide-react";
import { DarbAIWebResult } from "../types/darb-ai-web-result.types";

const PALESTINE_SOVEREIGNTY_ANSWER = `لا وجود لشيء يسمى دوله اسرائيل فهي اساسا مغتصبه لحق الفلسطينيين 
فلا نعترف بها ولا لوجودها اساس وكل شيء زائل باذن الله`;

function isQuestionAboutIsrael(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const clean = text
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .toLowerCase();

  // Arabic regex patterns
  if (/اسرائ[يى]ل|اسرا[يى]ل|اسراء[يى]ل|اسرائل/.test(clean)) return true;
  if (/صهيون|الصهيونيه|الكيان\s*الصهيوني|كيان\s*الاحتلال|جيش\s*الاحتلال/.test(clean)) return true;
  if (/تل\s*ابيب/.test(clean)) return true;

  // English regex patterns
  if (/\b(israel|israeli|israelis|tel\s*aviv|zionist\s*entity)\b/i.test(clean)) return true;
  return false;
}

export type AnswerSourceItem = {
  id?: string;
  title: string;
  url?: string;
  source: string;
  trust?: string;
  searchedAt?: string;
  cached?: boolean;
  snippet?: string;
};

export type Msg = {
  role: "user" | "assistant";
  text: string;
  source?: "darb" | "web" | "mixed" | string;
  answerSource?: "knowledge" | "web" | "mixed";
  confidenceLevel?: "supported" | "limited" | "conflicted" | "insufficient";
  sources?: AnswerSourceItem[];
  conflicts?: string[];
  time?: string;
  results?: DarbAIWebResult[];
  searchedAt?: string;
  cached?: boolean;
  needsConsent?: boolean;
  consentQuery?: string;
  answerRunId?: number | string;
  userQuestion?: string;
  feedback?: {
    rating: 'helpful' | 'not_helpful';
    comment?: string;
    submittedAt?: string;
  };
};

export type Chat = {
  id: string;
  title: string;
  messages: Msg[];
  updatedAt: string;
};

interface DarbAIWidgetProps {
  user?: any;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export default function DarbAIWidget({ user, externalPrompt, onClearExternalPrompt }: DarbAIWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    if (externalPrompt) {
      setOpen(true);
      setInput(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt, onClearExternalPrompt]);
  const [history, setHistory] = useState<Chat[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("darb_ai_history") || "[]");
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [searchingWeb, setSearchingWeb] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [commentBoxOpen, setCommentBoxOpen] = useState<Record<number, boolean>>({});
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [submittingFeedback, setSubmittingFeedback] = useState<Record<number, boolean>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  async function handleFeedback(msgIndex: number, rating: 'helpful' | 'not_helpful', optionalComment?: string) {
    const targetMsg = messages[msgIndex];
    if (!targetMsg || targetMsg.feedback) return;

    setSubmittingFeedback((prev) => ({ ...prev, [msgIndex]: true }));
    try {
      await fetch('/api/ai/answer-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answerRunId: targetMsg.answerRunId || null,
          conversationId: activeId || null,
          userId: user?.id || null,
          rating,
          comment: optionalComment?.trim() || null,
          question: targetMsg.userQuestion || messages[msgIndex - 1]?.text || '',
        }),
      });

      const updated = messages.map((m, idx) => {
        if (idx === msgIndex) {
          return {
            ...m,
            feedback: {
              rating,
              comment: optionalComment?.trim(),
              submittedAt: new Date().toISOString(),
            },
          };
        }
        return m;
      });
      setMessages(updated);
      const currentChatId = activeId || `chat_${Date.now()}`;
      updateChatRecord(currentChatId, '', updated);
      setCommentBoxOpen((prev) => ({ ...prev, [msgIndex]: false }));
    } catch (err) {
      console.warn('[DARB AI] Feedback submit error:', err);
    } finally {
      setSubmittingFeedback((prev) => ({ ...prev, [msgIndex]: false }));
    }
  }

  useEffect(() => {
    localStorage.setItem("darb_ai_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, busy, searchingWeb]);

  const newChat = () => {
    setActiveId(null);
    setMessages([]);
  };

  const loadChat = (c: Chat) => {
    setActiveId(c.id);
    setMessages(c.messages);
  };

  const deleteChat = (id: string) => {
    setHistory((h) => h.filter((c) => c.id !== id));
    if (activeId === id) newChat();
  };

  // Helper to persist updated conversation
  const updateChatRecord = (chatId: string, titleText: string, allMsgs: Msg[]) => {
    const updatedChat: Chat = {
      id: chatId,
      title: titleText.length > 40 ? `${titleText.slice(0, 40)}…` : titleText,
      messages: allMsgs,
      updatedAt: new Date().toISOString(),
    };
    setActiveId(chatId);
    setMessages(allMsgs);
    setHistory((h) => [updatedChat, ...h.filter((c) => c.id !== chatId)]);
  };

  // 1. Regular DARB AI Send (Checks Darb Knowledge first)
  async function send() {
    const q = input.trim();
    if (!q || busy || searchingWeb) return;

    // Follow-up context extraction from prior messages
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const followUpContext = (lastUserMsg && lastAssistantMsg) ? {
      lastQuestion: lastUserMsg.text,
      lastAnswer: lastAssistantMsg.text,
      lastSources: lastAssistantMsg.sources?.map((s) => s.title) || [],
    } : undefined;

    const userMsg: Msg = { role: "user", text: q, time: new Date().toISOString() };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");

    // Sovereign Palestine Mandate: Immediate firm response when asked about Israel
    if (isQuestionAboutIsrael(q)) {
      const assistantMsg: Msg = {
        role: "assistant",
        text: PALESTINE_SOVEREIGNTY_ANSWER,
        source: "darb",
        answerSource: "knowledge",
        confidenceLevel: "supported",
        time: new Date().toISOString(),
        userQuestion: q,
        sources: [
          {
            id: "palestine_sovereignty",
            title: "الموقف السيادي المعتمد لدولة فلسطين",
            source: "منصة دَرْب",
            trust: "trusted",
            searchedAt: new Date().toISOString(),
          },
        ],
      };
      const finalHistory = [...nextHistory, assistantMsg];
      setMessages(finalHistory);
      const currentChatId = activeId || `chat_${Date.now()}`;
      updateChatRecord(currentChatId, q, finalHistory);
      setBusy(false);

      // Persist in backend chat session asynchronously
      fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          conversationId: activeId,
          userId: user?.id || null,
        }),
      }).catch(() => {});
      return;
    }

    setBusy(true);

    // DARB V1.16: Asynchronously record question hit in AI Monitoring
    fetch("/api/ai/monitor/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    }).catch(() => {});

    // DARB V1.20: Generate unique correlation ID for end-to-end request tracing
    const correlationId = `corr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // DARB V1.19: Security & Usage Guard check before AI dispatch
    try {
      const secCheck = await fetch("/api/ai/security/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          userId: user?.id || null,
          conversationId: activeId,
          correlationId,
        }),
      });
      if (secCheck.ok) {
        const secData = await secCheck.json();
        if (secData.allowed === false) {
          let blockNotice = "تم تعليق هذا الطلب مؤقتاً لدواعي حماية وتوازن الخدمة.";
          if (secData.reason === "rate_limit") {
            blockNotice = "تم الوصول إلى الحد المؤقت للطلبات لتجنب الضغط الزائد. يُرجى الانتظار قليلاً ثم المحاولة مجدداً.";
          } else if (secData.reason === "duplicate_suppressed") {
            blockNotice = "تم إرسال هذا الاستفسار للتو. يُرجى الانتظار بضع ثوانٍ قبل إعادة الإرسال منعاً لتكرار العمليات.";
          } else if (secData.reason === "daily_budget_exceeded") {
            blockNotice = "تم الوصول إلى الحد الأقصى للاستخدام اليومي للمساعد الذكي. نعتذر عن ذلك ونرحب بزيارتكم غداً.";
          }

          const guardMsg: Msg = {
            role: "assistant",
            text: blockNotice,
            source: "darb",
            confidenceLevel: "limited",
            time: new Date().toISOString(),
          };
          const guardHistory = [...nextHistory, guardMsg];
          setMessages(guardHistory);
          const currentChatId = activeId || `chat_${Date.now()}`;
          updateChatRecord(currentChatId, q, guardHistory);
          setBusy(false);
          return;
        }
      }
    } catch (secErr) {
      console.warn("[DARB AI Security] Pre-flight check skipped:", secErr);
    }

    let answer = "سأبحث أولاً في معلومات دَرْب المعتمدة...";
    let source: "darb" | "web" | "mixed" = "darb";
    let answerSource: "knowledge" | "web" | "mixed" = "knowledge";
    let confidenceLevel: "supported" | "limited" | "conflicted" | "insufficient" = "supported";
    let sources: AnswerSourceItem[] = [];
    let conflicts: string[] = [];
    let isInsufficient = false;

    try {
      const r = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          history: nextHistory.slice(-12),
          conversationId: activeId,
          userId: user?.id || null,
          correlationId,
        }),
      });

      if (r.ok) {
        const d = await r.json();
        if (d.answer) {
          answer = d.answer;
          source = (d.source as any) || "darb";
          // Check if knowledge base was insufficient
          if (
            answer.includes("لم أجد إجابة كافية") ||
            answer.includes("غير كافية") ||
            answer.includes("البحث في الإنترنت") ||
            answer.includes("لا أملك معلومات كافية")
          ) {
            isInsufficient = true;
            confidenceLevel = "insufficient";
            answer = "لا أملك معلومات كافية لإعطاء إجابة موثوقة على هذا السؤال في قاعدة معرفة دَرْب.";
          } else {
            confidenceLevel = "supported";
            sources = [
              {
                id: "darb_knowledge_base",
                title: "دليل خدمات ومعلومات دَرْب المعتمدة",
                source: "قاعدة معرفة دَرْب",
                trust: "trusted",
                searchedAt: new Date().toISOString(),
              },
            ];
          }
        }
      } else if (r.status === 429 || r.status >= 500) {
        answer = "المزود الذكي يمر بضغط مؤقت، تم تشغيل حارس الموثوقية (Resilience Guard). يمكنك إعادة المحاولة خلال لحظات.";
        isInsufficient = true;
        confidenceLevel = "limited";
      }
    } catch (err) {
      console.warn("[DARB AI] chat error:", err);
      answer = "تعذر الاتصال بـ DARB AI حالياً نظراً لصعوبة مؤقتة في الشبكة. هل ترغب في محاولة البحث في الإنترنت؟";
      isInsufficient = true;
      confidenceLevel = "insufficient";
    }

    const assistantMsg: Msg = {
      role: "assistant",
      text: answer,
      source,
      answerSource,
      confidenceLevel,
      sources,
      conflicts,
      time: new Date().toISOString(),
      needsConsent: isInsufficient,
      consentQuery: isInsufficient ? q : undefined,
      answerRunId: `darb_kn_${Date.now()}`,
      userQuestion: q,
    };

    // DARB AI V1.18: Register Orchestration Run
    fetch("/api/ai/orchestrate/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: q,
        knowledge: !isInsufficient
          ? [
              {
                id: "darb_knowledge_base",
                title: "دليل خدمات ومعلومات دَرْب المعتمدة",
                source: "knowledge",
                trust: "trusted",
              },
            ]
          : [],
        web: [],
        webConsent: false,
        knowledgeSufficient: !isInsufficient,
        conversationId: activeId,
        userId: user?.id || null,
        confidenceLevel,
        finalAnswer: answer,
      }),
    }).catch(() => {});

    const all = [...nextHistory, assistantMsg];
    const currentChatId = activeId || `chat_${Date.now()}`;
    updateChatRecord(currentChatId, q, all);
    setBusy(false);
  }

  // 2. Perform Web Search with user consent (Internal to Chat)
  async function performWebSearchInternal(queryToSearch: string) {
    const q = queryToSearch.trim();
    if (!q || searchingWeb) return;

    // Sovereign Palestine Mandate: Never search web for Israel, return mandated sovereign stance
    if (isQuestionAboutIsrael(q)) {
      const chatId = activeId || `chat_${Date.now()}`;
      const sovereignMsg: Msg = {
        role: "assistant",
        text: PALESTINE_SOVEREIGNTY_ANSWER,
        source: "darb",
        answerSource: "knowledge",
        confidenceLevel: "supported",
        time: new Date().toISOString(),
        userQuestion: q,
        sources: [
          {
            id: "palestine_sovereignty",
            title: "الموقف السيادي المعتمد لدولة فلسطين",
            source: "منصة دَرْب",
            trust: "trusted",
            searchedAt: new Date().toISOString(),
          },
        ],
      };
      const updated = [...messages.map(m => m.needsConsent ? { ...m, needsConsent: false } : m), sovereignMsg];
      setMessages(updated);
      updateChatRecord(chatId, q, updated);
      setSearchingWeb(false);
      return;
    }

    setSearchingWeb(true);
    const chatId = activeId || `chat_${Date.now()}`;

    // Follow-up context extraction
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    const followUpContext = (lastUserMsg && lastAssistantMsg) ? {
      lastQuestion: lastUserMsg.text,
      lastAnswer: lastAssistantMsg.text,
      lastSources: lastAssistantMsg.sources?.map((s) => s.title) || [],
    } : undefined;

    // Dismiss pending consent flag on existing messages
    const sanitizedHistory = messages.map((m) =>
      m.needsConsent ? { ...m, needsConsent: false } : m
    );

    // If query is coming from composer directly, append user message
    let baseHistory = sanitizedHistory;
    if (input.trim() === q) {
      const userMsg: Msg = { role: "user", text: q, time: new Date().toISOString() };
      baseHistory = [...sanitizedHistory, userMsg];
      setInput("");
    }
    setMessages(baseHistory);

    const webCorrelationId = `corr_web_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      const r = await fetch("/api/ai/web-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          consent: true,
          conversationId: chatId,
          userId: user?.id || null,
          correlationId: webCorrelationId,
        }),
      });

      if (r.ok) {
        const d = await r.json();
        const rawResults: DarbAIWebResult[] = d.results || [];
        const searchedAt: string = d.searchedAt || new Date().toISOString();
        const isCached: boolean = d.cached === true;

        // DARB V1.19: Sanitize external evidence - treat strictly as passive data
        const results: DarbAIWebResult[] = rawResults.map((item) => {
          let snip = String(item.snippet || "").slice(0, 4000);
          const hadInjection = /ignore\s+(all|previous|earlier)\s+instructions|system\s+prompt|تجاهل\s+(التعليمات|القواعد)/i.test(snip);
          if (hadInjection) {
            snip = snip
              .replace(/ignore\s+(all|previous|earlier)\s+instructions/gi, "[تم تحييد النص التوجيهي]")
              .replace(/system\s+prompt/gi, "[بيانات خارجية]")
              .replace(/تجاهل\s+(التعليمات|القواعد)/gi, "[تم تحييد النص التوجيهي]");
            
            // Asynchronously log the security event
            fetch("/api/ai/security/sanitize-evidence", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: item.snippet,
                title: item.title,
                conversationId: chatId,
              }),
            }).catch(() => {});
          }
          return { ...item, snippet: snip };
        });

        // V1.14 Answer Engine Synthesis
        let directAnswer = "";
        let answerConfidence: "supported" | "limited" | "conflicted" | "insufficient" = "supported";
        let answerSrcType: "knowledge" | "web" | "mixed" = "web";
        let groundedSources: AnswerSourceItem[] = [];
        let detectedConflicts: string[] = [];
        let answerRunId: number | string | undefined;

        try {
          const ansRun = await fetch("/api/ai/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: q,
              webResults: results,
              conversationId: chatId,
              userId: user?.id || null,
              followUpContext,
            }),
          });
          if (ansRun.ok) {
            const aData = await ansRun.json();
            if (aData?.data) {
              answerRunId = aData.data.id;
              directAnswer = aData.data.answer;
              answerConfidence = aData.data.confidenceLevel;
              answerSrcType = aData.data.answerSource;
              groundedSources = aData.data.sources || [];
              detectedConflicts = aData.data.conflicts || [];
            }
          }
        } catch (ansErr) {
          console.warn("[DARB AI] Answer synthesis error:", ansErr);
        }

        const fallbackSources: AnswerSourceItem[] = results.slice(0, 5).map((res, idx) => ({
          id: `web_${idx}`,
          title: res.title,
          url: res.url,
          source: res.source,
          trust: res.trust,
          snippet: res.snippet,
          searchedAt,
          cached: isCached,
        }));

        const finalSources = groundedSources.length > 0 ? groundedSources : fallbackSources;

        const webAssistantMsg: Msg = {
          role: "assistant",
          text: directAnswer || (
            results.length > 0
              ? (isCached
                  ? `نتائج البحث من الأرشيف المحفوظ حديثاً (${results.length} نتائج):`
                  : `تم العثور على ${results.length} نتائج موثوقة من الإنترنت:`)
              : "لا أملك معلومات كافية لإعطاء إجابة موثوقة على هذا السؤال."
          ),
          source: answerSrcType === "knowledge" ? "darb" : answerSrcType === "mixed" ? "mixed" : "web",
          answerSource: answerSrcType,
          confidenceLevel: answerConfidence,
          sources: finalSources,
          conflicts: detectedConflicts,
          time: searchedAt,
          searchedAt,
          cached: isCached,
          results,
          answerRunId: answerRunId || `web_run_${Date.now()}`,
          userQuestion: q,
        };

        const all = [...baseHistory, webAssistantMsg];
        updateChatRecord(chatId, q, all);

        // DARB AI V1.18: Register Orchestration Run after Web Search & Answer Engine
        fetch("/api/ai/orchestrate/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            knowledge:
              answerSrcType === "mixed"
                ? [
                    {
                      id: "darb_knowledge_base",
                      title: "دليل خدمات ومعلومات دَرْب المعتمدة",
                      source: "knowledge",
                      trust: "trusted",
                    },
                  ]
                : [],
            web: results.map((r) => ({
              title: r.title,
              url: r.url,
              source: "web",
              trust: r.trust,
              snippet: r.snippet,
            })),
            webConsent: true,
            knowledgeSufficient: false,
            conversationId: chatId,
            userId: user?.id || null,
            confidenceLevel: answerConfidence,
            finalAnswer: directAnswer,
          }),
        }).catch(() => {});
      } else {
        const errData = await r.json().catch(() => ({}));
        let failText = errData.message;
        if (!failText) {
          if (r.status === 429) {
            failText = "مزود البحث الخارجي يمر بحد الاستهلاك المؤقت. يرجى المحاولة بعد لحظات.";
          } else if (r.status >= 500) {
            failText = "تعذر الاتصال بمزود البحث حالياً نظراً لصعوبة مؤقتة في الخدمة الخارجية. يرجى المحاولة لاحقاً.";
          } else {
            failText = "تعذر إجراء البحث الخارجي حالياً. يرجى المحاولة لاحقاً.";
          }
        }
        const failMsg: Msg = {
          role: "assistant",
          text: failText,
          source: "web",
          confidenceLevel: "insufficient",
          time: new Date().toISOString(),
        };
        const all = [...baseHistory, failMsg];
        updateChatRecord(chatId, q, all);
      }
    } catch {
      const failMsg: Msg = {
        role: "assistant",
        text: "تعذر الاتصال بمزود البحث في الوقت الحالي. تم تسجيل الحدث في حارس الموثوقية (Resilience Guard).",
        source: "web",
        confidenceLevel: "insufficient",
        time: new Date().toISOString(),
      };
      const all = [...baseHistory, failMsg];
      updateChatRecord(chatId, q, all);
    } finally {
      setSearchingWeb(false);
    }
  }

  // Composer "🔎 ابحث في الإنترنت" button handler
  const handleComposerWebSearch = () => {
    const q = input.trim();
    if (!q) {
      // If composer is empty, search for previous question if available
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
      if (lastUserMsg) {
        performWebSearchInternal(lastUserMsg.text);
      }
      return;
    }
    performWebSearchInternal(q);
  };

  return (
    <div className="darb-ai-widget">
      {open && (
        <div className="darb-ai-panel" dir="rtl">
          {/* Header */}
          <header className="darb-ai-header">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1bb49e]/20 border border-[#1bb49e]/40 flex items-center justify-center text-[#8be4d4]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <b className="text-sm font-bold text-white flex items-center gap-1.5">
                  DARB AI
                  <span className="text-[9px] font-mono bg-[#1bb49e]/20 text-[#8be4d4] px-1.5 py-0.2 rounded font-normal">
                    V1.16 AI Monitoring & Answers
                  </span>
                </b>
                <small className="text-[10px] text-stone-300">مساعد دَرْب الذكي للمغتربين والمسافرين</small>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              aria-label="إغلاق"
              className="text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className="darb-ai-layout">
            {/* Conversation History Sidebar */}
            <aside className="darb-ai-history">
              <button 
                onClick={newChat}
                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-[#0d9d91] hover:bg-[#0b857b] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>محادثة جديدة</span>
              </button>

              <small className="block mt-4 mb-2 text-[11px] font-bold text-stone-500">
                سجل المحادثات
              </small>

              <div className="space-y-1 overflow-y-auto max-h-[calc(100%-70px)]">
                {history.length === 0 ? (
                  <p className="text-[11px] text-stone-400 p-2">لا توجد محادثات سابقة</p>
                ) : (
                  history.map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between gap-1 p-2 rounded-xl text-xs transition-colors ${
                        activeId === c.id
                          ? "bg-white font-bold text-stone-900 shadow-xs border border-stone-200"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      <button
                        onClick={() => loadChat(c)}
                        className="flex-1 text-right truncate cursor-pointer"
                        title={c.title}
                      >
                        {c.title}
                      </button>
                      <button
                        onClick={() => deleteChat(c.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                        title="حذف"
                        aria-label="حذف المحادثة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </aside>

            {/* Main Chat Area */}
            <section className="darb-ai-chat">
              <div className="darb-ai-messages">
                {!messages.length && (
                  <div className="darb-ai-welcome">
                    <div className="w-12 h-12 rounded-2xl bg-[#0d9d91]/10 text-[#0d9d91] flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <b className="text-base text-stone-800">مرحباً بك في DARB AI</b>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
                      اسأل عن شروط السفر، العواصم، العملات، الإقامات، الوظائف، والربط الاقتصادي السيادي العربي والعالمي.
                    </p>

                    {/* Interactive Quick Prompts */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                      {[
                        { label: "🇵🇸 ما هي عاصمة فلسطين؟", query: "ما هي عاصمة فلسطين" },
                        { label: "🇪🇬 ما هي عملة مصر الرسمية؟", query: "ما هي عملة مصر الرسمية" },
                        { label: "🇸🇦 كم يبلغ عدد سكان السعودية؟", query: "كم يبلغ عدد سكان السعودية" },
                        { label: "⚡ ما هو مشروع الربط الكهربائي؟", query: "ما هو مشروع الربط الكهربائي العربي" },
                        { label: "💼 فرص العمل للمغتربين", query: "ما هي فرص العمل للمغتربين في دَرْب" },
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setInput(chip.query);
                          }}
                          className="text-xs bg-[#f0f7f7] hover:bg-[#e2f3f1] text-[#0d776e] border border-[#cbe6e3] rounded-full px-3 py-1.5 transition-all hover:scale-105 cursor-pointer font-medium shadow-xs"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => {
                  const displaySources: AnswerSourceItem[] = (m.sources && m.sources.length > 0)
                    ? m.sources.slice(0, 5)
                    : (m.results && m.results.length > 0)
                    ? m.results.slice(0, 5).map((r, rIdx) => ({
                        id: `res_${rIdx}`,
                        title: r.title,
                        url: r.url,
                        source: r.source,
                        trust: r.trust,
                        snippet: r.snippet,
                        searchedAt: m.searchedAt,
                        cached: m.cached,
                      }))
                    : [];

                  return (
                    <div key={i} className={`darb-ai-msg ${m.role}`}>
                      <div>
                        {/* V1.14 Header Badges for Assistant */}
                        {m.role === "assistant" && (
                          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-white/10 text-[11px]">
                            {/* Source Badge */}
                            <div className="flex items-center gap-1.5">
                              {m.answerSource === "mixed" || m.source === "mixed" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-purple-300 bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 rounded-md">
                                  <Layers className="w-3 h-3" />
                                  <span>🟣 من المصدرين (دَرْب + الإنترنت)</span>
                                </span>
                              ) : m.answerSource === "web" || m.source === "web" ? (
                                <span className="inline-flex items-center gap-1 font-bold text-sky-300 bg-sky-500/20 border border-sky-400/30 px-2 py-0.5 rounded-md">
                                  <Globe className="w-3 h-3" />
                                  <span>🔵 من الإنترنت</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                                  <Sparkles className="w-3 h-3" />
                                  <span>🟢 من قاعدة معرفة دَرْب</span>
                                </span>
                              )}

                              {/* Copy response button */}
                              <button
                                type="button"
                                onClick={() => handleCopyText(m.text, i)}
                                className="inline-flex items-center gap-1 text-[10px] text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                title="نسخ الإجابة"
                              >
                                {copiedIdx === i ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-300" />
                                    <span className="text-emerald-300">تم النسخ</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>نسخ</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Confidence Level Badge */}
                            {m.confidenceLevel && (
                              <div>
                                {m.confidenceLevel === "supported" && (
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5" />
                                    <span>مدعوم بالأدلة</span>
                                  </span>
                                )}
                                {m.confidenceLevel === "limited" && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-md font-bold">
                                    معلومات محدودة
                                  </span>
                                )}
                                {m.confidenceLevel === "conflicted" && (
                                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-400/30 px-1.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                                    <AlertTriangle className="w-2.5 h-2.5" />
                                    <span>يوجد تعارض بين المصادر</span>
                                  </span>
                                )}
                                {m.confidenceLevel === "insufficient" && (
                                  <span className="text-[10px] bg-stone-500/20 text-stone-300 border border-stone-400/30 px-1.5 py-0.5 rounded-md font-medium">
                                    نقص في الأدلة
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Direct Grounded Answer */}
                        <p className="whitespace-pre-line leading-relaxed text-[13px]">{m.text}</p>

                        {/* V1.14 Conflict Alert Banner */}
                        {m.conflicts && m.conflicts.length > 0 && (
                          <div className="mt-3 p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-right text-xs text-amber-100 space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                              <span>تنبيه: توجد معلومات مختلفة بين بعض المصادر. لم يتم ترجيح مصدر تلقائياً.</span>
                            </div>
                            <ul className="list-disc list-inside text-[11px] text-amber-200/90 space-y-0.5 pr-1">
                              {m.conflicts.map((c, ci) => (
                                <li key={ci} className="leading-relaxed">{c}</li>
                              ))}
                            </ul>
                            <p className="text-[10px] text-amber-300/80 pt-1 border-t border-amber-400/20">
                              يُرجى مراجعة الروابط الرسمية أدناه للتأكد من الشروط أو الرسوم بدقة.
                            </p>
                          </div>
                        )}

                        {/* V1.14 Grounded Sources Section (Collapsible) */}
                        {displaySources.length > 0 && (
                          <div className="mt-3 border-t border-white/20 pt-2">
                            <div className="flex items-center justify-between text-[11px] pb-1 text-stone-200">
                              <button
                                type="button"
                                onClick={() => setExpandedSources(prev => ({ ...prev, [i]: !prev[i] }))}
                                className="font-bold inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/10"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>المصادر المستخدمة ({displaySources.length})</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedSources[i] ? 'rotate-180' : ''}`} />
                              </button>
                              <div className="flex items-center gap-2">
                                {m.cached ? (
                                  <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-1.5 py-0.5 rounded-md font-medium inline-flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>محفوظ حديثاً</span>
                                  </span>
                                ) : (
                                  m.searchedAt && (
                                    <span className="text-[10px] opacity-75 inline-flex items-center gap-1 font-mono">
                                      <Clock className="w-2.5 h-2.5" />
                                      <span>{new Date(m.searchedAt).toLocaleTimeString("ar-EG", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}</span>
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            {expandedSources[i] && (
                              <div className="space-y-2 pt-2 border-t border-white/10">
                                {displaySources.map((res, rIdx) => {
                                  const isKnowledge =
                                    res.id === "darb_knowledge_base" ||
                                    (res.source && res.source.includes("دَرْب")) ||
                                    res.source === "knowledge";
                                  const isTrustedWeb = !isKnowledge && res.trust === "trusted";

                                  return (
                                    <article
                                      key={rIdx}
                                      className="bg-white/10 hover:bg-white/15 p-2.5 rounded-xl border border-white/10 transition-colors text-right space-y-1.5"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <h5 className="font-bold text-xs text-emerald-300 leading-snug flex-1">
                                          {res.title}
                                        </h5>
                                        {isKnowledge ? (
                                          <span className="shrink-0 text-[10px] bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                                            <span className="text-[11px]">🟢</span>
                                            <span>قاعدة معرفة دَرْب</span>
                                          </span>
                                        ) : isTrustedWeb ? (
                                          <span className="shrink-0 text-[10px] bg-sky-500/25 text-sky-200 border border-sky-400/40 px-1.5 py-0.5 rounded-md font-bold inline-flex items-center gap-1">
                                            <span className="text-[11px]">🔵✓</span>
                                            <span>ويب حكومي/موثوق</span>
                                          </span>
                                        ) : (
                                          <span className="shrink-0 text-[10px] bg-white/10 text-stone-300 border border-white/15 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1">
                                            <span className="text-[11px]">🔵</span>
                                            <span>مصدر خارجي</span>
                                          </span>
                                        )}
                                      </div>

                                      {res.snippet && (
                                        <p className="text-[11px] text-stone-200 leading-relaxed opacity-95">
                                          {res.snippet}
                                        </p>
                                      )}

                                      <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px]">
                                        <span className="text-stone-300 font-mono truncate max-w-[200px]">
                                          المصدر: {res.source || "موقع معتمد"}
                                        </span>

                                        {/* Open source button — strictly on user click */}
                                        {res.url ? (
                                          <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 hover:bg-white/25 text-sky-200 font-bold transition-colors cursor-pointer shrink-0"
                                          >
                                            <span>فتح المصدر</span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                          </a>
                                        ) : (
                                          <span className="text-stone-400 text-[10px]">
                                            قاعدة بيانات دَرْب
                                          </span>
                                        )}
                                      </div>
                                    </article>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* V1.12 & V1.14 Consent Prompt if knowledge was insufficient */}
                        {m.needsConsent && m.consentQuery && (
                          <div className="mt-3 p-3 bg-amber-500/15 border border-amber-400/40 rounded-xl text-center space-y-2">
                            <p className="text-xs text-amber-100 font-semibold leading-relaxed">
                              المعلومات المتوفرة في دَرْب غير كافية. هل تريدني أن أبحث في الإنترنت؟
                            </p>
                            <button
                              onClick={() => performWebSearchInternal(m.consentQuery!)}
                              disabled={searchingWeb}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0d9d91] hover:bg-[#0b857b] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>نعم، ابحث في الإنترنت</span>
                            </button>
                          </div>
                        )}

                        {/* V1.15 AI Quality Feedback (👍/👎 and Notes) */}
                        <div className="mt-3 pt-2.5 border-t border-white/15 text-xs text-right">
                          {m.feedback ? (
                            <div className="flex items-center justify-between gap-2 text-[11px] bg-white/10 px-3 py-1.5 rounded-lg text-emerald-200">
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>
                                  تم تسجيل تقييمك: {m.feedback.rating === 'helpful' ? 'مفيدة 👍' : 'غير مفيدة 👎'}
                                </span>
                              </span>
                              {m.feedback.comment && (
                                <span className="text-[10px] text-stone-300 italic truncate max-w-[140px]" title={m.feedback.comment}>
                                  "{m.feedback.comment}"
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2 text-[11px] text-stone-200">
                                <span className="text-stone-300 text-[11px]">هل كانت هذه الإجابة مفيدة؟</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleFeedback(i, 'helpful')}
                                    disabled={submittingFeedback[i]}
                                    title="إجابة مفيدة"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-stone-200 hover:text-emerald-300 border border-white/10 transition-colors cursor-pointer text-[11px] disabled:opacity-50"
                                  >
                                    <ThumbsUp className="w-3 h-3 text-emerald-400" />
                                    <span>مفيدة</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCommentBoxOpen((prev) => ({ ...prev, [i]: true }));
                                    }}
                                    disabled={submittingFeedback[i]}
                                    title="غير مفيدة أو تحتاج تعديل"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-rose-500/20 text-stone-200 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer text-[11px] disabled:opacity-50"
                                  >
                                    <ThumbsDown className="w-3 h-3 text-rose-400" />
                                    <span>غير مفيدة</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCommentBoxOpen((prev) => ({ ...prev, [i]: !prev[i] }));
                                    }}
                                    title="إضافة ملاحظة على الإجابة"
                                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 transition-colors cursor-pointer"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {commentBoxOpen[i] && (
                                <div className="p-2.5 bg-black/30 rounded-xl border border-white/15 space-y-2 mt-1.5">
                                  <label className="block text-[11px] text-stone-300 font-medium">
                                    ما الذي كان ناقصاً أو يحتاج تصحيح في هذه الإجابة؟
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="مثال: الشروط غير محدثة لعام 2026 أو الرسوم ناقصة..."
                                    value={commentText[i] || ''}
                                    onChange={(e) => setCommentText((prev) => ({ ...prev, [i]: e.target.value }))}
                                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-stone-400 focus:outline-none focus:border-[#8be4d4]"
                                  />
                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setCommentBoxOpen((prev) => ({ ...prev, [i]: false }))}
                                      className="px-2 py-1 text-[10px] text-stone-400 hover:text-white cursor-pointer"
                                    >
                                      إلغاء
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFeedback(i, 'not_helpful', commentText[i])}
                                      disabled={submittingFeedback[i]}
                                      className="px-2.5 py-1 text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer transition-colors"
                                    >
                                      إرسال (غير مفيدة)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleFeedback(i, 'helpful', commentText[i])}
                                      disabled={submittingFeedback[i]}
                                      className="px-2.5 py-1 text-[11px] font-bold bg-[#1bb49e] hover:bg-[#159a86] text-white rounded-lg cursor-pointer transition-colors"
                                    >
                                      إرسال (مفيدة)
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicators */}
                {busy && (
                  <div className="darb-ai-msg assistant">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8be4d4]" />
                      <span>جارٍ البحث في قاعدة معرفة دَرْب...</span>
                    </div>
                  </div>
                )}

                {searchingWeb && (
                  <div className="darb-ai-msg assistant">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-300" />
                      <span>جارٍ البحث في الإنترنت واستخراج المصادر الموثوقة...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="darb-ai-composer">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="اكتب سؤالك هنا عن السفر، الإقامات، العمل، أو الخدمات..."
                  disabled={busy || searchingWeb}
                />
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={handleComposerWebSearch}
                    disabled={busy || searchingWeb}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer rounded-lg px-3 py-2 disabled:opacity-50"
                    title="البحث الخارجي في الإنترنت مع طلب الموافقة"
                  >
                    <Search className="w-3.5 h-3.5 text-stone-500" />
                    <span>🔎 ابحث في الإنترنت</span>
                  </button>

                  <button
                    onClick={send}
                    disabled={!input.trim() || busy || searchingWeb}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#0d9d91] hover:bg-[#0b857b] transition-colors cursor-pointer rounded-lg px-4 py-2 disabled:opacity-50 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Floating Action Button (Hidden completely when chat is open) */}
      {!open && (
        <button
          className="darb-ai-fab cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setOpen(true)}
          aria-label="فتح DARB AI"
        >
          <b>AI</b>
          <span>✦</span>
        </button>
      )}
    </div>
  );
}
