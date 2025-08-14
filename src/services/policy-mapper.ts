import { initialPolicyMappings } from '@/PPMEMappingData/policy-mappings';
import { enhancedPolicyMappings } from '@/PPMEMappingData/enhanced-policy-mappings';
import { detectPriorityConflicts } from '@/utils/priorityConflicts';
import { MappedPriority, PolicyData, PriorityAnalysis } from '@/types/policy-mappings';
import { AIClarificationService } from './ai-clarification';
import { browserIssueTerminologyService } from './issue-terminology-service';

// Define persona mappings directly in this file since the import isn't working
interface PersonaMapping {
  persona: string;
  summary: string;
  priority: string;
  mapsTo: string;
}

const personaMappings: PersonaMapping[] = [
  // Sal (19)
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "I don't want to be labeled or canceled just for having questions.",
    mapsTo: "Free expression / civil liberties"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "Why can't the government agree on what we need to do to address climate change?",
    mapsTo: "Climate research + market-based climate policy"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "IF trans people want to claim their pronouns...I don't want it forced on me.",
    mapsTo: "Pronoun policy / speech freedom tension"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "Censorship freaks me out — like how social media hides stuff...",
    mapsTo: "Tech regulation, content moderation transparency"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "Politics feels corrupt — can it be fixed?",
    mapsTo: "Government ethics, transparency reform"
  },
  {
    persona: "Sal (19)",
    summary: "Mixed-race student athlete, cautious, values liberty, unsure politically",
    priority: "College costs too much, how will we afford homes?",
    mapsTo: "Tuition reform, student debt relief, housing access"
  },
  
  // Danielle (23)
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "I want women to have choices and control over our bodies.",
    mapsTo: "Reproductive rights"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "Scared by violent immigrant stories... what's with pardons?",
    mapsTo: "Public safety, immigration enforcement, criminal justice"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "Rich get richer, can't even pay rent.",
    mapsTo: "Income inequality, rent relief, minimum wage"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "We need better mental health care...",
    mapsTo: "Affordable therapy, Medicaid, community care"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "Protect LGBTQ+ rights, but I don't like trans women in my locker room.",
    mapsTo: "Anti-discrimination + gender space policy tension"
  },
  {
    persona: "Danielle (23)",
    summary: "Anxious, pro-women, scared of crime, frustrated by inequality",
    priority: "I voted once, but felt forced... no great choice.",
    mapsTo: "Electoral trust, campaign reform, better candidate access"
  },
  
  // Joe (20)
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Gov't should stay out of most things.",
    mapsTo: "Limited government, deregulation"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Woke politics divide us — I don't have a voice.",
    mapsTo: "Anti-DEI, race/gender neutrality"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Gov't spending is out of control.",
    mapsTo: "Fiscal conservatism, balanced budget"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Support gun control — school shootings are personal.",
    mapsTo: "Gun background checks, red-flag laws"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Admissions should be based on effort — not identity.",
    mapsTo: "Race-neutral admissions policy"
  },
  {
    persona: "Joe (20)",
    summary: "Conservative family, centrist, feels alienated by identity politics",
    priority: "Men's mental health isn't taken seriously.",
    mapsTo: "Male mental health access and stigma reduction"
  },
  
  // T.J. (25)
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Queer and trans folks are under attack.",
    mapsTo: "LGBTQ+ rights, anti-discrimination protections"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Tired of fake allyship — I want real policy.",
    mapsTo: "Policy integrity, equity audits"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "We need police accountability, not just promises.",
    mapsTo: "Law enforcement reform"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Scared of how much data is collected on me.",
    mapsTo: "Digital privacy, surveillance reform"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "The planet is burning... but elites fly jets.",
    mapsTo: "Climate justice, carbon accountability"
  },
  {
    persona: "T.J. (25)",
    summary: "Gay Asian barista, youth advocate, pro-queer rights, anti-tokenism",
    priority: "Mental health is a crisis — especially for queer youth.",
    mapsTo: "Inclusive mental health funding"
  },
  
  // Gracie (22)
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "Abortion ends a life — we need to support moms instead.",
    mapsTo: "Pro-life policy + maternal support"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I love my church and I want laws that respect that.",
    mapsTo: "Religious liberty protections"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I back the police — but they need to earn our trust.",
    mapsTo: "Community policing + trust reform"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "We need more mental health support, especially for families and veterans.",
    mapsTo: "Family mental health + VA access"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I believe in traditional values — family comes first.",
    mapsTo: "Family policy, child care, faith-friendly spaces"
  },
  {
    persona: "Gracie (22)",
    summary: "Biracial Latina + White, pro-life, faith-led, safety-minded",
    priority: "I want to believe elections are fair — but I have doubts.",
    mapsTo: "Election integrity + civic trust initiatives"
  }
];

