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
  priority: string;
  policyTerms: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  needsClarification: boolean;
  clarificationReason?: string;
  
  // New fields for adding concerns
  needsAddition?: boolean;
  additionPrompt?: string;
  suggestedCategory?: string;
  
  // Legacy fields for backward compatibility
  original?: string;
  category?: string;
  mappedTerms?: string[];
  possibleTopics?: string[];
}
