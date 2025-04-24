interface PolicyMapping {
  standardTerm: string;
  plainLanguage?: string[];
  keywords?: string[];
  category: string;
  nuance?: {
    [key: string]: number | boolean;
  };
}

export const initialPolicyMappings: Record<string, PolicyMapping> = {
  environmentalProtection: {
    standardTerm: "Environmental Protection",
    plainLanguage: [
      "protect the environment",
      "fight climate change",
      "environmental conservation",
      "save the planet"
    ],
    keywords: ["environment", "climate", "pollution", "conservation"],
    category: "environmental",
    nuance: {
      environmental_impact: 1.0,
      regulation_support: 0.9
    }
  },
  fossilFuelIndustry: {
    standardTerm: "Fossil Fuel Industry Support",
    plainLanguage: [
      "support oil and gas",
      "protect energy jobs",
      "expand drilling",
      "energy independence"
    ],
    keywords: ["oil", "gas", "coal", "drilling", "fossil fuel"],
    category: "energy",
    nuance: {
      environmental_impact: -0.8,
      job_creation: 0.7
    }
  },
  universalHealthcare: {
    standardTerm: "Universal Healthcare",
    plainLanguage: [
      "medicare for all",
      "universal health coverage",
      "public healthcare"
    ],
    keywords: ["healthcare", "medical", "insurance", "medicare"],
    category: "healthcare",
    nuance: {
      government_role: 0.9,
      tax_impact: 0.7
    }
  },
  reproductiveRights: {
    standardTerm: "Reproductive Rights",
    plainLanguage: [
      "women's right to choose",
      "pro-choice",
      "abortion rights",
      "bodily autonomy",
      "women's healthcare decisions",
      "women's control over bodies"
    ],
    keywords: ["reproductive", "abortion", "choice", "women", "bodies", "control"],
    category: "social",
    nuance: {
      individual_freedom: 0.9,
      religious_opposition: -0.8
    }
  },
  lgbtqRights: {
    standardTerm: "LGBTQ+ Rights",
    plainLanguage: [
      "gay rights",
      "transgender rights",
      "LGBTQ equality",
      "marriage equality",
      "gender identity protections"
    ],
    keywords: ["lgbtq", "gay", "lesbian", "transgender", "queer", "gender identity", "sexual orientation"],
    category: "social",
    nuance: {
      individual_freedom: 0.9,
      religious_opposition: -0.7
    }
  },
  racialEquality: {
    standardTerm: "Racial Equality",
    plainLanguage: [
      "racial justice",
      "end racial discrimination",
      "fight racism",
      "racial equity",
      "equal treatment regardless of race"
    ],
    keywords: ["racial", "race", "discrimination", "racism", "equity", "equality"],
    category: "social",
    nuance: {
      social_justice: 0.9,
      historical_reparation: 0.7
    }
  },
  antiDiscrimination: {
    standardTerm: "Anti-discrimination Protections",
    plainLanguage: [
      "protect from discrimination",
      "equal rights",
      "prevent discrimination",
      "equal treatment",
      "civil rights"
    ],
    keywords: ["discrimination", "equal", "rights", "protection", "civil rights"],
    category: "social",
    nuance: {
      government_enforcement: 0.8,
      business_regulation: 0.7
    }
  },
  taxPolicyReform: {
    standardTerm: "Tax Policy Reform",
    plainLanguage: [
      "lower taxes",
      "tax cuts",
      "fair taxation",
      "tax the rich",
      "tired of high taxes"
    ],
    keywords: ["tax", "taxation", "income tax", "property tax", "tax burden"],
    category: "economic",
    nuance: {
      government_revenue: -0.6,
      individual_benefit: 0.8
    }
  },
  familyWealthPreservation: {
    standardTerm: "Family Wealth Preservation",
    plainLanguage: [
      "pass wealth to children",
      "estate planning",
      "inheritance rights",
      "family business protection"
    ],
    keywords: ["inheritance", "estate", "wealth", "children", "family business"],
    category: "economic",
    nuance: {
      wealth_inequality: 0.7,
      family_values: 0.8
    }
  },
  affirmativeAction: {
    standardTerm: "Affirmative Action",
    plainLanguage: [
      "racial preferences",
      "diversity programs",
      "racial quotas",
      "hiring based on race"
    ],
    keywords: ["affirmative action", "racial preference", "diversity hiring", "quotas"],
    category: "social",
    nuance: {
      historical_justice: 0.7,
      merit_based: -0.8
    }
  },
  equalOpportunityEmployment: {
    standardTerm: "Equal Opportunity Employment",
    plainLanguage: [
      "hiring based on merit",
      "equal chance for jobs",
      "fair hiring practices",
      "non-discriminatory employment"
    ],
    keywords: ["equal opportunity", "merit", "fair hiring", "job discrimination"],
    category: "economic",
    nuance: {
      individual_merit: 0.9,
      systemic_barriers: -0.6
    }
  },
  climateSkepticism: {
    standardTerm: "Environmental Regulation Skepticism",
    plainLanguage: [
      "climate change skepticism",
      "question climate science",
      "uncertain about climate claims",
      "climate alarmism concerns"
    ],
    keywords: ["climate skeptic", "climate alarmism", "climate uncertainty", "climate exaggeration"],
    category: "environmental",
    nuance: {
      economic_concerns: 0.7,
      scientific_debate: 0.8
    }
  },
  climatePolicyTransparency: {
    standardTerm: "Climate Policy Transparency",
    plainLanguage: [
      "open climate data",
      "transparent climate policy",
      "climate science verification",
      "honest climate discussion"
    ],
    keywords: ["climate transparency", "climate data", "climate verification", "climate debate"],
    category: "environmental",
    nuance: {
      scientific_integrity: 0.9,
      policy_scrutiny: 0.8
    }
  },
  publicTransit: {
    standardTerm: "Public Transit Investment",
    plainLanguage: [
      "better public transportation",
      "improve bus service",
      "expand train service",
      "local transportation needs"
    ],
    keywords: ["public transit", "transportation", "buses", "trains", "commuting"],
    category: "infrastructure",
    nuance: {
      urban_development: 0.8,
      environmental_benefit: 0.7
    }
  },
  urbanInfrastructure: {
    standardTerm: "Urban Infrastructure",
    plainLanguage: [
      "city improvements",
      "urban development",
      "better roads and bridges",
      "city planning"
    ],
    keywords: ["infrastructure", "urban", "city", "development", "roads"],
    category: "infrastructure",
    nuance: {
      economic_growth: 0.8,
      quality_of_life: 0.9
    }
  },
  electionSecurity: {
    standardTerm: "Election Security",
    plainLanguage: [
      "secure voting",
      "prevent election fraud",
      "election integrity",
      "voting system security"
    ],
    keywords: ["election", "voting", "ballot", "fraud", "integrity"],
    category: "governance",
    nuance: {
      democratic_process: 0.9,
      voter_confidence: 0.8
    }
  },
  domesticExtremism: {
    standardTerm: "Domestic Extremism",
    plainLanguage: [
      "political violence",
      "domestic terrorism",
      "violent extremism",
      "insurrection",
      "January 6 riots"
    ],
    keywords: ["extremism", "terrorism", "political violence", "insurrection", "jan 6"],
    category: "security",
    nuance: {
      public_safety: 0.9,
      civil_liberties: -0.6
    }
  },
  aiGovernance: {
    standardTerm: "AI Governance",
    plainLanguage: [
      "AI regulation",
      "artificial intelligence rules",
      "AI safety",
      "AI ethics"
    ],
    keywords: ["AI", "artificial intelligence", "machine learning", "algorithm regulation"],
    category: "technology",
    nuance: {
      innovation_impact: -0.5,
      safety_concerns: 0.8
    }
  },
  techLiteracy: {
    standardTerm: "Tech Literacy",
    plainLanguage: [
      "understanding technology",
      "digital education",
      "tech skills",
      "explain technology simply"
    ],
    keywords: ["tech literacy", "digital literacy", "tech education", "tech understanding"],
    category: "education",
    nuance: {
      educational_access: 0.9,
      workforce_readiness: 0.8
    }
  },
  algorithmicTransparency: {
    standardTerm: "Algorithmic Transparency",
    plainLanguage: [
      "explain AI decisions",
      "transparent algorithms",
      "AI accountability",
      "understand how AI works"
    ],
    keywords: ["algorithm", "transparency", "AI explanation", "AI decisions"],
    category: "technology",
    nuance: {
      corporate_accountability: 0.8,
      consumer_rights: 0.9
    }
  },
  womensHealthcare: {
    standardTerm: "Women's Healthcare Access",
    plainLanguage: [
      "women's health services",
      "maternal care",
      "women's medical needs",
      "female health issues"
    ],
    keywords: ["women's health", "maternal", "female", "gynecological"],
    category: "healthcare",
    nuance: {
      healthcare_access: 0.9,
      gender_equity: 0.8
    }
  },
  civilRights: {
    standardTerm: "Civil Rights Enforcement",
    plainLanguage: [
      "protect civil rights",
      "enforce equality laws",
      "civil rights protection",
      "equal protection under law"
    ],
    keywords: ["civil rights", "equal protection", "rights enforcement", "constitutional rights"],
    category: "legal",
    nuance: {
      government_role: 0.9,
      individual_protection: 0.8
    }
  },
  governmentReform: {
    standardTerm: "Government Reform",
    plainLanguage: [
      "fix the system",
      "government is broken",
      "it's rigged",
      "drain the swamp",
      "political reform",
      "clean up politics"
    ],
    keywords: ["reform", "corrupt", "rigged", "broken", "system", "swamp"],
    category: "governance",
    nuance: {
      institutional_trust: -0.8,
      accountability: 0.9
    }
  },
  antiCorruption: {
    standardTerm: "Anti-Corruption Measures",
    plainLanguage: [
      "end corruption",
      "stop the bribes",
      "politicians are bought",
      "money in politics",
      "special interests"
    ],
    keywords: ["corruption", "bribe", "bought", "money in politics", "special interest"],
    category: "governance",
    nuance: {
      transparency: 0.9,
      institutional_trust: -0.7
    }
  },
  electionReform: {
    standardTerm: "Election System Reform",
    plainLanguage: [
      "better candidates",
      "more choices",
      "didn't have anyone to choose from",
      "forced to pick",
      "lesser of two evils",
      "no good options"
    ],
    keywords: ["candidates", "choices", "options", "forced", "lesser evil"],
    category: "governance",
    nuance: {
      representation: 0.9,
      voter_satisfaction: -0.7
    }
  },
  rankedChoiceVoting: {
    standardTerm: "Ranked Choice Voting",
    plainLanguage: [
      "rank candidates",
      "alternative voting",
      "preferential voting",
      "more than two parties"
    ],
    keywords: ["ranked", "alternative voting", "preferential", "third party"],
    category: "governance",
    nuance: {
      representation: 0.9,
      voter_choice: 0.9
    }
  },
  openPrimaries: {
    standardTerm: "Open Primary Elections",
    plainLanguage: [
      "open primaries",
      "non-partisan primaries",
      "primary reform",
      "independent voters in primaries"
    ],
    keywords: ["primary", "non-partisan", "independent voters"],
    category: "governance",
    nuance: {
      party_control: -0.7,
      voter_access: 0.9
    }
  },
  politicalIndependence: {
    standardTerm: "Political Independence",
    plainLanguage: [
      "tired of parties",
      "don't like either party",
      "independent thinking",
      "beyond partisan politics"
    ],
    keywords: ["independent", "non-partisan", "bipartisan", "parties"],
    category: "governance",
    nuance: {
      party_loyalty: -0.8,
      pragmatism: 0.9
    }
  },
  genderNeutrality: {
    standardTerm: "Gender-Neutral Policies",
    plainLanguage: [
      "treat everyone the same",
      "gender shouldn't matter",
      "not about gender",
      "merit not gender"
    ],
    keywords: ["gender neutral", "gender shouldn't matter", "regardless of gender"],
    category: "social",
    nuance: {
      meritocracy: 0.9,
      identity_politics: -0.8
    }
  }
};
