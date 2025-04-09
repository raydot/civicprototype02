import { ConfigService } from './config';

/**
 * Service for interacting with the FEC API
 */
export class FecApiService {
  private static instance: FecApiService;
  private readonly configService: ConfigService;
  private readonly baseUrl = 'https://api.open.fec.gov/v1';

  private constructor() {
    this.configService = ConfigService.getInstance();
  }

  static getInstance(): FecApiService {
    if (!FecApiService.instance) {
      FecApiService.instance = new FecApiService();
    }
    return FecApiService.instance;
  }

  /**
   * Get API key and validate it before making requests
   */
  private getValidatedApiKey(): string {
    const apiKey = this.configService.getFecApiKey();
    if (!this.configService.isValidApiKey(apiKey, 'fec')) {
      throw new Error('Invalid FEC API key format');
    }
    return apiKey;
  }

  /**
   * Make an authenticated request to the FEC API
   */
  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    const apiKey = this.getValidatedApiKey();
    const queryParams = new URLSearchParams({
      ...params,
      api_key: apiKey
    });

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`FEC API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('FEC API request failed:', error);
      throw error;
    }
  }

  /**
   * Get candidates by location
   */
  async getCandidatesByLocation(state: string, district?: string): Promise<any> {
    const params: Record<string, string> = {
      state: state,
      per_page: '20'
    };

    if (district) {
      params.district = district;
    }

    return this.makeRequest('/candidates/search', params);
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/status');
      return true;
    } catch (error) {
      console.error('FEC API connection test failed:', error);
      return false;
    }
  }
}