// In-memory store for terms that need mapping (could be persisted later)
const termsNeedingMapping: Set<string> = new Set();

export class PolicyMapper {
  private aiClarificationService: AIClarificationService;
  private confidenceThreshold = 0.8; // 80% confidence threshold as per acceptance criteria
  private lowConfidenceThreshold = 0.5; // Threshold for suggesting term addition

  constructor(apiKey?: string) {
    // Initialize the AI clarification service
    this.aiClarificationService = new AIClarificationService(apiKey);
  }

  /**
   * Async version: Maps a single priority to policy terms, with AI fallback and tracking of unmapped terms
   */
  async mapPriorityToTerms(priority: string): Promise<string[]> {
    // Check for persona mappings first
    const personaMapping = this.checkPersonaMappings(priority);
    if (personaMapping && personaMapping.mappedTerms) {
      return personaMapping.mappedTerms;
    }
    // Otherwise use standard mapping logic
    const matches = this.findAllMatches(priority);
    if (matches.length > 0 && matches[0] !== priority) {
      return matches;
    }
    // If no mapping found, add to needs-mapping list
    termsNeedingMapping.add(priority);
    // Try AI fallback
    if (this.aiClarificationService.isConfigured()) {
      try {
        const aiResult = await this.aiClarificationService.getClarification(priority);
        if (aiResult && aiResult.possibleTopics && aiResult.possibleTopics.length > 0) {
          return aiResult.possibleTopics;
        }
      } catch (err) {
        console.error('AI mapping failed:', err);
      }
    }
    // Fallback: return prompt for more detail
    return ["please say more so we can map this better"];
  }

  // Expose terms needing mapping for review
  getTermsNeedingMapping(): string[] {
    return Array.from(termsNeedingMapping);
  }

  async mapPriorities(priorities: string[]): Promise<PriorityAnalysis> {
    console.log('Starting to map priorities to policies:', priorities);
    const mappedPrioritiesPromises = priorities.map(async priority => {
      console.log('Mapping priority:', priority);
      // Compose the mapped priority object
      const mappedTerms = await this.mapPriorityToTerms(priority);
      return {
        original: priority,
        priority: priority,
        mappedTerms: mappedTerms,
        policyTerms: mappedTerms,
        category: this.getCategoryFromMappedTerms(mappedTerms),
        sentiment: this.analyzeSentiment(priority),
        confidence: mappedTerms && mappedTerms.length > 0 && mappedTerms[0] !== priority ? 0.7 : 0.3 // crude confidence
      } as MappedPriority;
    });
    const mappedPriorities = await Promise.all(mappedPrioritiesPromises);
    console.log('Mapped priorities result:', JSON.stringify(mappedPriorities, null, 2));
    const conflicts = this.detectConflicts(mappedPriorities);
    return {
      mappedPriorities,
      conflicts
    };
  }

  /**
   * Set the API key for the AI clarification service
   */
  setApiKey(apiKey: string): void {
    this.aiClarificationService.setApiKey(apiKey);
  }

