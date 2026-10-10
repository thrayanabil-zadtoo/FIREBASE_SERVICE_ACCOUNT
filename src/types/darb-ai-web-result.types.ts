export type TrustLevel = "trusted" | "standard" | "unknown";

export type DarbAIWebResult = {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  trust?: TrustLevel;
  searchedAt?: string;
  cached?: boolean;
};

export type DarbAIWebSearchResponse = {
  ok: boolean;
  source: "web";
  query: string;
  searchedAt: string;
  cached?: boolean;
  resultCount: number;
  results: DarbAIWebResult[];
};
