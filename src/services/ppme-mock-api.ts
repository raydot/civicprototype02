import issueTerminology from '@/PPMEMappingData/issueTerminology.json';

// PPME API Types
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

class PPMEMockApiService {
  private readonly HIGH_CONFIDENCE_THRESHOLD = 0.8;
  private readonly LOW_CONFIDENCE_THRESHOLD = 0.4;
  private readonly PROCESSING_DELAY = 1500; // Simulate API delay

  /**
   * Main mapping function - maps user priorities to policy terms
   */
  async mapPriorities(request: PPMEMappingRequest): Promise<PPMEMappingResponse> {
    const startTime = Date.now();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, this.PROCESSING_DELAY));

    const mappedPriorities: PPMEMappedPriority[] = [];
    const needsClarification: string[] = [];

    for (const priority of request.priorities) {
      if (!priority.trim()) continue;

      const mapping = this.mapSinglePriority(priority);
      mappedPriorities.push(mapping);

      if (mapping.needsClarification) {
        needsClarification.push(priority);
      }
    }

    const overallConfidence = this.calculateOverallConfidence(mappedPriorities);
    const processingTime = Date.now() - startTime;

    return {
      mappedPriorities,
      overallConfidence,
      needsClarification,
      processingTime
    };
  }

  /**
   * Map a single priority to policy terms
   */
  private mapSinglePriority(priority: string): PPMEMappedPriority {
    const normalizedPriority = this.normalizeText(priority);
    const matches = this.findMatches(normalizedPriority);

    if (matches.length === 0) {
      return this.createFallbackMapping(priority);
    }

    const bestMatch = matches[0];
    const confidence = bestMatch.confidence;
    const needsClarification = confidence < this.LOW_CONFIDENCE_THRESHOLD || 
                              (matches.length > 1 && matches[1].confidence > this.LOW_CONFIDENCE_THRESHOLD);

    return {
      original: priority,
      termId: bestMatch.termId,
      standardTerm: bestMatch.standardTerm,
      plainEnglish: bestMatch.plainEnglish,
      confidence,
      nuance: this.getTermNuance(bestMatch.termId),
      needsClarification,
      candidates: needsClarification ? matches.slice(0, 3) : undefined,
      reasoning: this.generateReasoning(priority, bestMatch)
    };
  }

  /**
   * Find matching terms for a normalized priority
   */
  private findMatches(normalizedPriority: string): PPMECandidate[] {
    const candidates: PPMECandidate[] = [];

    // Iterate through all terms in the terminology file
    Object.entries(issueTerminology).forEach(([termId, termData]) => {
      if (termId === 'fallback' || termId === 'issues' || !this.isValidTermData(termData)) return;

      const matchScore = this.calculateMatchScore(normalizedPriority, termData);
      
      if (matchScore > 0) {
        candidates.push({
          termId,
          standardTerm: (termData as any).standardTerm,
          plainEnglish: (termData as any).plainEnglish,
          confidence: matchScore,
          matchedKeywords: this.getMatchedKeywords(normalizedPriority, (termData as any).plainLanguage || [])
        });
      }
    });

    // Sort by confidence (highest first)
    return candidates.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Check if term data is valid for processing
   */
  private isValidTermData(termData: any): boolean {
    return termData && 
           typeof termData === 'object' && 
           'standardTerm' in termData && 
           'plainEnglish' in termData;
  }

  /**
   * Calculate match score between user input and term data
   */
  private calculateMatchScore(normalizedPriority: string, termData: any): number {
    let score = 0;
    let totalPossible = 0;

    // Check plain language matches
    if (termData.plainLanguage && Array.isArray(termData.plainLanguage)) {
      for (const phrase of termData.plainLanguage) {
        totalPossible += 1;
        if (this.containsPhrase(normalizedPriority, phrase)) {
          score += 1;
        }
      }
    }

    // Check inclusion words (higher weight)
    if (termData.inclusionWords && Array.isArray(termData.inclusionWords)) {
      for (const word of termData.inclusionWords) {
        totalPossible += 2; // Higher weight
        if (this.containsPhrase(normalizedPriority, word)) {
          score += 2;
        }
      }
    }

    // Fallback: check if priority contains the standard term
    if (totalPossible === 0 && termData.standardTerm) {
      totalPossible = 1;
      if (this.containsPhrase(normalizedPriority, termData.standardTerm)) {
        score = 0.5; // Lower confidence for standard term matches
      }
    }

    // Normalize score to 0-1 range
    return totalPossible > 0 ? Math.min(score / totalPossible, 1) : 0;
  }

  /**
   * Check if text contains a phrase (fuzzy matching)
   */
  private containsPhrase(text: string, phrase: string): boolean {
    const normalizedPhrase = this.normalizeText(phrase);
    
    // Exact match
    if (text.includes(normalizedPhrase)) return true;
    
    // Word-by-word match
    const textWords = text.split(/\s+/);
    const phraseWords = normalizedPhrase.split(/\s+/);
    
    return phraseWords.every(word => 
      textWords.some(textWord => 
        textWord.includes(word) || word.includes(textWord)
      )
    );
  }

  /**
   * Get matched keywords for display
   */
  private getMatchedKeywords(normalizedPriority: string, plainLanguage: string[]): string[] {
    const matched: string[] = [];
    
    if (Array.isArray(plainLanguage)) {
      for (const phrase of plainLanguage) {
        if (this.containsPhrase(normalizedPriority, phrase)) {
          matched.push(phrase);
        }
      }
    }
    
    return matched.slice(0, 3); // Limit to top 3
  }

  /**
   * Create fallback mapping for unmatched priorities
   */
  private createFallbackMapping(priority: string): PPMEMappedPriority {
    const fallback = issueTerminology.fallback;
    
    return {
      original: priority,
      termId: 'fallback',
      standardTerm: fallback.standardTerm,
      plainEnglish: fallback.plainEnglish.replace('[user\'s language]', `"${priority}"`),
      confidence: 0,
      nuance: {},
      needsClarification: true,
      reasoning: 'No clear policy match found. Please provide more specific details.'
    };
  }

  /**
   * Get nuance data for a term
   */
  private getTermNuance(termId: string): Record<string, number> {
    const termData = issueTerminology[termId as keyof typeof issueTerminology];
    return (termData && 'nuance' in termData) ? termData.nuance : {};
  }

  /**
   * Generate reasoning for the mapping
   */
  private generateReasoning(priority: string, match: PPMECandidate): string {
    if (match.confidence > this.HIGH_CONFIDENCE_THRESHOLD) {
      return `Strong match found based on keywords: ${match.matchedKeywords.join(', ')}`;
    } else if (match.confidence > this.LOW_CONFIDENCE_THRESHOLD) {
      return `Partial match found. Consider clarifying your stance on this issue.`;
    } else {
      return `Weak match. Please provide more specific details about your priority.`;
    }
  }

  /**
   * Calculate overall confidence across all mappings
   */
  private calculateOverallConfidence(mappings: PPMEMappedPriority[]): number {
    if (mappings.length === 0) return 0;
    
    const totalConfidence = mappings.reduce((sum, mapping) => sum + mapping.confidence, 0);
    return totalConfidence / mappings.length;
  }

  /**
   * Normalize text for matching
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
      .replace(/\s+/g, ' ')     // Collapse multiple spaces
      .trim();
  }

  /**
   * Submit user feedback (store locally for now)
   */
  async submitFeedback(feedback: PPMEFeedback): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store in localStorage for now
    const existingFeedback = JSON.parse(localStorage.getItem('ppme_feedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('ppme_feedback', JSON.stringify(existingFeedback));

    console.log('PPME Feedback submitted:', feedback);
  }

  /**
   * Get clarification options for ambiguous priorities
   */
  async getClarification(priority: string): Promise<PPMECandidate[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const normalizedPriority = this.normalizeText(priority);
    const matches = this.findMatches(normalizedPriority);
    
    return matches.slice(0, 3); // Return top 3 candidates
  }

  /**
   * Get all available terms (for debugging/admin)
   */
  getAllTerms(): Record<string, any> {
    return issueTerminology;
  }
}

// Export singleton instance
export const ppmeApiService = new PPMEMockApiService();
