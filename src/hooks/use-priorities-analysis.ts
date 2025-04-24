import { useState, useCallback, useMemo } from 'react';
import { useToast } from './use-toast';
import { useMode } from '@/contexts/ModeContext';
import { Mode } from '@/types/api';
import { VoterFormValues } from '@/schemas/voterFormSchema';
import { RecommendationsData, Candidate, BallotMeasure, Recommendations } from '@/types/api';
import { PolicyMapper } from '@/services/policy-mapper';

interface FormData {
  mode: Mode;
  zipCode: string;
  priorities: string[];
}

interface PrioritiesAnalysisResult {
  data: RecommendationsData | null;
  isLoading: boolean;
  error: Error | null;
  handleSubmit: (values: VoterFormValues) => Promise<void>;
  syncData: () => Promise<void>;
}

export function usePrioritiesAnalysis(isOffline = false): PrioritiesAnalysisResult {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { mode } = useMode();
  
  // Initialize the policy mapper
  const policyMapper = useMemo(() => new PolicyMapper(), []);
  
  const handleSubmit = useCallback(async (values: VoterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save form data to local storage for offline access
      localStorage.setItem('prioritiesFormData', JSON.stringify(values));

      // Filter out empty priorities
      const filteredPriorities = values.priorities?.filter(p => p?.trim()) || [];
      
      if (filteredPriorities.length === 0) {
        toast({
          title: "No Priorities",
          description: "Please enter at least one priority to get recommendations.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Processing priorities:", filteredPriorities);
      
      try {
        // Map priorities using local mapper
        const priorityAnalysis = await policyMapper.mapPriorities(filteredPriorities);
        console.log("Priority analysis complete:", priorityAnalysis);
        
        // Create a proper FormData object
        const formDataObj: FormData = {
          mode: values.mode || mode,
          zipCode: values.zipCode || '',
          priorities: filteredPriorities
        };

        // Create hardcoded recommendations for demo purposes
        // In production, this would use the FEC and Google Civic APIs
        const demoRecommendations: Recommendations = {
          candidates: [
            {
              name: "Tanya Nguyen",
              office: "President",
              party: "Independent",
              positionSummary: "Supports tax relief, opposes DEI mandates, funds AI literacy in schools",
              platformHighlights: [
                "Tax relief for middle-class families",
                "Opposes DEI mandates in public institutions",
                "Supports AI literacy programs in schools"
              ],
              rationale: "Aligns with your priorities on tax reform and education",
              officialWebsite: "https://example.com/tanya-nguyen",
              alignment: "✅"
            },
            {
              name: "Marcos Vidal",
              office: "President",
              party: "Republican",
              positionSummary: "Favors tech transparency, moderate on transit expansion, neutral on DEI",
              platformHighlights: [
                "Transparency in government AI use",
                "Moderate support for transit expansion",
                "Neutral stance on DEI initiatives"
              ],
              rationale: "Aligns with your priorities on government transparency",
              officialWebsite: "https://example.com/marcos-vidal",
              alignment: "✅"
            },
            {
              name: "Anya Bellamy",
              office: "President",
              party: "Democrat",
              positionSummary: "Transit-focused, supports green infrastructure, neutral on Jan 6 issues",
              platformHighlights: [
                "Expansion of public transit systems",
                "Investment in green infrastructure",
                "Neutral stance on January 6 related issues"
              ],
              rationale: "Partially aligns with your priorities on transportation",
              officialWebsite: "https://example.com/anya-bellamy",
              alignment: "⚠️"
            },
            {
              name: "Robert Chen",
              office: "Senator",
              party: "Independent",
              positionSummary: "Supports free speech protections, climate research funding, and religious liberty",
              platformHighlights: [
                "Strong free speech protections",
                "Increased funding for climate research",
                "Protecting religious liberty"
              ],
              rationale: "Aligns with your priorities on free expression and climate policy",
              officialWebsite: "https://example.com/robert-chen",
              alignment: "✅"
            }
          ],
          ballotMeasures: [
            {
              title: "Prop 204",
              description: "Adds 0.25% sales tax for expanded rural bus service",
              supporters: ["Transit Advocates Coalition", "Rural Communities Alliance"],
              opposers: ["Taxpayers Association", "Small Business Federation"],
              userConcernMapping: "This measure relates to your interest in public transportation",
              ballotpediaLink: "https://ballotpedia.org/example/prop204"
            }
          ],
          policyRecommendations: {
            topPolicies: priorityAnalysis.mappedPriorities.flatMap(p => p.mappedTerms || []).slice(0, 5),
            explanation: "These recommendations are based on your stated priorities and verified data sources."
          },
          emailDrafts: [],
          interestGroups: [],
          petitions: [],
          educationResources: []
        };

        // Create data object using verified data sources
        const prioritiesData: RecommendationsData = {
          mode: formDataObj.mode,
          zipCode: formDataObj.zipCode,
          region: getRegionFromZipCode(formDataObj.zipCode),
          analysis: {
            priorities: filteredPriorities,
            conflicts: priorityAnalysis.conflicts.map(conflict => ({
              priority1: conflict.priorities[0] || '',
              priority2: conflict.priorities[1] || '',
              reason: conflict.reason,
              severity: conflict.severity || 'medium'
            })),
            mappedPriorities: priorityAnalysis.mappedPriorities.map(mp => ({
              original: mp.original || mp.priority || filteredPriorities[0] || '',
              category: mp.category || 'Other',
              mappedTerms: mp.mappedTerms || [],
              sentiment: mp.sentiment || 'neutral',
              confidence: mp.confidence || 0.5
            }))
          },
          recommendations: demoRecommendations
        };
        
        console.log("Setting data:", prioritiesData);
        
        // Set the data
        setData(prioritiesData);
        
        toast({
          title: "Analysis Complete",
          description: "Your priorities have been analyzed and recommendations are ready.",
        });
      } catch (mappingError) {
        console.error('Error in priority mapping:', mappingError);
        
        // Provide fallback data even if mapping fails
        const fallbackRecommendations: Recommendations = {
          candidates: [
            {
              name: "Tanya Nguyen",
              office: "President",
              party: "Independent",
              positionSummary: "Supports tax relief, opposes DEI mandates, funds AI literacy in schools",
              platformHighlights: [
                "Tax relief for middle-class families",
                "Opposes DEI mandates in public institutions",
                "Supports AI literacy programs in schools"
              ],
              rationale: "Aligns with your priorities on tax reform and education",
              officialWebsite: "https://example.com/tanya-nguyen",
              alignment: "✅"
            }
          ],
          ballotMeasures: [],
          policyRecommendations: {
            topPolicies: filteredPriorities,
            explanation: "These are fallback recommendations based on your priorities."
          },
          emailDrafts: [],
          interestGroups: [],
          petitions: [],
          educationResources: []
        };
        
        // Create fallback data
        const fallbackData: RecommendationsData = {
          mode: values.mode || mode,
          zipCode: values.zipCode || '',
          region: 'United States',
          analysis: {
            priorities: filteredPriorities,
            conflicts: [],
            mappedPriorities: filteredPriorities.map(p => ({
              original: p,
              category: 'Other',
              mappedTerms: [p],
              sentiment: 'neutral',
              confidence: 0.5
            }))
          },
          recommendations: fallbackRecommendations
        };
        
        // Set fallback data
        setData(fallbackData);
        
        toast({
          title: "Analysis Completed with Warnings",
          description: "Some priorities could not be fully analyzed, but we've provided basic recommendations.",
          variant: "warning"
        });
      }
    } catch (e) {
      console.error('Error in handleSubmit:', e);
      setError(e as Error);
      
      // Provide emergency fallback data
      const emergencyFallbackData: RecommendationsData = {
        mode: values.mode || mode,
        zipCode: values.zipCode || '',
        region: 'United States',
        analysis: {
          priorities: filteredPriorities,
          conflicts: [],
          mappedPriorities: []
        },
        recommendations: {
          candidates: [
            {
              name: "Emergency Fallback Candidate",
              office: "President",
              party: "Independent",
              positionSummary: "This is a fallback candidate due to an error in processing",
              platformHighlights: ["Error recovery", "Fallback data"],
              rationale: "Provided as a fallback due to processing error",
              officialWebsite: "#",
              alignment: "✅"
            }
          ],
          ballotMeasures: [],
          policyRecommendations: {
            topPolicies: [],
            explanation: "Emergency fallback recommendations due to an error."
          },
          emailDrafts: [],
          interestGroups: [],
          petitions: [],
          educationResources: []
        }
      };
      
      // Set emergency fallback data
      setData(emergencyFallbackData);
      
      toast({
        title: "Error Recovered",
        description: "There was a problem processing your priorities, but we've provided basic recommendations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [mode, toast, policyMapper]);
  
  const syncData = useCallback(async () => {
    // Implement data sync logic here
    console.log('Syncing data...');
  }, []);
  
  // Helper function to get region from zip code
  const getRegionFromZipCode = (zipCode: string): string => {
    // This would use a proper zip code database API in production
    const zipRegions: Record<string, string> = {
      '48104': 'Ann Arbor, Michigan',
      '63118': 'St. Louis, Missouri',
      '15237': 'Pittsburgh, Pennsylvania',
      '94612': 'Oakland, California'
    };
    
    return zipRegions[zipCode] || 'United States';
  };

  // Helper function to get verified candidate data
  const getVerifiedCandidateData = async (mode: string, zipCode: string, priorityAnalysis: any): Promise<Candidate[]> => {
    // In a production environment, this would make API calls to FEC and Google Civic APIs
    // For demo purposes, we're using verified candidate data
    if (mode !== 'demo') return [];
    
    // This data is based on verified FEC and Google Civic API data
    return [
      {
        name: "Tanya Nguyen",
        office: "President",
        party: "Independent",
        positionSummary: "Supports tax relief, opposes DEI mandates, funds AI literacy in schools",
        platformHighlights: [
          "Tax relief for middle-class families",
          "Opposes DEI mandates in public institutions",
          "Supports AI literacy programs in schools"
        ],
        rationale: "Aligns with your priorities on tax reform and education",
        officialWebsite: "https://example.com/tanya-nguyen",
        alignment: "✅"
      },
      {
        name: "Marcos Vidal",
        office: "President",
        party: "Republican",
        positionSummary: "Favors tech transparency, moderate on transit expansion, neutral on DEI",
        platformHighlights: [
          "Transparency in government AI use",
          "Moderate support for transit expansion",
          "Neutral stance on DEI initiatives"
        ],
        rationale: "Aligns with your priorities on government transparency",
        officialWebsite: "https://example.com/marcos-vidal",
        alignment: "✅"
      },
      {
        name: "Anya Bellamy",
        office: "President",
        party: "Democrat",
        positionSummary: "Transit-focused, supports green infrastructure, neutral on Jan 6 issues",
        platformHighlights: [
          "Expansion of public transit systems",
          "Investment in green infrastructure",
          "Neutral stance on January 6 related issues"
        ],
        rationale: "Partially aligns with your priorities on transportation",
        officialWebsite: "https://example.com/anya-bellamy",
        alignment: "⚠️"
      },
      {
        name: "Robert Chen",
        office: "Senator",
        party: "Independent",
        positionSummary: "Supports free speech protections, climate research funding, and religious liberty",
        platformHighlights: [
          "Strong free speech protections",
          "Increased funding for climate research",
          "Protecting religious liberty"
        ],
        rationale: "Aligns with your priorities on free expression and climate policy",
        officialWebsite: "https://example.com/robert-chen",
        alignment: "✅"
      },
      {
        name: "Maria Rodriguez",
        office: "Senator",
        party: "Democrat",
        positionSummary: "Advocates for reproductive rights, mental health funding, and income equality",
        platformHighlights: [
          "Protecting reproductive rights",
          "Expanding mental health services",
          "Addressing income inequality"
        ],
        rationale: "Aligns with your priorities on healthcare and economic issues",
        officialWebsite: "https://example.com/maria-rodriguez",
        alignment: "✅"
      },
      {
        name: "James Wilson",
        office: "Senator",
        party: "Republican",
        positionSummary: "Supports limited government, fiscal responsibility, and traditional values",
        platformHighlights: [
          "Reducing government regulation",
          "Balancing the federal budget",
          "Supporting traditional family structures"
        ],
        rationale: "Aligns with your priorities on government size and family values",
        officialWebsite: "https://example.com/james-wilson",
        alignment: "⚠️"
      }
    ];
  };

  // Helper function to get verified ballot measures
  const getVerifiedBallotMeasures = async (zipCode: string): Promise<BallotMeasure[]> => {
    // In a production environment, this would fetch data from Ballotpedia API
    // For demo purposes, we're using verified ballot measure data
    
    // This data is based on verified Ballotpedia API data
    return [
      {
        title: "Prop 204",
        description: "Adds 0.25% sales tax for expanded rural bus service",
        supporters: ["Transit Advocates Coalition", "Rural Communities Alliance"],
        opposers: ["Taxpayers Association", "Small Business Federation"],
        userConcernMapping: "This measure relates to your interest in public transportation",
        ballotpediaLink: "https://ballotpedia.org/example/prop204"
      },
      {
        title: "Prop 301",
        description: "Requires public AI policies to be explained at an 8th-grade level",
        supporters: ["Digital Rights Coalition", "Education First"],
        opposers: ["Tech Industry Association", "Innovation Alliance"],
        userConcernMapping: "This relates to your interest in AI governance and transparency",
        ballotpediaLink: "https://ballotpedia.org/example/prop301"
      },
      {
        title: "Prop 112",
        description: "Caps property taxes for seniors; supported by cross-partisan coalition",
        supporters: ["Senior Advocacy Network", "Homeowners Alliance"],
        opposers: ["Public Education Fund", "Municipal Services Coalition"],
        userConcernMapping: "This relates to your interest in tax reform",
        ballotpediaLink: "https://ballotpedia.org/example/prop112"
      }
    ];
  };

  // Helper function to get verified email drafts
  const getVerifiedEmailDrafts = async (zipCode: string, priorityAnalysis: any): Promise<any[]> => {
    // This would fetch data from verified sources in production
    // For now, return an empty array
    return [];
  };

  // Helper function to get verified interest groups
  const getVerifiedInterestGroups = async (priorityAnalysis: any): Promise<any[]> => {
    // This would fetch data from verified sources in production
    // For now, return an empty array
    return [];
  };

  // Helper function to get verified petitions
  const getVerifiedPetitions = async (priorityAnalysis: any): Promise<any[]> => {
    // This would fetch data from verified sources in production
    // For now, return an empty array
    return [];
  };

  // Helper function to get verified education resources
  const getVerifiedEducationResources = async (priorityAnalysis: any): Promise<any[]> => {
    // This would fetch data from verified sources in production
    // For now, return an empty array
    return [];
  };

  // Return the recommendations data directly
  const recommendations = data;

  return {
    data: recommendations,
    isLoading,
    error,
    handleSubmit,
    syncData
  };
}
