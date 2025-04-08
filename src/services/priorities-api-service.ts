import { VoterFormValues } from '@/schemas/voterFormSchema';
import { RecommendationsData, Candidate, EmailDraft, InterestGroup, Petition, CivicEducationResource } from '@/types/api';
import { Toast } from '@/types/toast';
import { PolicyMapper } from '@/services/policy-mapper';
import { FecApiService } from '@/services/fec-api-service';
import { GoogleCivicApiService } from '@/services/google-civic-api-service';

const MOCK_EMAIL_DRAFTS: EmailDraft[] = [
  {
    recipient: {
      name: "Senator Alex Johnson",
      position: "U.S. Senator",
      email: "alex.johnson@senate.gov"
    },
    subject: "Concerned Constituent: Environmental Protection and Clean Energy",
    body: "Dear Senator Johnson,\n\nAs your constituent, I am writing to express my strong support for environmental protection and clean energy initiatives. Climate change is one of my top priorities, and I believe we need immediate action to address this critical issue.\n\nI urge you to support legislation that promotes renewable energy, reduces carbon emissions, and protects our natural resources. Our community's future depends on making sustainable choices today.\n\nThank you for your attention to this matter.\n\nSincerely,\n[Your Name]",
    stance: "supportive"
  },
  {
    recipient: {
      name: "Representative Maria Garcia",
      position: "U.S. Representative",
      email: "maria.garcia@house.gov"
    },
    subject: "Request for Support: Education Funding",
    body: "Dear Representative Garcia,\n\nI am writing as a concerned constituent regarding education funding in our district. Quality education is crucial for our community's future, and I believe we need to increase investment in our schools.\n\nPlease support initiatives that increase education funding, improve teacher pay, and provide resources for STEM programs. Our children's future depends on the decisions we make today.\n\nThank you for your consideration.\n\nSincerely,\n[Your Name]",
    stance: "supportive"
  }
];

const MOCK_INTEREST_GROUPS: InterestGroup[] = [
  {
    name: "Environmental Defense Fund",
    description: "Leading organization working on environmental issues, climate change, and clean energy solutions.",
    mission: "To preserve the natural systems on which all life depends.",
    website: "https://www.edf.org",
    getInvolvedLink: "https://www.edf.org/take-action"
  },
  {
    name: "American Civil Liberties Union (ACLU)",
    description: "Nonprofit organization defending and preserving individual rights and liberties.",
    mission: "To defend and preserve the individual rights and liberties guaranteed to every person in this country by the Constitution and laws of the United States.",
    website: "https://www.aclu.org",
    getInvolvedLink: "https://www.aclu.org/take-action"
  }
];

const MOCK_PETITIONS: Petition[] = [
  {
    title: "Support Clean Energy Infrastructure",
    description: "Petition calling for increased investment in renewable energy infrastructure and clean energy jobs.",
    changeOrgUrl: "https://www.change.org/clean-energy",
    relevance: "Aligned with environmental protection and economic development priorities"
  },
  {
    title: "Fund Our Schools",
    description: "Petition advocating for increased education funding and teacher support.",
    changeOrgUrl: "https://www.change.org/education-funding",
    relevance: "Supports education and community development priorities"
  }
];

