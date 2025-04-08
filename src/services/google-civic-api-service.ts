import { Toast } from '@/types/toast';

interface CivicApiResponse {
  offices: Array<{
    name: string;
    officialIndices: number[];
  }>;
  officials: Array<{
    name: string;
    party: string;
    urls?: string[];
  }>;
  normalizedInput?: {
    city: string;
    state: string;
    zip: string;
  };
}

const MOCK_CIVIC_DATA: CivicApiResponse = {
  offices: [
    {
      name: "U.S. Senate",
      officialIndices: [0, 1]
    },
    {
      name: "U.S. House",
      officialIndices: [2]
    },
    {
      name: "State Governor",
      officialIndices: [3]
    }
  ],
  officials: [
    {
      name: "Senator Alex Johnson",
      party: "Democratic Party",
      urls: ["https://example.com/alex-johnson"]
    },
    {
      name: "Senator Maria Garcia",
      party: "Republican Party",
      urls: ["https://example.com/maria-garcia"]
    },
    {
      name: "Representative Chris Lee",
      party: "Democratic Party",
      urls: ["https://example.com/chris-lee"]
    },
    {
      name: "Governor Sarah Wilson",
      party: "Republican Party",
      urls: ["https://example.com/sarah-wilson"]
    }
  ],
  normalizedInput: {
    city: "San Francisco",
    state: "CA",
    zip: "94105"
  }
};

export class GoogleCivicApiService {
  private apiKey: string | undefined;
  private baseUrl = 'https://civicinfo.googleapis.com/civicinfo/v2';
  private toast: (props: Toast) => void;

  constructor(toast: (props: Toast) => void) {
    this.apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
    this.toast = toast;

    if (!this.apiKey) {
      this.toast({
        title: 'Google Civic API Error',
        description: 'Google Civic API key is not configured',
        variant: 'destructive',
      });
    }
  }

  async getRepresentativesByAddress(zipCode: string): Promise<CivicApiResponse> {
    if (!this.apiKey) {
      console.warn('Google Civic API key not found, using mock data');
      return MOCK_CIVIC_DATA;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/representatives?key=${this.apiKey}&address=${zipCode}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch representatives from Google Civic API');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.warn('Failed to fetch from Google Civic API, using mock data:', error);
      this.toast({
        title: 'Using Demo Data',
        description: 'Could not connect to Google Civic API, showing example representatives',
        variant: 'default',
      });
      return MOCK_CIVIC_DATA;
    }
  }

  async checkConnection(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(
        `${this.baseUrl}/representatives?key=${this.apiKey}&address=94105`,
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
