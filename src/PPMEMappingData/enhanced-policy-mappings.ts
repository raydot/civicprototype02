import { currentIssues } from './current-issues-loader';

interface PolicyMapping {
  standardTerm: string;
  plainLanguage?: string[];
  keywords?: string[];
  category: string;
  publicConcern?: 'High' | 'Moderate' | 'Low';
  nuance?: {
    [key: string]: number | boolean;
  };
}

// This function dynamically generates policy mappings from the current issues JSON
// This allows policy experts to update the current-issues.json file without touching code
function generateMappingsFromCurrentIssues(): Record<string, PolicyMapping> {
  const mappings: Record<string, PolicyMapping> = {};
  
  if (!currentIssues || !currentIssues.issues) {
    console.warn('Current issues data not loaded properly');
    return mappings;
  }
  
  // Process each category and topic from the current issues
  currentIssues.issues.forEach(category => {
    category.topics.forEach(topic => {
      // Create a key based on the topic name
      const key = topic.name.toLowerCase().replace(/\s+/g, '');
      
      // Generate keywords from the description
      const descriptionWords = topic.description
        .toLowerCase()
        .replace(/[.,;:!?()]/g, '')
        .split(' ')
        .filter(word => word.length > 3 && !['like', 'over', 'with', 'that', 'this', 'have', 'from', 'about', 'been', 'were', 'they', 'their', 'there'].includes(word));
      
      // Create the mapping
      mappings[key] = {
        standardTerm: topic.name,
        plainLanguage: generatePlainLanguage(topic.name, topic.description),
        keywords: generateKeywords(topic.name, descriptionWords),
        category: category.category.toLowerCase(),
        publicConcern: topic.public_concern as 'High' | 'Moderate' | 'Low',
        nuance: generateNuance(topic.name, category.category)
      };
    });
  });
  
  return mappings;
}