const MOCK_CIVIC_EDUCATION: CivicEducationResource[] = [
  {
    topic: "Climate Change Policy",
    description: "Learn about current climate policies, their impact, and how to effectively advocate for environmental protection.",
    source: "National Constitution Center",
    url: "https://constitutioncenter.org/climate-policy",
    type: "article"
  },
  {
    topic: "Education Policy",
    description: "Understanding education funding, policy-making, and how to engage with local school boards.",
    source: "iCivics",
    url: "https://www.icivics.org/education-policy",
    type: "interactive"
  }
];

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export class PrioritiesApiService {
  private policyMapper: PolicyMapper;
  private fecApi: FecApiService;
  private civicApi: GoogleCivicApiService;
  private toast: (props: Toast) => void;

  constructor(toast: (props: Toast) => void) {
    this.policyMapper = new PolicyMapper();
    this.fecApi = new FecApiService(toast);
    this.civicApi = new GoogleCivicApiService(toast);
    this.toast = toast;
  }

  private generateEmailDrafts(mappedPriorities: string[]): EmailDraft[] {
    // In a real implementation, we would generate personalized email drafts
    // based on the user's mapped priorities and their representatives
    return MOCK_EMAIL_DRAFTS;
  }

  private getRelevantInterestGroups(mappedPriorities: string[]): InterestGroup[] {
    // In a real implementation, we would filter interest groups based on priorities
    return MOCK_INTEREST_GROUPS;
  }

  private getRelevantPetitions(mappedPriorities: string[]): Petition[] {
    // In a real implementation, we would filter petitions based on priorities
    return MOCK_PETITIONS;
  }

  private getCivicEducationResources(mappedPriorities: string[]): CivicEducationResource[] {
    // In a real implementation, we would filter resources based on priorities
    return MOCK_CIVIC_EDUCATION;
  }

  async mapPriorities(
    formData: VoterFormValues,
    feedbackPriorities: string[] = []
  ): Promise<ApiResponse<RecommendationsData>> {
    try {
      // Validate inputs
      if (!formData.zipCode) {
        throw new Error('Zip code is required');
      }

      if (!formData.priorities || formData.priorities.length === 0) {
        throw new Error('At least one priority is required');
      }

      const priorities = [...formData.priorities, ...feedbackPriorities].filter(Boolean);
      
      // Analyze priorities using our policy mapper
      const analysis = await this.policyMapper.mapPriorities(priorities).catch(error => {
        console.error('Policy mapper error:', error);
        throw new Error('Failed to analyze priorities: ' + (error.message || 'Unknown error'));
      });
      
      // Get candidate data based on mode
      let potusData: Candidate[] = [];
      let localOfficesData: { [key: string]: Candidate[] } = {};
      let regionData: string | undefined;

      try {
        // Get real-time data from APIs
        const year = formData.mode === 'current' ? new Date().getFullYear().toString() : '2024';
        
        const [candidates, civicData] = await Promise.all([
          this.fecApi.getCandidates(year).catch(error => {
            console.error('FEC API error:', error);
            throw new Error('Failed to fetch candidate data: ' + (error.message || 'Unknown error'));
          }),
          this.civicApi.getRepresentativesByAddress(formData.zipCode).catch(error => {
            console.error('Civic API error:', error);
            throw new Error('Failed to fetch representative data: ' + (error.message || 'Unknown error'));
          })
        ]);

        // Only show candidates in demo mode or if there's an upcoming election
        if (formData.mode === 'demo') {
          potusData = candidates || [];
        }
        
        // Transform civic data into our format for current representatives
        localOfficesData = civicData.offices.reduce((acc, office) => {
          const officialsList = office.officialIndices.map(index => {
            const official = civicData.officials[index];
            return {
              name: official.name,
              party: official.party,
              office: office.name,
              alignment: "⚠️", // Default to medium alignment
              platformHighlights: [],
              rationale: `Current ${office.name} representing your district`,
              officialWebsite: official.urls?.[0] || "",
              positionSummary: `${official.party} ${office.name}`
            } as Candidate;
          });
          
          acc[office.name] = officialsList;
          return acc;
        }, {} as { [key: string]: Candidate[] });
        
        regionData = civicData.normalizedInput?.city;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }

      // Generate recommendations based on mode and priorities
      const mappedTerms = analysis.mappedPriorities.map(p => p.mappedTerm);
      const recommendations = {
        potus: potusData,
        localOffices: localOfficesData,
        ballotMeasures: [],
        emailDrafts: formData.mode === 'current' ? this.generateEmailDrafts(mappedTerms) : [],
        interestGroups: this.getRelevantInterestGroups(mappedTerms),
        petitions: formData.mode === 'current' ? this.getRelevantPetitions(mappedTerms) : [],
        civicEducation: this.getCivicEducationResources(mappedTerms)
      };

      // Transform the analysis into recommendations data
      const recommendationsData: RecommendationsData = {
        mode: formData.mode,
        zipCode: formData.zipCode,
        region: regionData || 'Region not found',
        analysis: {
          summary: formData.mode === 'current' 
            ? 'Based on your priorities, we\'ve found relevant ways for you to take action and get involved in your community.'
            : 'Here are potential candidates and measures that align with your priorities for the upcoming election.',
          priorities: formData.priorities,
          conflicts: analysis.conflicts
        },
        mappedPriorities: analysis.mappedPriorities,
        recommendations
      };

      return {
        ok: true,
        data: recommendationsData
      };
    } catch (error: any) {
      console.error('Error in PrioritiesApiService:', error);
      this.toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return {
        ok: false,
        error: error.message || 'An error occurred while processing priorities'
      };
    }
  }

  async checkApiConnections(): Promise<{ fec: boolean; civic: boolean }> {
    const [fecStatus, civicStatus] = await Promise.all([
      this.fecApi.checkConnection(),
      this.civicApi.checkConnection()
    ]);

    return {
      fec: fecStatus,
      civic: civicStatus
    };
  }
}
