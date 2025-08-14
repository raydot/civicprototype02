// PPME (Political Priorities Mapping Engine) Types

export interface PPMEMappingRequest {
  priorities: string[];
  zipCode: string;
  mode: 'current' | 'demo';
}

export interface PPMEMappedPriority {
  original: string;
  termId: string;
  standardTerm: string;
  plainEnglish: string;
  confidence: number;
  nuance: Record<string, number>;
  needsClarification: boolean;
  candidates?: PPMECandidate[];
  reasoning?: string;
}

export interface PPMECandidate {
  termId: string;
  standardTerm: string;
  plainEnglish: string;
  confidence: number;
  matchedKeywords: string[];
}

export interface PPMEMappingResponse {
  mappedPriorities: PPMEMappedPriority[];
  overallConfidence: number;
  needsClarification: string[];
  processingTime: number;
}

export interface PPMEFeedback {
  originalPriority: string;
  selectedTermId: string;
  feedbackType: 'thumbs_up' | 'thumbs_down' | 'clarification' | 'alternative_selected';
  confidence: number;
  timestamp: string;
}

// Confidence level helpers
export const getConfidenceLevel = (confidence: number): 'high' | 'medium' | 'low' => {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.4) return 'medium';
  return 'low';
};

export const getConfidenceColor = (confidence: number): string => {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'low': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getConfidenceBgColor = (confidence: number): string => {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high': return 'bg-green-100';
    case 'medium': return 'bg-yellow-100';
    case 'low': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
};
