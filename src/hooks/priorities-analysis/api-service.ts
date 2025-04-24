import { supabase } from '@/integrations/supabase/client';
import { VoterFormValues } from '@/schemas/voterFormSchema';
import { RecommendationsData, AnalysisResult } from '@/types/api';
import { PolicyMapper } from '@/services/policy-mapper';
import { ConflictResult as PolicyConflictResult, PriorityAnalysis } from '@/types/policy-mappings';
import { ConflictResult as ApiConflictResult } from '@/types/api';
import { FormData } from '../use-priorities-analysis';

export function createApiService(toast: any) {
  const policyMapper = new PolicyMapper();

  const getRecommendations = async (
    formData: FormData,
    priorityAnalysis?: PriorityAnalysis
  ): Promise<AnalysisResult> => {
    try {
      console.log('Getting recommendations for:', formData);
      
      // Use provided priority analysis or generate one
      const analysis = priorityAnalysis || await policyMapper.mapPriorities(formData.priorities);
      
      // Convert conflict format from policy-mappings to api format
      const convertedConflicts: ApiConflictResult[] = analysis.conflicts.map(
        (conflict: PolicyConflictResult) => ({
          priority1: conflict.priorities[0] || '',
          priority2: conflict.priorities[1] || '',
          reason: conflict.reason,
          severity: conflict.severity
        })
      );
      
      try {
        // Try to call the Supabase function if available
        console.log('Attempting to call Supabase function...');
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch('http://localhost:54321/functions/v1/analyze-priorities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            zipCode: formData.zipCode,
            priorities: formData.priorities.filter(Boolean),
            mode: formData.mode || "demo"
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Supabase function response:', data);
          
          // Ensure the data has the correct format
          if (data && typeof data === 'object') {
            // Create the analysis result with our priority analysis
            const result: AnalysisResult = {
              recommendations: data.recommendations || null,
              analysis: {
                mappedPriorities: analysis.mappedPriorities,
                conflicts: analysis.conflicts
              },
              zipCode: formData.zipCode,
              region: data.region || 'Unknown',
              error: null
            };
            
            return result;
          }
        }
        
        // If we reach here, the API call failed in some way
        throw new Error('Invalid response from API');
      } catch (apiError) {
        console.error('API call failed, using local analysis:', apiError);
        // Fall back to local analysis
        
        // Create a mock recommendations response using local analysis
        const recommendationsData: AnalysisResult = {
          recommendations: {
            candidates: getMockCandidates(formData.mode),
            ballotMeasures: getMockBallotMeasures(),
            policyRecommendations: generateMockPolicyRecommendations(formData.priorities),
            interestGroups: getMockInterestGroups(analysis.mappedPriorities),
            petitions: getMockPetitions(analysis.mappedPriorities),
            educationResources: getMockEducationResources(analysis.mappedPriorities)
          },
          analysis: analysis,
          zipCode: formData.zipCode,
          region: 'California', // Default region
          error: null
        };

        return recommendationsData;
      }
    } catch (err: any) {
      console.error('Error in getRecommendations:', err);
      toast({
        title: 'Error',
        description: err.message || 'An error occurred while getting recommendations',
        variant: "destructive",
      });
      
      // Return error result
      return {
        recommendations: null,
        analysis: priorityAnalysis || null,
        zipCode: formData.zipCode || '',
        region: 'Error',
        error: err
      };
    }
  };

  // Helper function to generate mock policy recommendations
  const generateMockPolicyRecommendations = (priorities: string[]) => {
    // Generate mock policy recommendations based on priorities
    return {
      topPolicies: [
        "Tax Reform",
        "Healthcare Access",
        "Education Funding",
        "Climate Policy"
      ],
      explanation: "These recommendations are based on your stated priorities and current policy landscape."
    };
  };
  
  // Helper function to get mock candidates
  const getMockCandidates = (mode: string) => {
    if (mode !== 'demo') return [];
    
    return [
      {
        name: "Tanya Nguyen",
        office: "Governor",
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
        office: "Governor",
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
        office: "Governor",
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
      }
    ];
  };
  
  // Helper function to get mock ballot measures
  const getMockBallotMeasures = () => {
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
  
  // Helper function to get mock interest groups
  const getMockInterestGroups = (mappedPriorities: any[]) => {
    return [
      {
        name: "Americans for Tax Reform",
        description: "Advocacy group focused on tax policy reform",
        website: "https://atr.org"
      },
      {
        name: "Smart Growth America",
        description: "Organization promoting sustainable community development and transit",
        website: "https://smartgrowthamerica.org"
      },
      {
        name: "Electronic Frontier Foundation (EFF)",
        description: "Digital rights group focused on technology policy and AI governance",
        website: "https://eff.org"
      }
    ];
  };
  
  // Helper function to get mock petitions
  const getMockPetitions = (mappedPriorities: any[]) => {
    return [
      {
        title: "Hold Jan 6 Rioters Accountable",
        description: "Petition to ensure full investigation and prosecution of January 6 participants",
        changeOrgUrl: "https://change.org/example1"
      },
      {
        title: "Stop the Transit Cuts in Western PA",
        description: "Petition against proposed public transportation funding cuts",
        changeOrgUrl: "https://change.org/example2"
      },
      {
        title: "Demand Plain Language in AI Policy",
        description: "Petition for transparent, understandable AI policies in government",
        changeOrgUrl: "https://change.org/example3"
      }
    ];
  };
  
  // Helper function to get mock education resources
  const getMockEducationResources = (mappedPriorities: any[]) => {
    return [
      {
        topic: "How Income Tax Reform Works",
        description: "An explainer on tax reform proposals and their impacts",
        source: "Brookings",
        url: "https://example.com/tax-reform",
        type: "article"
      },
      {
        topic: "The Debate Around Race-Based Hiring",
        description: "A balanced examination of DEI policies in employment",
        source: "NPR",
        url: "https://example.com/dei-hiring",
        type: "explainer"
      },
      {
        topic: "Understanding Both Sides of Climate Data",
        description: "Analysis of climate change data interpretations",
        source: "Science Daily",
        url: "https://example.com/climate-data",
        type: "video"
      },
      {
        topic: "What's Being Done About AI Risks?",
        description: "Overview of current AI governance approaches",
        source: "MIT Technology Review",
        url: "https://example.com/ai-risks",
        type: "explainer"
      }
    ];
  };

  return {
    getRecommendations
  };
}
