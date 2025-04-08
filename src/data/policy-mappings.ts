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
      market_based: -0.8
    }
  },
  privateHealthcare: {
    standardTerm: "Private Healthcare System",
    plainLanguage: [
      "market-based healthcare",
      "private insurance",
      "healthcare choice"
    ],
    keywords: ["private", "market", "choice", "competition"],
    category: "healthcare",
    nuance: {
      government_role: -0.8,
      market_based: 0.9
    }
  },
  immigration: {
    standardTerm: "Immigration Reform",
    plainLanguage: [
      "path to citizenship",
      "immigration reform",
      "welcome immigrants"
    ],
    keywords: ["immigration", "immigrant", "citizenship", "DACA"],
    category: "immigration",
    nuance: {
      border_security: -0.2,
      humanitarian: 0.8
    }
  },
  borderSecurity: {
    standardTerm: "Border Security",
    plainLanguage: [
      "secure the border",
      "stop illegal immigration",
      "immigration enforcement"
    ],
    keywords: ["border", "security", "enforcement", "illegal"],
    category: "security",
    nuance: {
      border_security: 0.9,
      humanitarian: -0.2
    }
  },
  taxCuts: {
    standardTerm: "Tax Reduction",
    plainLanguage: [
      "lower taxes",
      "tax cuts",
      "reduce tax burden"
    ],
    keywords: ["tax", "cuts", "reduction"],
    category: "economic",
    nuance: {
      government_revenue: -0.8,
      deficit_impact: 0.7
    }
  },
  socialPrograms: {
    standardTerm: "Social Program Expansion",
    plainLanguage: [
      "expand social programs",
      "increase welfare",
      "social safety net"
    ],
    keywords: ["social", "welfare", "programs", "benefits"],
    category: "economic",
    nuance: {
      government_spending: 0.8,
      deficit_impact: -0.7
    }
  }
};
