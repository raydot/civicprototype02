import { useState, useCallback } from 'react';
import { PolicyMapper } from '@/utils/policyMapper';

interface PolicyMappingResult {
  originalInput: string;
  mappedTerms: {
    standardTerm: string;
    confidence: number;
    nuances: Record<string, number>;
    contextualFactors: string[];
    potentialConflicts: string[];
  }[];
  hasAmbiguity: boolean;
  hasConflict: boolean;
}

export function usePolicyMapping() {
  const [mappingResults, setMappingResults] = useState<PolicyMappingResult[]>([]);
  const mapper = new PolicyMapper();

  const mapPriorities = useCallback((
    priorities: string[], 
    context?: string[]
  ) => {
    const results = priorities.map(priority => {
      const mappedTerms = mapper.mapUserInput(priority, context);
      
      // Determine if there are ambiguities or conflicts
      const hasAmbiguity = mappedTerms.some(term => 
        term.confidence < 0.8 || // Low confidence mapping
        term.contextualFactors.length > 1 // Multiple possible contexts
      );
      
      const hasConflict = mappedTerms.some(term => 
        term.potentialConflicts.length > 0 || // Explicit conflicts
        mappedTerms.length > 1 // Multiple possible interpretations
      );

      return {
        originalInput: priority,
        mappedTerms,
        hasAmbiguity,
        hasConflict
      };
    });

    setMappingResults(results);
    return results;
  }, []);

  const getMappingSuggestions = useCallback((
    priority: string,
    context?: string[]
  ) => {
    const mappedTerms = mapper.mapUserInput(priority, context);
    
    // Filter to high-confidence mappings
    return mappedTerms
      .filter(term => term.confidence > 0.7)
      .map(term => ({
        term: term.standardTerm,
        confidence: term.confidence,
        nuances: Object.entries(term.nuances)
          .filter(([_, value]) => value > 0.7)
          .map(([key]) => key)
      }));
  }, []);

  return {
    mappingResults,
    mapPriorities,
    getMappingSuggestions
  };
}