  /**
   * Detect conflicts between mapped priorities
   */
  detectConflicts(mappedPriorities: MappedPriority[]) {
    // Use the utility function to detect conflicts
    return detectPriorityConflicts(mappedPriorities);
  }

  /**
   * Check if a priority matches any known persona priorities from our CSV data
   */
  checkPersonaMappings(priority: string): MappedPriority | null {
    // Normalize the priority text for comparison
    const normalizedPriority = priority.toLowerCase().trim().replace(/[.,;:!?()]/g, '');
    
    // Check against our persona mappings
    for (const mapping of personaMappings) {
      const normalizedMappingPriority = mapping.priority.toLowerCase().trim().replace(/[.,;:!?()]/g, '');
      
      // Check for exact match or if the priority contains the mapping priority
      if (normalizedPriority === normalizedMappingPriority || 
          normalizedPriority.includes(normalizedMappingPriority) || 
          normalizedMappingPriority.includes(normalizedPriority)) {
        
        // Parse the mapped terms into an array
        const mappedTerms = mapping.mapsTo.split(/[,+]/g).map(term => term.trim());
        
        return {
          original: priority,
          priority: priority,
          mappedTerms: mappedTerms,
          policyTerms: mappedTerms,
          category: this.getCategoryFromMappedTerms(mappedTerms),
          sentiment: this.analyzeSentiment(priority),
          confidence: 0.95 // High confidence for predefined mappings
        } as MappedPriority;
      }
    }
    
    return null;
  }

  /**
   * Determine a category based on mapped terms
   */
  getCategoryFromMappedTerms(mappedTerms: string[]): string {
    // Map of common terms to categories
    const categoryMap: Record<string, string> = {
      'rights': 'Civil Rights',
      'freedom': 'Civil Liberties',
      'liberty': 'Civil Liberties',
      'expression': 'Civil Liberties',
      'speech': 'Civil Liberties',
      'climate': 'Environment',
      'environment': 'Environment',
      'tax': 'Economy',
      'economic': 'Economy',
      'inequality': 'Economy',
      'education': 'Education',
      'college': 'Education',
      'school': 'Education',
      'health': 'Healthcare',
      'mental': 'Healthcare',
      'therapy': 'Healthcare',
      'police': 'Criminal Justice',
      'criminal': 'Criminal Justice',
      'immigration': 'Immigration',
      'religion': 'Religion',
      'faith': 'Religion',
      'church': 'Religion',
      'election': 'Democracy',
      'voting': 'Democracy',
      'privacy': 'Technology',
      'data': 'Technology',
      'digital': 'Technology',
      'lgbtq': 'Civil Rights',
      'trans': 'Civil Rights',
      'queer': 'Civil Rights',
      'gender': 'Civil Rights'
    };
    
    // Check each mapped term against our category map
    for (const term of mappedTerms) {
      for (const [keyword, category] of Object.entries(categoryMap)) {
        if (term.toLowerCase().includes(keyword)) {
          return category;
        }
      }
    }
    
    return 'Other'; // Default category
  }

  /**
   * Check if a priority statement is vague and partisan without specific policy content
   */
  isVaguePartisanStatement(priority: string): boolean {
    const vaguePartisanPhrases = [
      'make america great again',
      'drain the swamp',
      'build back better',
      'radical left',
      'far right',
      'liberal agenda',
      'conservative values',
      'socialist agenda',
      'communist',
      'fascist'
    ];
    
    const lowercasePriority = priority.toLowerCase();
    
    // Check if the priority contains vague partisan phrases
    if (vaguePartisanPhrases.some(phrase => lowercasePriority.includes(phrase))) {
      return !this.containsSpecificPolicyContent(lowercasePriority);
    }
    
    return false;
  }

