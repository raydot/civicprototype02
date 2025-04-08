import { initialPolicyMappings } from '@/data/policy-mappings';
import { detectPriorityConflicts } from '@/utils/priorityConflicts';
import { MappedPriority, PolicyData, PriorityAnalysis } from '@/types/policy-mappings';

export class PolicyMapper {
  constructor() {
    // No need for constructor parameters as we import initialPolicyMappings directly
  }

  async mapPriorities(priorities: string[]): Promise<PriorityAnalysis> {
    const mappedPriorities: MappedPriority[] = priorities.map(priority => ({
      original: priority,
      category: this.findCategory(priority),
      mappedTerm: this.findBestMatch(priority),
      sentiment: this.analyzeSentiment(priority),
      confidence: this.calculateConfidence(priority)
    }));

    const conflicts = detectPriorityConflicts(mappedPriorities);

    return {
      mappedPriorities,
      conflicts
    };
  }

  private findBestMatch(priority: string): string {
    const lowerPriority = priority.toLowerCase();
    
    // Find exact matches first
    for (const [key, data] of Object.entries(initialPolicyMappings)) {
      if (data.standardTerm.toLowerCase() === lowerPriority) {
        return data.standardTerm;
      }
    }

    // Then check plain language variations
    for (const [key, data] of Object.entries(initialPolicyMappings)) {
      if (data.plainLanguage?.some(term => 
        lowerPriority.includes(term.toLowerCase())
      )) {
        return data.standardTerm;
      }
    }

    // Finally check for partial matches
    for (const [key, data] of Object.entries(initialPolicyMappings)) {
      if (data.keywords?.some(keyword => 
        lowerPriority.includes(keyword.toLowerCase())
      )) {
        return data.standardTerm;
      }
    }

    return priority; // Return original if no match found
  }

  private findCategory(priority: string): string {
    const lowerPriority = priority.toLowerCase();
    for (const [key, data] of Object.entries(initialPolicyMappings)) {
      if (data.keywords?.some(keyword => lowerPriority.includes(keyword.toLowerCase()))) {
        return data.category;
      }
    }
    return 'other';
  }

  private analyzeSentiment(priority: string): 'positive' | 'negative' | 'neutral' {
    const lowerPriority = priority.toLowerCase();
    const negativeWords = ['against', 'stop', 'ban', 'oppose', 'prevent'];
    const positiveWords = ['support', 'promote', 'increase', 'improve', 'enhance'];

    if (negativeWords.some(word => lowerPriority.includes(word))) {
      return 'negative';
    }
    if (positiveWords.some(word => lowerPriority.includes(word))) {
      return 'positive';
    }
    return 'neutral';
  }

  private calculateConfidence(priority: string): number {
    const matches = Object.values(initialPolicyMappings).filter(data => {
      const terms = [
        data.standardTerm,
        ...(data.plainLanguage || []),
        ...(data.keywords || [])
      ];
      return terms.some(term => 
        priority.toLowerCase().includes(term.toLowerCase())
      );
    });

    return matches.length > 0 ? 0.8 : 0.4; // Simple confidence scoring
  }
}
