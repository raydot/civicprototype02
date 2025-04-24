import { PriorityService } from './services/priority-service';
import { FECService } from './services/fec-service';
import { CivicService } from './services/civic-service';
import { BallotService } from './services/ballot-service';
import { ValidationError } from './utils/api-error';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  getPriorityService(): PriorityService {
    if (!this.services.has('priority')) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new ValidationError('OpenAI API key is not configured');
      }
      this.services.set('priority', new PriorityService(apiKey));
    }
    return this.services.get('priority');
  }

  getFECService(): FECService {
    if (!this.services.has('fec')) {
      const apiKey = process.env.FEC_API_KEY;
      if (!apiKey) {
        throw new ValidationError('FEC API key is not configured');
      }
      this.services.set('fec', new FECService(apiKey));
    }
    return this.services.get('fec');
  }

  getCivicService(): CivicService {
    if (!this.services.has('civic')) {
      const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
      if (!apiKey) {
        throw new ValidationError('Google Civic API key is not configured');
      }
      this.services.set('civic', new CivicService(apiKey));
    }
    return this.services.get('civic');
  }

  getBallotService(): BallotService {
    if (!this.services.has('ballot')) {
      const apiKey = process.env.BALLOTPEDIA_API_KEY;
      if (!apiKey) {
        throw new ValidationError('Ballotpedia API key is not configured');
      }
      this.services.set('ballot', new BallotService(apiKey));
    }
    return this.services.get('ballot');
  }

  // Helper method to clear all services (useful for testing)
  clearServices(): void {
    this.services.clear();
  }
}

// Export a singleton instance
export const serviceFactory = ServiceFactory.getInstance();
