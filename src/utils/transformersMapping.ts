// This file provides utility functions for mapping user priorities to policy terms
// using a simplified rule-based approach

import issueTerminology from '@/config/issueTerminology.json';
import { detectPriorityConflicts, ConflictResult } from './priorityConflicts';

// Keep track of model initialization status
let isModelInitialized = false;

export const initializeModel = async () => {
  if (isModelInitialized) return true;
  
  try {
    console.info('Initializing rule-based classifier...');
    isModelInitialized = true;
    return true;
  } catch (e) {
    console.error('Failed to initialize classifier:', e);
    return false;
  }
};

export interface MappingResult {
  mappedTerms: string[];
  conflicts: ConflictResult[];
  summary: string;
}

// Map user priorities to formal policy terms using rule-based approach
export const mapUserPriorities = async (userPriorities: string[]): Promise<MappingResult> => {
  const mappedPriorities: { priority: string; mappedTerm: string }[] = [];
  
  // Map each priority
  for (const priority of userPriorities) {
    const mappedTerms = await mapUserPriority(priority);
    if (mappedTerms.length > 0) {
      mappedPriorities.push({
        priority,
        mappedTerm: mappedTerms[0] // Use the best match
      });
    }
  }

  // Detect conflicts between priorities
  const conflicts = detectPriorityConflicts(mappedPriorities);

  // Generate summary
  const uniqueTerms = [...new Set(mappedPriorities.map(mp => mp.mappedTerm))];
  const summary = uniqueTerms.length > 0
    ? `Your priorities focus on ${uniqueTerms.slice(0, 3).join(', ')}${
        conflicts.length > 0 ? '. Note: Some priorities may conflict.' : ''
      }`
    : 'Please provide more specific priorities for better analysis.';

  return {
    mappedTerms: mappedPriorities.map(mp => mp.mappedTerm),
    conflicts,
    summary
  };
};

// Map a single user priority to formal policy terms
export const mapUserPriority = async (userPriority: string): Promise<string[]> => {
  if (!userPriority || userPriority.trim() === '') {
    return [];
  }
  
  // Normalize the user input
  const normalizedInput = userPriority.toLowerCase();
  
  // Check exact matches in issueTerminology
  const matches = [];
  
  // First, look for direct matches in plainLanguage arrays
  for (const [termKey, termData] of Object.entries(issueTerminology)) {
    // Skip 'fallback' and 'issues' entries
    if (termKey === 'fallback' || termKey === 'issues') continue;
    
    const termInfo = termData as any;
    
    // Check for direct matches in plainLanguage array
    if (termInfo.plainLanguage && Array.isArray(termInfo.plainLanguage)) {
      for (const phrase of termInfo.plainLanguage) {
        if (normalizedInput.includes(phrase.toLowerCase())) {
          matches.push(termInfo.standardTerm);
          break;
        }
      }
    }
    
    // Check inclusion words if no direct match found
    if (matches.length === 0 && termInfo.inclusionWords && Array.isArray(termInfo.inclusionWords)) {
      const matchCount = termInfo.inclusionWords.filter((word: string) => 
        normalizedInput.includes(word.toLowerCase())
      ).length;
      
      if (matchCount > 0) {
        matches.push(termInfo.standardTerm);
      }
    }
  }
  
  // If no matches found, try the fallback
  if (matches.length === 0 && issueTerminology.fallback) {
    matches.push(issueTerminology.fallback.standardTerm);
  }
  
  return matches;
};

// Add the classifyPoliticalStatement function with rule-based approach
export const classifyPoliticalStatement = async (statement: string): Promise<{ terms: string[], confidenceScores: { [term: string]: number } }> => {
  if (!statement || statement.trim() === '') {
    return { terms: [], confidenceScores: {} };
  }
  
  // Initialize the model to maintain API compatibility
  await initializeModel();
  
  try {
    // Map the statement to policy terms
    const mappedTerms = await mapUserPriority(statement);
    
    // Create confidence scores
    const confidenceScores = {};
    mappedTerms.forEach((term, index) => {
      // Assign decreasing confidence scores based on position
      confidenceScores[term] = 0.9 - (index * 0.1);
    });
    
    return {
      terms: mappedTerms,
      confidenceScores
    };
  } catch (error) {
    console.error('Error classifying statement:', error);
    // Provide basic default response on error
    return {
      terms: ['Policy Reform', 'Government Accountability'],
      confidenceScores: {
        'Policy Reform': 0.6,
        'Government Accountability': 0.6
      }
    };
  }
};
