import { Toast } from '@/types/toast';
import { Candidate } from '@/types/api';

const MOCK_CANDIDATES: Candidate[] = [
  {
    name: "John Smith",
    party: "Democratic Party",
    office: "President",
    alignment: "✅",
    platformHighlights: [
      "Climate Change Action",
      "Healthcare Reform",
      "Education Investment"
    ],
    rationale: "Strong alignment with environmental and social policies",
    officialWebsite: "https://example.com/john-smith",
    positionSummary: "Progressive candidate focused on climate action and social justice"
  },
  {
    name: "Jane Doe",
    party: "Republican Party",
    office: "President",
    alignment: "⚠️",
    platformHighlights: [
      "Economic Growth",
      "Tax Reform",
      "Border Security"
    ],
    rationale: "Moderate alignment on economic policies",
    officialWebsite: "https://example.com/jane-doe",
    positionSummary: "Conservative candidate prioritizing economic growth"
  }
];

export class FecApiService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.open.fec.gov/v1';
  private toast: (props: Toast) => void;

  constructor(toast: (props: Toast) => void) {
    this.apiKey = import.meta.env.VITE_FEC_API_KEY;
    this.toast = toast;

    if (!this.apiKey) {
      this.toast({
        title: 'FEC API Error',
        description: 'FEC API key is not configured',
        variant: 'destructive',
      });
    }
  }

  async getCandidates(electionYear: string): Promise<Candidate[]> {
    if (!this.apiKey) {
      console.warn('FEC API key not found, using mock data');
      return MOCK_CANDIDATES;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/candidates?api_key=${this.apiKey}&election_year=${electionYear}&candidate_status=C&office=P`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch candidates from FEC API');
      }

      const data = await response.json();
      
      // Transform FEC API data into our Candidate format
      return data.results.map((candidate: any) => ({
        name: candidate.name,
        party: candidate.party_full,
        office: "President",
        alignment: "⚠️", // Default to medium alignment
        platformHighlights: [],
        rationale: "Candidate data from FEC API",
        officialWebsite: candidate.candidate_url || "",
        positionSummary: `${candidate.party_full} candidate for President`
      }));
    } catch (error: any) {
      console.warn('Failed to fetch from FEC API, using mock data:', error);
      this.toast({
        title: 'Using Demo Data',
        description: 'Could not connect to FEC API, showing example candidates',
        variant: 'default',
      });
      return MOCK_CANDIDATES;
    }
  }

  async checkConnection(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(
        `${this.baseUrl}/candidates?api_key=${this.apiKey}&per_page=1`,
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
