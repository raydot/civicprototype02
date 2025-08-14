/**
 * Mock data for development mode to avoid API costs
 */

import { PPMEMappedPriority } from '@/types/ppme'

export const mockPPMEResponse = {
  mappedPriorities: [
    {
      original: 'Lower taxes',
      category: 'Economic Policy',
      mappedTerms: ['tax reduction', 'fiscal policy', 'government spending'],
      sentiment: 'positive' as const,
      confidence: 0.85,
      needsClarification: false,
    },
    {
      original: 'Better schools',
      category: 'Education',
      mappedTerms: ['education funding', 'school quality', 'teacher resources'],
      sentiment: 'positive' as const,
      confidence: 0.92,
      needsClarification: false,
    },
  ] as PPMEMappedPriority[],
  overallConfidence: 0.88,
  needsClarification: [],
  processingTime: 150,
}

export const mockCivicResponse = {
  candidates: [
    {
      name: 'Mock Candidate A',
      office: 'Mayor',
      party: 'Independent',
      alignment: '✅' as const,
      platformHighlights: ['Tax reform', 'Education funding'],
      rationale: 'Aligns with your priorities on fiscal and education policy',
      officialWebsite: 'https://example.com/candidate-a',
    },
  ],
  ballotMeasures: [
    {
      title: 'Prop 123',
      description: 'Education funding measure',
      supporters: ['Teachers Union'],
      opposers: ['Taxpayers Association'],
      userConcernMapping: 'Related to your education priorities',
      ballotpediaLink: 'https://ballotpedia.org/example',
    },
  ],
}

export function getMockPPMEResponse(
  priorities: string[]
): typeof mockPPMEResponse {
  return {
    ...mockPPMEResponse,
    mappedPriorities: priorities.map((priority, index) => ({
      original: priority,
      category: index % 2 === 0 ? 'Economic Policy' : 'Social Policy',
      mappedTerms: [priority.toLowerCase(), 'policy term', 'related issue'],
      sentiment: 'positive' as const,
      confidence: 0.7 + Math.random() * 0.3,
      needsClarification: Math.random() > 0.8,
    })),
  }
}
