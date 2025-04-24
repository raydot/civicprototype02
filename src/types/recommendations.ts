import { Mode } from '@/types/mode';

export type AlignmentLevel = '✅' | '⚠️' | '❌';

export interface CandidateRecommendation {
  name: string;
  office: string;
  summary: string;
  match: 'full' | 'partial' | 'conflict';
  platformHighlights: string[];
  rationale: string;
  officialWebsite: string;
  party?: string;
}

export interface BallotMeasure {
  id: string;
  title: string;
  summary: string;
  link?: string;
  supporters: string[];
  opposers: string[];
  userConcernMapping: string;
  ballotpediaLink: string;
}

export interface EmailDraft {
  recipient: {
    name: string;
    title: string;
    email: string;
  };
  subject: string;
  content: string;
  category: 'aligned' | 'opposing' | 'key_decision_maker';
  stance: 'supportive' | 'mixed' | 'opposed';
}

export interface InterestGroup {
  name: string;
  description: string;
  website: string;
  priorities: string[];
  relevance: string;
}

export interface Petition {
  title: string;
  description: string;
  link: string;
  relevantPriorities: string[];
  changeOrgUrl: string;
  relevance: string;
}

export interface CivicEducationResource {
  title: string;
  description: string;
  source: 'iCivics' | 'National Constitution Center' | 'Civic Genius' | 'Ballotpedia' | 'Annenberg Classroom' | 'Center for Civic Education' | 'Khan Academy Civics';
  link: string;
  url: string;
  topics: string[];
  type: 'article' | 'video' | 'interactive';
}

export interface DashboardData {
  mode: Mode;
  zipCode: string;
  region: string;
  priorities: {
    original: string;
    mapped: string[];
    weight: number;
    ambiguities?: string[];
    conflicts?: string[];
  }[];
  recommendations: {
    candidates?: {
      [office: string]: CandidateRecommendation[];
    };
    ballotMeasures?: BallotMeasure[];
    emailDrafts: EmailDraft[];
    interestGroups: InterestGroup[];
    petitions: Petition[];
    civicEducation: CivicEducationResource[];
  };
}
