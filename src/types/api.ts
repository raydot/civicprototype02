// Mode type for the application
export type Mode = "current" | "demo";

export interface PriorityMapping {
  userPriority: string;
  mappedTerms: string[];
}

export interface ConflictResult {
  priority1: string;
  priority2: string;
  reason: string;
  severity?: 'low' | 'medium' | 'high';
  categories?: string[];
}

export interface Candidate {
  name: string;
  party: string;
  office?: string;
  alignment: '✅' | '⚠️' | '❌';
  platformHighlights: string[];
  rationale: string;
  officialWebsite: string;
  positionSummary?: string;
  stances?: Array<{
    topics: string[];
  }>;
}

export interface BallotMeasure {
  title: string;
  description: string;
  supporters: string[];
  opposers: string[];
  userConcernMapping: string;
  ballotpediaLink: string;
}

export interface EmailDraft {
  recipient: {
    name: string;
    position: string;
    email: string;
  };
  subject: string;
  body: string;
  stance: 'supportive' | 'mixed' | 'opposed';
}

export interface InterestGroup {
  name: string;
  description: string;
  website: string;
  stance?: Stance;
  reason?: string;
}

export interface Petition {
  title: string;
  description: string;
  changeOrgUrl: string;
  relevance?: string;
}

export type Stance = 'strongly-support' | 'support' | 'neutral' | 'oppose' | 'strongly-oppose';

export interface CivicEducationResource {
  topic: string;
  description: string;
  source: string;
  url: string;
  type: 'article' | 'video' | 'interactive' | 'explainer';
}

export interface AnalysisResult {
  recommendations: Recommendations | null;
  analysis: {
    mappedPriorities: Array<{
      original?: string;
      priority?: string;
      category?: string;
      mappedTerms?: string[];
      policyTerms?: string[];
      sentiment?: 'positive' | 'negative' | 'neutral';
      confidence?: number;
      needsClarification?: boolean;
      clarificationReason?: string;
      possibleTopics?: string[];
    }>;
    conflicts?: ConflictResult[];
    priorities?: string[];
  } | null;
  zipCode: string;
  region: string;
  error: Error | null;
}

export interface Recommendations {
  candidates?: Candidate[];
  ballotMeasures?: BallotMeasure[];
  emailDrafts?: EmailDraft[];
  interestGroups?: InterestGroup[];
  petitions?: Petition[];
  educationResources?: CivicEducationResource[];
  policyRecommendations?: {
    topPolicies?: string[];
    explanation?: string;
  };
}

export interface RecommendationsData {
  mode: Mode;
  zipCode: string;
  city?: string;
  state?: string;
  region: string;
  analysis: {
    priorities: string[];
    conflicts: ConflictResult[];
    mappedPriorities: Array<{
      original: string;
      priority?: string;
      category?: string;
      mappedTerms?: string[];
      policyTerms?: string[];
      sentiment?: 'positive' | 'negative' | 'neutral';
      confidence?: number;
      needsClarification?: boolean;
      clarificationReason?: string;
      possibleTopics?: string[];
    }>;
  };
  recommendations: Recommendations;
  error?: Error | null;
}

export interface ApiStatus {
  googleCivic: 'loading' | 'success' | 'error';
  fec: 'loading' | 'success' | 'error';
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
