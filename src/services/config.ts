/**
 * Configuration service for managing API keys and environment variables
 */
export class ConfigService {
  private static instance: ConfigService;
  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get FEC API key from environment variables
   * @throws Error if API key is not set
   */
  getFecApiKey(): string {
    const apiKey = import.meta.env.VITE_FEC_API_KEY;
    if (!apiKey) {
      throw new Error('FEC API key not found in environment variables. Please set VITE_FEC_API_KEY in .env file.');
    }
    return apiKey;
  }

  /**
   * Get Google Civic API key from environment variables
   * @throws Error if API key is not set
   */
  getGoogleCivicApiKey(): string {
    const apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
    if (!apiKey) {
      throw new Error('Google Civic API key not found in environment variables. Please set VITE_GOOGLE_CIVIC_API_KEY in .env file.');
    }
    return apiKey;
  }

  /**
   * Validate that all required API keys are present
   * @throws Error if any required API key is missing
   */
  validateConfig(): void {
    try {
      this.getFecApiKey();
      this.getGoogleCivicApiKey();
    } catch (error) {
      console.error('Configuration validation failed:', error);
      throw error;
    }
  }

  /**
   * Check if an API key is valid by testing its format
   * @param apiKey The API key to validate
   * @param type The type of API key ('fec' or 'google')
   */
  isValidApiKey(apiKey: string, type: 'fec' | 'google'): boolean {
    if (!apiKey) return false;

    // FEC API keys are typically 40 characters
    if (type === 'fec') {
      return apiKey.length === 40;
    }

    // Google API keys are typically 39 characters
    if (type === 'google') {
      return apiKey.length === 39;
    }

    return false;
  }
}
