import { Recommendations } from '@/types/api'

export const createDemoRecommendations = (filteredPriorities: string[]): Recommendations => ({
  candidates: [
    {
      name: 'Tanya Nguyen',
      office: 'President',
      party: 'Independent',
      positionSummary:
        'Supports tax relief, opposes DEI mandates, funds AI literacy in schools',
      platformHighlights: [
        'Tax relief for middle-class families',
        'Opposes DEI mandates in public institutions',
        'Supports AI literacy programs in schools',
      ],
      rationale:
        'Aligns with your priorities on tax reform and education',
      officialWebsite: 'https://example.com/tanya-nguyen',
      alignment: '✅',
    },
    {
      name: 'Marcos Vidal',
      office: 'President',
      party: 'Republican',
      positionSummary:
        'Favors tech transparency, moderate on transit expansion, neutral on DEI',
      platformHighlights: [
        'Transparency in government AI use',
        'Moderate support for transit expansion',
        'Neutral stance on DEI initiatives',
      ],
      rationale: 'Aligns with your priorities on government transparency',
      officialWebsite: 'https://example.com/marcos-vidal',
      alignment: '✅',
    },
    {
      name: 'Anya Bellamy',
      office: 'President',
      party: 'Democrat',
      positionSummary:
        'Transit-focused, supports green infrastructure, neutral on Jan 6 issues',
      platformHighlights: [
        'Expansion of public transit systems',
        'Investment in green infrastructure',
        'Neutral stance on January 6 related issues',
      ],
      rationale:
        'Partially aligns with your priorities on transportation',
      officialWebsite: 'https://example.com/anya-bellamy',
      alignment: '⚠️',
    },
    {
      name: 'Robert Chen',
      office: 'Senator',
      party: 'Independent',
      positionSummary:
        'Supports free speech protections, climate research funding, and religious liberty',
      platformHighlights: [
        'Strong free speech protections',
        'Increased funding for climate research',
        'Protecting religious liberty',
      ],
      rationale:
        'Aligns with your priorities on free expression and climate policy',
      officialWebsite: 'https://example.com/robert-chen',
      alignment: '✅',
    },
  ],
  ballotMeasures: [
    {
      title: 'Prop 204',
      description: 'Adds 0.25% sales tax for expanded rural bus service',
      supporters: [
        'Transit Advocates Coalition',
        'Rural Communities Alliance',
      ],
      opposers: ['Taxpayers Association', 'Small Business Federation'],
      userConcernMapping:
        'This measure relates to your interest in public transportation',
      ballotpediaLink: 'https://ballotpedia.org/example/prop204',
    },
  ],
  policyRecommendations: {
    topPolicies: filteredPriorities,
    explanation:
      'These recommendations are based on your stated priorities.',
  },
  emailDrafts: [],
  interestGroups: [],
  petitions: [],
  educationResources: [],
})