  /**
   * Check if text contains specific policy content
   */
  containsSpecificPolicyContent(text: string): boolean {
    const policyKeywords = [
      'tax', 'healthcare', 'education', 'climate', 'immigration',
      'gun', 'abortion', 'economy', 'housing', 'infrastructure',
      'military', 'police', 'reform', 'regulation', 'deregulation',
      'budget', 'deficit', 'spending', 'welfare', 'social security',
      'medicare', 'medicaid', 'environment', 'energy', 'foreign policy',
      'trade', 'tariff', 'subsidy', 'minimum wage', 'labor',
      'union', 'worker', 'privacy', 'data', 'tech', 'internet'
    ];
    
    return policyKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Break a priority into meaningful phrases for better mapping
   */
  breakIntoPhrases(priority: string): string[] {
    // Split on common conjunctions and punctuation
    return priority
      .split(/[,.;:!?]|\band\b|\bor\b|\bbut\b|\byet\b|\bwhile\b|\bhowever\b/i)
      .map(phrase => phrase.trim())
      .filter(phrase => phrase.length > 0);
  }

  /**
   * Find the best matching policy term for a given priority
   */
  findBestMatch(priority: string): string {
    const lowercasePriority = priority.toLowerCase();
    
    // First check for exact matches in policy mappings
    for (const [key, mapping] of Object.entries({...initialPolicyMappings, ...enhancedPolicyMappings})) {
      if (mapping.plainLanguage && mapping.plainLanguage.some(phrase => 
        lowercasePriority.includes(phrase.toLowerCase()))) {
        return mapping.standardTerm;
      }
    }
    
    // If no exact match, look for keyword matches
    let bestMatch = priority;
    let bestScore = 0;
    
    for (const [key, mapping] of Object.entries({...initialPolicyMappings, ...enhancedPolicyMappings})) {
      const keywords = mapping.keywords || [];
      let score = 0;
      
      for (const keyword of keywords) {
        if (lowercasePriority.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = mapping.standardTerm;
      }
    }
    
    return bestMatch;
  }

  /**
   * Find all matching policy terms for a given priority
   */
  findAllMatches(priority: string): string[] {
    const lowercasePriority = priority.toLowerCase();
    const matches: string[] = [];
    
    // Check all policy mappings for matches
    for (const [key, mapping] of Object.entries({...initialPolicyMappings, ...enhancedPolicyMappings})) {
      // Check plain language phrases
      if (mapping.plainLanguage && mapping.plainLanguage.some(phrase => 
        lowercasePriority.includes(phrase.toLowerCase()))) {
        matches.push(mapping.standardTerm);
        continue;
      }
      
      // Check keywords
      const keywords = mapping.keywords || [];
      let keywordMatches = 0;
      
      for (const keyword of keywords) {
        if (lowercasePriority.includes(keyword.toLowerCase())) {
          keywordMatches += 1;
        }
      }
      
      // If we have multiple keyword matches, add this term
      if (keywordMatches >= 2) {
        matches.push(mapping.standardTerm);
      }
    }
    
    // If no matches found, return the original priority
    return matches.length > 0 ? matches : [priority];
  }

  /**
   * Find the category for a given priority
   */
  findCategory(priority: string): string {
    const lowercasePriority = priority.toLowerCase();
    
    // Category mapping based on keywords
    const categoryMap: Record<string, string> = {
      'tax': 'Economy',
      'economic': 'Economy',
      'job': 'Economy',
      'wage': 'Economy',
      'income': 'Economy',
      'poverty': 'Economy',
      'wealth': 'Economy',
      'healthcare': 'Healthcare',
      'health': 'Healthcare',
      'medical': 'Healthcare',
      'doctor': 'Healthcare',
      'hospital': 'Healthcare',
      'insurance': 'Healthcare',
      'education': 'Education',
      'school': 'Education',
      'college': 'Education',
      'student': 'Education',
      'teacher': 'Education',
      'climate': 'Environment',
      'environment': 'Environment',
      'pollution': 'Environment',
      'carbon': 'Environment',
      'renewable': 'Environment',
      'immigration': 'Immigration',
      'immigrant': 'Immigration',
      'border': 'Immigration',
      'gun': 'Public Safety',
      'crime': 'Public Safety',
      'police': 'Public Safety',
      'safety': 'Public Safety',
      'abortion': 'Reproductive Rights',
      'reproductive': 'Reproductive Rights',
      'choice': 'Reproductive Rights',
      'military': 'National Security',
      'defense': 'National Security',
      'terrorism': 'National Security',
      'housing': 'Housing',
      'rent': 'Housing',
      'homeless': 'Housing',
      'infrastructure': 'Infrastructure',
      'road': 'Infrastructure',
      'bridge': 'Infrastructure',
      'transit': 'Infrastructure',
      'transportation': 'Infrastructure',
      'internet': 'Technology',
      'tech': 'Technology',
      'digital': 'Technology',
      'privacy': 'Technology',
      'data': 'Technology',
      'lgbtq': 'Civil Rights',
      'gay': 'Civil Rights',
      'lesbian': 'Civil Rights',
      'transgender': 'Civil Rights',
      'trans': 'Civil Rights',
      'queer': 'Civil Rights',
      'racial': 'Civil Rights',
      'race': 'Civil Rights',
      'discrimination': 'Civil Rights',
      'equality': 'Civil Rights',
      'religion': 'Religion',
      'religious': 'Religion',
      'faith': 'Religion',
      'church': 'Religion',
      'speech': 'Civil Liberties',
      'expression': 'Civil Liberties',
      'freedom': 'Civil Liberties',
      'liberty': 'Civil Liberties',
      'censorship': 'Civil Liberties',
      'election': 'Democracy',
      'voting': 'Democracy',
      'vote': 'Democracy',
      'democracy': 'Democracy',
      'corruption': 'Government Ethics',
      'ethics': 'Government Ethics',
      'transparency': 'Government Ethics',
      'lobbying': 'Government Ethics'
    };
    
    // Check for category keywords in the priority
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (lowercasePriority.includes(keyword)) {
        return category;
      }
    }
    
    // If no category found, try to find a category based on the best matching policy term
    const bestMatch = this.findBestMatch(priority);
    if (bestMatch !== priority) {
      for (const [key, mapping] of Object.entries({...initialPolicyMappings, ...enhancedPolicyMappings})) {
        if (mapping.standardTerm === bestMatch && mapping.category) {
          return mapping.category;
        }
      }
    }
    
    return 'Other'; // Default category
  }

  /**
   * Analyze the sentiment of a priority
   */
  analyzeSentiment(priority: string): 'positive' | 'negative' | 'neutral' {
    const lowercasePriority = priority.toLowerCase();
    
    const positiveWords = [
      'support', 'favor', 'agree', 'good', 'better', 'best',
      'important', 'necessary', 'essential', 'critical', 'vital',
      'want', 'need', 'should', 'must', 'increase', 'improve',
      'enhance', 'strengthen', 'protect', 'defend', 'promote',
      'encourage', 'help', 'benefit', 'advance', 'progress'
    ];
    
    const negativeWords = [
      'oppose', 'against', 'disagree', 'bad', 'worse', 'worst',
      'harmful', 'dangerous', 'risky', 'threat', 'problem',
      'don\'t', 'not', 'never', 'stop', 'prevent', 'reduce',
      'eliminate', 'ban', 'prohibit', 'restrict', 'limit',
      'cut', 'decrease', 'lower', 'weaken', 'undermine'
    ];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    // Count positive and negative words
    for (const word of positiveWords) {
      if (lowercasePriority.includes(word)) {
        positiveScore += 1;
      }
    }
    
    for (const word of negativeWords) {
      if (lowercasePriority.includes(word)) {
        negativeScore += 1;
      }
    }
    
    // Determine sentiment based on scores
    if (positiveScore > negativeScore) {
      return 'positive';
    } else if (negativeScore > positiveScore) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  /**
   * Calculate confidence score for a priority mapping
   */
  calculateConfidence(priority: string): number {
    const lowercasePriority = priority.toLowerCase();
    
    // Start with a base confidence
    let confidence = 0.5;
    
    // Check for exact matches in policy mappings
    for (const [key, mapping] of Object.entries({...initialPolicyMappings, ...enhancedPolicyMappings})) {
      if (mapping.plainLanguage && mapping.plainLanguage.some(phrase => 
        lowercasePriority.includes(phrase.toLowerCase()))) {
        confidence += 0.3; // Significant boost for exact phrase match
        break;
      }
    }
    
    // Check for keyword matches
    let keywordMatches = 0;
    for (const [key, mapping] of Object.entries({...initialPolicyMappings, ...enhancedPolicyMappings})) {
      const keywords = mapping.keywords || [];
      for (const keyword of keywords) {
        if (lowercasePriority.includes(keyword.toLowerCase())) {
          keywordMatches += 1;
        }
      }
    }
    
    // Adjust confidence based on keyword matches
    if (keywordMatches > 5) {
      confidence += 0.2;
    } else if (keywordMatches > 2) {
      confidence += 0.1;
    }
    
    // Check for specific policy content
    if (this.containsSpecificPolicyContent(lowercasePriority)) {
      confidence += 0.1;
    }
    
    // Check for vague partisan statements
    if (this.isVaguePartisanStatement(lowercasePriority)) {
      confidence -= 0.2;
    }
    
    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Add a new term to the terminology
   */
  async addNewTerm(
    term: string,
    category: string,
    mappedPolicies: string[] = []
  ): Promise<boolean> {
    try {
      return await browserIssueTerminologyService.addPendingTerm(
        term,
        category,
        [], // No synonyms initially
        mappedPolicies
      );
    } catch (error) {
      console.error('Error adding new term:', error);
      return false;
    }
  }

  /**
   * Suggest a category for a new term
   */
  suggestCategory(priority: string): string {
    // List of common categories
    const categories = [
      "Economy",
      "Healthcare",
      "Education",
      "Environment",
      "Immigration",
      "Foreign Policy",
      "National Security",
      "Civil Rights",
      "Criminal Justice",
      "Technology",
      "Infrastructure"
    ];
    
    // Simple keyword matching for category suggestion
    const priorityLower = priority.toLowerCase();
    
    if (priorityLower.includes('tax') || priorityLower.includes('econom') || 
        priorityLower.includes('job') || priorityLower.includes('wage') || 
        priorityLower.includes('inflation') || priorityLower.includes('spend')) {
      return "Economy";
    }
    
    if (priorityLower.includes('health') || priorityLower.includes('medic') || 
        priorityLower.includes('doctor') || priorityLower.includes('insur') || 
        priorityLower.includes('hospital')) {
      return "Healthcare";
    }
    
    if (priorityLower.includes('school') || priorityLower.includes('educat') || 
        priorityLower.includes('teach') || priorityLower.includes('student') || 
        priorityLower.includes('college')) {
      return "Education";
    }
    
    if (priorityLower.includes('environment') || priorityLower.includes('climat') || 
        priorityLower.includes('green') || priorityLower.includes('pollut') || 
        priorityLower.includes('carbon')) {
      return "Environment";
    }
    
    if (priorityLower.includes('immigr') || priorityLower.includes('border') || 
        priorityLower.includes('visa') || priorityLower.includes('asylum')) {
      return "Immigration";
    }
    
    if (priorityLower.includes('right') || priorityLower.includes('freedom') || 
        priorityLower.includes('libert') || priorityLower.includes('equal')) {
      return "Civil Rights";
    }
    
    if (priorityLower.includes('crime') || priorityLower.includes('polic') || 
        priorityLower.includes('prison') || priorityLower.includes('law') || 
        priorityLower.includes('justice')) {
      return "Criminal Justice";
    }
    
    if (priorityLower.includes('tech') || priorityLower.includes('internet') || 
        priorityLower.includes('digital') || priorityLower.includes('ai') || 
        priorityLower.includes('data')) {
      return "Technology";
    }
    
    // Default to "Other" if no category matches
    return "Other";
  }
}
