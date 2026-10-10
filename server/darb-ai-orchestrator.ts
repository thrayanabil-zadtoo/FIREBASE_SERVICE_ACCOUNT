export type OrchestrationRoute = 'knowledge_only' | 'knowledge_then_web';
export type OrchestrationStatus = 'needs_consent' | 'insufficient_evidence' | 'completed';

export interface EvidenceItem {
  id?: string;
  title?: string;
  url?: string;
  snippet?: string;
  source?: string;
  trust?: string;
  freshness?: string;
}

export function chooseRoute(knowledgeSufficient: boolean, webConsent: boolean): OrchestrationRoute {
  return knowledgeSufficient ? 'knowledge_only' : 'knowledge_then_web';
}

export function buildOrchestrationPlan(input: {
  knowledge: EvidenceItem[];
  web: EvidenceItem[];
  webConsent: boolean;
  knowledgeSufficient: boolean;
}) {
  const route = chooseRoute(input.knowledgeSufficient, input.webConsent);
  if (!input.knowledgeSufficient && !input.webConsent) {
    return {
      route,
      status: 'needs_consent' as OrchestrationStatus,
      answer: 'المعلومات المتوفرة في دَرْب غير كافية. هل تريدني أن أبحث في الإنترنت؟',
      evidence: input.knowledge,
    };
  }
  const evidence = [...input.knowledge, ...input.web];
  if (!evidence.length) {
    return {
      route,
      status: 'insufficient_evidence' as OrchestrationStatus,
      answer: 'لا توجد أدلة كافية لإعطاء إجابة موثوقة حالياً.',
      evidence: [],
    };
  }
  return {
    route,
    status: 'completed' as OrchestrationStatus,
    answer: null,
    evidence,
  };
}

export function sourceBadges(evidence: EvidenceItem[]) {
  return evidence.map((item, i) => ({
    ...item,
    badge: item.source === 'knowledge' ? '🟢' : item.trust === 'trusted' ? '🔵✓' : '🔵',
    position: i + 1,
  }));
}
