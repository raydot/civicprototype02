import { Mode } from '@/contexts/ModeContext';
import { MappedPriority, ConflictResult } from './policy-mappings';

export type Stance = 'strongly-support' | 'support' | 'neutral' | 'oppose' | 'strongly-oppose';

export interface Organization {
  name: string;
  description: string;
  stance: Stance;
  reason: string;
}

export interface PriorityMatch {
  userPriority: string;
  mappedTerms: string[];
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
  relevance: string;
}

export interface Petition {
  title: string;
  description: string;
  changeOrgUrl: string;
  relevance: string;
}

export interface CivicEducationResource {
  topic: string;
  description: string;
  source: 'iCivics' | 'National Constitution Center' | 'Civic Genius' | 'Ballotpedia' | 'Annenberg Classroom' | 'Center for Civic Education' | 'Khan Academy Civics';
  url: string;
  type: 'article' | 'video' | 'interactive';
}

export interface RecommendationsData {
  mode: Mode;
  zipCode: string;
  region: string;
  analysis: {
    summary: string;
    priorities: string[];
    conflicts: ConflictResult[];
  };
  mappedPriorities: MappedPriority[];
  recommendations: {
    potus?: Candidate[];
    localOffices?: {
      [office: string]: Candidate[];
    };
    ballotMeasures?: BallotMeasure[];
    emailDrafts: EmailDraft[];
    interestGroups: InterestGroup[];
    petitions: Petition[];
    civicEducation: CivicEducationResource[];
  };
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