// Helper function to generate plain language variations
function generatePlainLanguage(topicName: string, description: string): string[] {
  const plainLanguage: string[] = [];
  
  // Add variations based on the topic name
  switch (topicName) {
    case "Inflation and Cost of Living":
      plainLanguage.push(
        "prices are too high",
        "everything costs too much",
        "can't afford groceries",
        "housing is unaffordable",
        "gas prices are too high"
      );
      break;
    case "Job Market and Wages":
      plainLanguage.push(
        "wages are too low",
        "not enough good jobs",
        "worried about losing my job",
        "jobs being replaced by automation",
        "need better paying jobs"
      );
      break;
    case "Taxation and Government Spending":
      plainLanguage.push(
        "taxes are too high",
        "government wastes money",
        "worried about national debt",
        "tax the rich",
        "government spends too much"
      );
      break;
    case "Affordable Healthcare Access":
      plainLanguage.push(
        "healthcare is too expensive",
        "can't afford insurance",
        "medical bills are too high",
        "need affordable healthcare",
        "prescription costs are too high"
      );
      break;
    case "Reproductive Rights":
      plainLanguage.push(
        "women's right to choose",
        "pro-choice",
        "abortion rights",
        "women's healthcare decisions",
        "bodily autonomy"
      );
      break;
    case "Curriculum Content":
      plainLanguage.push(
        "what's being taught in schools",
        "concerned about school curriculum",
        "parents should decide what's taught",
        "inappropriate content in schools",
        "school curriculum concerns"
      );
      break;
    case "Affirmative Action in Admissions":
      plainLanguage.push(
        "college admission policies",
        "race-based admissions",
        "fair college admissions",
        "merit-based admissions",
        "diversity in higher education"
      );
      break;
    case "Transgender Rights":
      plainLanguage.push(
        "trans people in sports",
        "transgender healthcare",
        "gender identity rights",
        "transgender protections",
        "trans issues"
      );
      break;
    case "Racial Discrimination":
      plainLanguage.push(
        "racial equality",
        "systemic racism",
        "racial justice",
        "end discrimination",
        "equal treatment regardless of race"
      );
      break;
    case "Border Security":
      plainLanguage.push(
        "secure the border",
        "illegal immigration",
        "border crisis",
        "immigration enforcement",
        "control the border"
      );
      break;
    case "Path to Citizenship":
      plainLanguage.push(
        "immigration reform",
        "dreamers",
        "undocumented immigrants",
        "legal status for immigrants",
        "citizenship for immigrants"
      );
      break;
    case "Climate Change":
      plainLanguage.push(
        "global warming",
        "environmental protection",
        "climate crisis",
        "save the planet",
        "reduce emissions"
      );
      break;
    case "Energy Policies":
      plainLanguage.push(
        "renewable energy",
        "fossil fuels",
        "clean energy",
        "oil and gas",
        "energy independence"
      );
      break;
    case "Election Integrity":
      plainLanguage.push(
        "fair elections",
        "voting rights",
        "election security",
        "stop election fraud",
        "trust in elections"
      );
      break;
    case "Government Transparency":
      plainLanguage.push(
        "government accountability",
        "open government",
        "public records access",
        "government secrecy",
        "honest government"
      );
      break;
    case "Gun Control":
      plainLanguage.push(
        "gun rights",
        "second amendment",
        "gun safety",
        "prevent gun violence",
        "responsible gun ownership"
      );
      break;
    case "Police Reform":
      plainLanguage.push(
        "law enforcement accountability",
        "police brutality",
        "defund the police",
        "community policing",
        "police oversight"
      );
      break;
    case "Data Privacy":
      plainLanguage.push(
        "online privacy",
        "personal data protection",
        "surveillance concerns",
        "tech companies and privacy",
        "digital rights"
      );
      break;
    case "Artificial Intelligence":
      plainLanguage.push(
        "AI regulation",
        "AI taking jobs",
        "AI ethics",
        "AI safety",
        "control over AI"
      );
      break;
    default:
      // Generate some generic plain language based on the topic name
      const words = topicName.toLowerCase().split(' ');
      plainLanguage.push(
        `concerned about ${topicName.toLowerCase()}`,
        `issues with ${topicName.toLowerCase()}`,
        `${topicName.toLowerCase()} problems`,
        `${topicName.toLowerCase()} reform`
      );
  }
  
  return plainLanguage;
}

// Helper function to generate keywords
function generateKeywords(topicName: string, descriptionWords: string[]): string[] {
  // Start with the topic name words
  const topicWords = topicName.toLowerCase().split(' ');
  
  // Add the most relevant description words (avoid duplicates)
  const keywords = [...new Set([...topicWords, ...descriptionWords.slice(0, 5)])];
  
  // Add specific keywords based on the topic
  switch (topicName) {
    case "Inflation and Cost of Living":
      keywords.push("inflation", "prices", "cost", "expensive", "afford", "groceries", "housing", "rent");
      break;
    case "Job Market and Wages":
      keywords.push("job", "employment", "wage", "salary", "income", "worker", "automation", "layoff");
      break;
    case "Taxation and Government Spending":
      keywords.push("tax", "taxes", "spending", "debt", "deficit", "budget", "fiscal", "revenue");
      break;
    case "Affordable Healthcare Access":
      keywords.push("healthcare", "insurance", "medical", "doctor", "hospital", "prescription", "medicine");
      break;
    case "Reproductive Rights":
      keywords.push("abortion", "reproductive", "choice", "women", "pregnancy", "pro-choice", "pro-life");
      break;
    case "Curriculum Content":
      keywords.push("school", "education", "curriculum", "teach", "classroom", "student", "parent", "crt");
      break;
    case "Affirmative Action in Admissions":
      keywords.push("affirmative", "admission", "college", "university", "diversity", "merit", "race");
      break;
    case "Transgender Rights":
      keywords.push("transgender", "trans", "gender", "lgbtq", "identity", "sports", "bathroom");
      break;
    case "Racial Discrimination":
      keywords.push("race", "racial", "discrimination", "equality", "equity", "justice", "minority");
      break;
    case "Border Security":
      keywords.push("border", "immigration", "illegal", "security", "wall", "migrant", "patrol");
      break;
    case "Path to Citizenship":
      keywords.push("citizenship", "immigrant", "undocumented", "dreamer", "daca", "legal", "status");
      break;
    case "Climate Change":
      keywords.push("climate", "warming", "environment", "emission", "carbon", "pollution", "green");
      break;
    case "Energy Policies":
      keywords.push("energy", "renewable", "fossil", "oil", "gas", "solar", "wind", "nuclear");
      break;
    case "Election Integrity":
      keywords.push("election", "vote", "voting", "ballot", "fraud", "integrity", "democracy");
      break;
    case "Government Transparency":
      keywords.push("transparency", "accountability", "open", "corruption", "honest", "disclosure");
      break;
    case "Gun Control":
      keywords.push("gun", "firearm", "second amendment", "nra", "shooting", "violence", "control");
      break;
    case "Police Reform":
      keywords.push("police", "law enforcement", "brutality", "defund", "reform", "oversight");
      break;
    case "Data Privacy":
      keywords.push("privacy", "data", "surveillance", "tracking", "personal information", "tech");
      break;
    case "Artificial Intelligence":
      keywords.push("ai", "artificial intelligence", "algorithm", "automation", "robot", "machine");
      break;
  }
  
  // Return unique keywords
  return [...new Set(keywords)];
}

