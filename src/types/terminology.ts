export interface NuanceWeights {
  [key: string]: number;
}

export interface NuancedMapping {
  supports_middle_class_relief?: boolean;
  opposes_tax_increases?: boolean;
  supports_working_families?: boolean;
  explicitly_mentions_middle_class?: boolean;
  supports_business_tax_cuts?: boolean;
  believes_in_trickle_down?: boolean;
  mentions_job_creation?: boolean;
  explicitly_mentions_wealthy?: boolean;
  supports_taxing_wealthy?: boolean;
  supports_corporate_taxation?: boolean;
  mentions_fair_share?: boolean;
  explicitly_against_tax_cuts_for_wealthy?: boolean;
  reasoning?: string;
  [key: string]: boolean | string | undefined;
}

export interface PolicyTerm {
  plainLanguage?: string[];
  inclusionWords?: string[];
  standardTerm: string;
  plainEnglish: string;
  nuance: NuanceWeights;
  nuancedMapping?: NuancedMapping;
  contextualFactors?: string[];
  conflicts?: string[];
  contextualConflicts?: string[];
}

export interface ComplexIssueTerm {
  political_priority: string;
  plain_english: string;
  nuance: NuanceWeights;
}

export interface IssueTerminology {
  fallback: PolicyTerm;
  [key: string]: PolicyTerm | ComplexIssueTerm | ComplexIssueTerm[] | PolicyTerm[];
}
