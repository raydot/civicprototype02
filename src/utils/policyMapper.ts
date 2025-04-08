import issueTerminology from '@/config/issueTerminology.json';
import { IssueTerminology, PolicyTerm } from '@/types/terminology';

interface NuancedMapping {
  standardTerm: string;
  confidence: number;
  nuances: {
    [key: string]: number;
  };
  contextualFactors: string[];
  potentialConflicts: string[];
}

export class PolicyMapper {
  private terminology: IssueTerminology;
  private contextMemory: Map<string, string[]>;

  constructor() {
    this.terminology = issueTerminology as IssueTerminology;
    this.contextMemory = new Map();
  }

  /**
   * Maps a user's input to standardized policy terms while preserving nuance
   */
  public mapUserInput(input: string, context?: string[]): NuancedMapping[] {
    const words = this.preprocessInput(input);
    const mappings: NuancedMapping[] = [];
    
    // Store context for future reference
    if (context) {
      this.contextMemory.set(input, context);
    }

    // Check for complex concepts that need special handling
    if (this.containsComplexConcept(words)) {
      return this.handleComplexMapping(words, context);
    }

    // Standard mapping process
    for (const [key, term] of Object.entries(this.terminology)) {
      if (this.isPolicyTerm(term)) {
        const plainLanguage = term.plainLanguage || [term.plainEnglish];
        const match = this.calculateMatch(words, plainLanguage);
        if (match.confidence > 0.6) {
          mappings.push({
            standardTerm: term.standardTerm,
            confidence: match.confidence,
            nuances: term.nuance || {},
            contextualFactors: this.extractContextualFactors(words, term),
            potentialConflicts: this.identifyPotentialConflicts(term, context)
          });
        }
      }
    }

    return mappings;
  }

  private isPolicyTerm(term: any): term is PolicyTerm {
    return typeof term === 'object' && 
           'standardTerm' in term && 
           'plainEnglish' in term &&
           'nuance' in term;
  }

  /**
   * Special handling for complex concepts like "fair hiring" vs "affirmative action"
   */
  private handleComplexMapping(words: string[], context?: string[]): NuancedMapping[] {
    const mappings: NuancedMapping[] = [];

    // Example: Handling "fair hiring practices" vs "affirmative action"
    if (this.containsHiringRelatedTerms(words)) {
      const fairHiringScore = this.calculateFairHiringScore(words, context);
      const affirmativeActionScore = this.calculateAffirmativeActionScore(words, context);

      if (fairHiringScore > affirmativeActionScore) {
        mappings.push({
          standardTerm: "Fair Employment Practices",
          confidence: fairHiringScore,
          nuances: {
            merit_based: 0.9,
            equal_opportunity: 0.8,
            non_discrimination: 0.9
          },
          contextualFactors: ["employment", "workplace", "hiring"],
          potentialConflicts: ["quota systems", "preferential treatment"]
        });
      } else if (affirmativeActionScore > fairHiringScore) {
        mappings.push({
          standardTerm: "Affirmative Action",
          confidence: affirmativeActionScore,
          nuances: {
            diversity_initiatives: 0.9,
            historical_inequity: 0.8,
            representation: 0.9
          },
          contextualFactors: ["demographics", "equity", "inclusion"],
          potentialConflicts: ["merit-only systems", "color-blind policies"]
        });
      }
    }

    return mappings;
  }

  private preprocessInput(input: string): string[] {
    return input.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  private containsComplexConcept(words: string[]): boolean {
    const complexTerms = [
      ["fair", "hiring"],
      ["affirmative", "action"],
      ["equal", "opportunity"],
      ["diversity", "equity", "inclusion"],
      ["merit", "based"],
      // Add more complex concept patterns
    ];

    return complexTerms.some(term => 
      term.every(word => words.includes(word))
    );
  }

  private containsHiringRelatedTerms(words: string[]): boolean {
    const hiringTerms = [
      "hiring", "employment", "job", "workplace", "discrimination",
      "opportunity", "fair", "equity", "diversity", "inclusion"
    ];
    return words.some(word => hiringTerms.includes(word));
  }

  private calculateMatch(words: string[], targetPhrases: string[]): { confidence: number } {
    let maxConfidence = 0;
    
    for (const phrase of targetPhrases) {
      const phraseWords = this.preprocessInput(phrase);
      const matchCount = words.filter(word => phraseWords.includes(word)).length;
      const confidence = matchCount / Math.max(words.length, phraseWords.length);
      maxConfidence = Math.max(maxConfidence, confidence);
    }

    return { confidence: maxConfidence };
  }

  private extractContextualFactors(words: string[], term: PolicyTerm): string[] {
    const factors: string[] = [];
    
    if (term.contextualFactors) {
      factors.push(...term.contextualFactors.filter(factor => 
        words.some(word => factor.toLowerCase().includes(word))
      ));
    }

    return factors;
  }

  private identifyPotentialConflicts(term: PolicyTerm, context?: string[]): string[] {
    const conflicts: string[] = [];
    
    if (term.conflicts) {
      conflicts.push(...term.conflicts);
    }

    if (context && term.contextualConflicts) {
      conflicts.push(...term.contextualConflicts.filter(conflict =>
        context.some(ctx => ctx.toLowerCase().includes(conflict.toLowerCase()))
      ));
    }

    return conflicts;
  }

  private calculateFairHiringScore(words: string[], context?: string[]): number {
    const fairHiringTerms = [
      "merit", "qualification", "skill", "experience", "fair",
      "equal", "opportunity", "non-discrimination"
    ];
    
    const matchCount = words.filter(word => 
      fairHiringTerms.includes(word)
    ).length;

    let score = matchCount / fairHiringTerms.length;

    if (context) {
      const contextBoost = context.filter(ctx => 
        ctx.toLowerCase().includes("merit") ||
        ctx.toLowerCase().includes("qualification") ||
        ctx.toLowerCase().includes("fair")
      ).length * 0.1;
      
      score += contextBoost;
    }

    return Math.min(score, 1);
  }

  private calculateAffirmativeActionScore(words: string[], context?: string[]): number {
    const affirmativeActionTerms = [
      "affirmative", "action", "diversity", "equity", "inclusion",
      "representation", "demographic", "underrepresented"
    ];
    
    const matchCount = words.filter(word => 
      affirmativeActionTerms.includes(word)
    ).length;

    let score = matchCount / affirmativeActionTerms.length;

    if (context) {
      const contextBoost = context.filter(ctx => 
        ctx.toLowerCase().includes("diversity") ||
        ctx.toLowerCase().includes("equity") ||
        ctx.toLowerCase().includes("inclusion")
      ).length * 0.1;
      
      score += contextBoost;
    }

    return Math.min(score, 1);
  }
}
