import { ConflictResult } from './priorityConflicts';
import issueTerminology from '@/config/issueTerminology.json';

export interface PolicyRecommendation {
  title: string;
  description: string;
  type: 'compromise' | 'alternative' | 'clarification';
  priority: 'high' | 'medium' | 'low';
  relatedPriorities: string[];
  suggestedActions?: string[];
}

interface CompromiseTemplate {
  pattern: string[];
  generateRecommendation: (priorities: string[], categories: string[]) => PolicyRecommendation;
}

const compromiseTemplates: CompromiseTemplate[] = [
  // Environmental vs Economic
  {
    pattern: ['environmental', 'economic'],
    generateRecommendation: (priorities, categories) => ({
      title: 'Green Economy Compromise',
      description: 'Consider focusing on sustainable economic growth that creates jobs while protecting the environment.',
      type: 'compromise',
      priority: 'high',
      relatedPriorities: priorities,
      suggestedActions: [
        'Support green energy job training programs',
        'Invest in renewable energy infrastructure',
        'Promote sustainable business practices'
      ]
    })
  },
  // Healthcare Policy
  {
    pattern: ['healthcare', 'economic'],
    generateRecommendation: (priorities) => ({
      title: 'Healthcare System Reform',
      description: 'Consider a hybrid healthcare approach that maintains private options while expanding public coverage.',
      type: 'compromise',
      priority: 'high',
      relatedPriorities: priorities,
      suggestedActions: [
        'Support public-private healthcare partnerships',
        'Expand coverage while preserving choice',
        'Focus on cost reduction initiatives'
      ]
    })
  },
  // Immigration Policy
  {
    pattern: ['immigration', 'security'],
    generateRecommendation: (priorities) => ({
      title: 'Balanced Immigration Reform',
      description: 'Consider comprehensive immigration reform that addresses both security and humanitarian concerns.',
      type: 'compromise',
      priority: 'high',
      relatedPriorities: priorities,
      suggestedActions: [
        'Support merit-based immigration with family provisions',
        'Implement smart border technology',
        'Create efficient legal immigration pathways'
      ]
    })
  }
];

function findRelevantTerms(priority: string): string[] {
  const terminology = issueTerminology as Record<string, any>;
  const terms: string[] = [];

  for (const [key, data] of Object.entries(terminology)) {
    if (key === 'fallback' || key === 'issues') continue;

    // Check standard term
    if (data.standardTerm && priority.toLowerCase().includes(data.standardTerm.toLowerCase())) {
      terms.push(key);
    }

    // Check plain language variations
    if (data.plainLanguage) {
      for (const phrase of data.plainLanguage) {
        if (priority.toLowerCase().includes(phrase.toLowerCase())) {
          terms.push(key);
          break;
        }
      }
    }
  }

  return terms;
}

function generateAlternativeRecommendations(
  priority: string,
  conflictingPriority: string
): PolicyRecommendation[] {
  const recommendations: PolicyRecommendation[] = [];
  const terms = findRelevantTerms(priority);
  const conflictingTerms = findRelevantTerms(conflictingPriority);
  const terminology = issueTerminology as Record<string, any>;

  // Look for alternative approaches in related policy areas
  for (const term of terms) {
    const termData = terminology[term];
    if (termData.alternatives) {
      recommendations.push({
        title: `Alternative Approach: ${termData.standardTerm}`,
        description: `Consider an alternative approach to achieve your goals regarding ${termData.standardTerm}.`,
        type: 'alternative',
        priority: 'medium',
        relatedPriorities: [priority],
        suggestedActions: termData.alternatives
      });
    }
  }

  // Generate clarification recommendations for complex policies
  if (terms.length > 1 || conflictingTerms.length > 1) {
    recommendations.push({
      title: 'Policy Clarification Needed',
      description: 'Your priorities touch on multiple policy areas. Consider clarifying your specific goals.',
      type: 'clarification',
      priority: 'medium',
      relatedPriorities: [priority, conflictingPriority]
    });
  }

  return recommendations;
}

export function generateRecommendations(conflicts: ConflictResult[]): PolicyRecommendation[] {
  const recommendations: PolicyRecommendation[] = [];

  for (const conflict of conflicts) {
    // Find matching compromise template
    const matchingTemplate = compromiseTemplates.find(template =>
      template.pattern.every(category =>
        conflict.categories?.some(c => c.toLowerCase().includes(category.toLowerCase()))
      )
    );

    if (matchingTemplate) {
      recommendations.push(
        matchingTemplate.generateRecommendation(
          [conflict.priority1, conflict.priority2],
          conflict.categories || []
        )
      );
    }

    // Generate alternative recommendations
    recommendations.push(
      ...generateAlternativeRecommendations(conflict.priority1, conflict.priority2)
    );
  }

  // Remove duplicate recommendations
  return recommendations.filter((rec, index, self) =>
    index === self.findIndex(r => r.title === rec.title)
  );
}