// Helper function to generate nuance values
function generateNuance(topicName: string, category: string): {[key: string]: number | boolean} {
  const nuance: {[key: string]: number | boolean} = {};
  
  // Add some default nuance values based on category
  switch (category) {
    case "Economy":
      nuance.economic_impact = 0.9;
      nuance.individual_financial_impact = 0.8;
      break;
    case "Healthcare":
      nuance.health_impact = 0.9;
      nuance.personal_choice = 0.8;
      break;
    case "Education":
      nuance.educational_impact = 0.9;
      nuance.parental_rights = 0.7;
      break;
    case "Civil Rights":
      nuance.individual_rights = 0.9;
      nuance.equality = 0.8;
      break;
    case "Immigration":
      nuance.national_security = 0.7;
      nuance.humanitarian = 0.7;
      break;
    case "Environment":
      nuance.environmental_impact = 0.9;
      nuance.economic_tradeoff = 0.6;
      break;
    case "Governance":
      nuance.democratic_process = 0.9;
      nuance.institutional_trust = 0.8;
      break;
    case "Public Safety":
      nuance.public_safety = 0.9;
      nuance.individual_rights = 0.7;
      break;
    case "Technology":
      nuance.technological_impact = 0.8;
      nuance.privacy = 0.7;
      break;
  }
  
  // Add specific nuance values based on topic
  switch (topicName) {
    case "Reproductive Rights":
      nuance.bodily_autonomy = 0.9;
      nuance.religious_values = 0.2;
      break;
    case "Gun Control":
      nuance.second_amendment = 0.8;
      nuance.public_safety = 0.8;
      break;
    case "Transgender Rights":
      nuance.gender_identity = 0.9;
      nuance.traditional_values = 0.2;
      break;
    case "Border Security":
      nuance.national_security = 0.9;
      nuance.humanitarian = 0.3;
      break;
    case "Path to Citizenship":
      nuance.humanitarian = 0.9;
      nuance.rule_of_law = 0.5;
      break;
    case "Affirmative Action in Admissions":
      nuance.diversity = 0.8;
      nuance.merit = 0.7;
      break;
  }
  
  return nuance;
}

// Generate dynamic mappings from current issues
const dynamicMappings = generateMappingsFromCurrentIssues();

// Combine with our existing manual mappings
// This ensures we have fallbacks if the current issues data isn't loaded
export const enhancedPolicyMappings: Record<string, PolicyMapping> = {
  // Core mappings that should always be available
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
  
  // Merge with dynamically generated mappings
  ...dynamicMappings
};
