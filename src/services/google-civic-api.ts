import { ConfigService } from './config';

/**
 * Service for interacting with the Google Civic Information API
 */
export class GoogleCivicApiService {
  private static instance: GoogleCivicApiService;
  private readonly configService: ConfigService;
  private readonly baseUrl = 'https://civicinfo.googleapis.com/civicinfo/v2';

  private constructor() {
    this.configService = ConfigService.getInstance();
  }

  static getInstance(): GoogleCivicApiService {
    if (!GoogleCivicApiService.instance) {
      GoogleCivicApiService.instance = new GoogleCivicApiService();
    }
    return GoogleCivicApiService.instance;
  }

  /**
   * Get API key and validate it before making requests
   */
  private getValidatedApiKey(): string {
    const apiKey = this.configService.getGoogleCivicApiKey();
    if (!this.configService.isValidApiKey(apiKey, 'google')) {
      throw new Error('Invalid Google Civic API key format');
    }
    return apiKey;
  }

  /**
   * Make an authenticated request to the Google Civic API
   */
  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    const apiKey = this.getValidatedApiKey();
    const queryParams = new URLSearchParams({
      ...params,
      key: apiKey
    });

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Google Civic API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Google Civic API request failed:', error);
      throw error;
    }
  }

  /**
   * Get representatives by address
   */
  async getRepresentativesByAddress(address: string): Promise<any> {
    return this.makeRequest('/representatives', {
      address: address
    });
  }

  /**
   * Get voter info by address
   */
  async getVoterInfo(address: string): Promise<any> {
    return this.makeRequest('/voterinfo', {
      address: address
    });
  }

  /**
   * Get election information
   */
  async getElections(): Promise<any> {
    return this.makeRequest('/elections');
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getElections();
      return true;
    } catch (error) {
      console.error('Google Civic API connection test failed:', error);
      return false;
    }
  }
}
