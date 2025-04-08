export interface PolicyData {
  standardTerm: string;
  plainLanguage?: string[];
  keywords?: string[];
  description?: string;
}

export type PolicyMappings = Record<string, PolicyData>;

export interface ConflictResult {
  priorities: string[];
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

export interface PriorityAnalysis {
  mappedPriorities: MappedPriority[];
  conflicts: ConflictResult[];
}

export interface MappedPriority {
  original: string;
  category: string;
  mappedTerm: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}
