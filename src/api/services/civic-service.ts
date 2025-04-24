import { APIClient } from '../utils/api-client';
import { rateLimiters } from '../utils/rate-limiter';
import { caches } from '../utils/cache';
import { ValidationError } from '../utils/api-error';

/**
 * @deprecated Google Civic Information API will be deprecated on April 30, 2025.
 * TODO: Research and implement alternative data sources for representative information.
 * Potential alternatives:
 * 1. ProPublica Congress API
 * 2. OpenStates API
 * 3. Direct scraping of government websites
 * 4. Commercial data providers
 */

interface CivicApiResponse {
  offices: Array<{
    name: string;
    divisionId: string;
    levels: string[];
    roles: string[];
    officialIndices: number[];
  }>;
  officials: Array<{
    name: string;
    address?: Array<{
      line1: string;
      city: string;
      state: string;
      zip: string;
    }>;
    party: string;
    phones?: string[];
    urls?: string[];
    photoUrl?: string;
    emails?: string[];
    channels?: Array<{
      type: string;
      id: string;
    }>;
  }>;
  divisions: Record<
    string,
    {
      name: string;
      officeIndices: number[];
    }
  >;
}

interface Representative {
  name: string;
  role: string;
  party: string;
  photoUrl?: string;
  contactInfo: {
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    social?: Record<string, string>;
  };
  alignment?: '✅' | '⚠️' | '❌';
  issueAreas?: string[];
}

export class CivicService extends APIClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://civicinfo.googleapis.com/civicinfo/v2',
      apiKey,
    });
  }

  async getRepresentativesByAddress(
    address: string,
    includeOffices = true
  ): Promise<Representative[]> {
    if (!address) {
      throw new ValidationError('Address is required');
    }

    // Check rate limit
    await rateLimiters.civic.checkLimit('representatives');

    // Check cache
    const cacheKey = `${address}-${includeOffices}`;
    const cached = caches.representatives.get<Representative[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.get<CivicApiResponse>('/representatives', {
      query: {
        address,
        includeOffices: includeOffices.toString(),
      },
    });

    const representatives: Representative[] = response.offices.flatMap((office) => {
      return office.officialIndices.map((index) => {
        const official = response.officials[index];
        return {
          name: official.name,
          role: office.name,
          party: official.party,
          photoUrl: official.photoUrl,
          contactInfo: {
            address: official.address?.[0]
              ? [
                  official.address[0].line1,
                  official.address[0].city,
                  official.address[0].state,
                  official.address[0].zip,
                ].join(', ')
              : undefined,
            phone: official.phones?.[0],
            email: official.emails?.[0],
            website: official.urls?.[0],
            social: official.channels?.reduce((acc, channel) => {
              acc[channel.type.toLowerCase()] = channel.id;
              return acc;
            }, {} as Record<string, string>),
          },
          alignment: '⚠️', // Default to warning until analyzed
          issueAreas: [], // Will be populated by priority analysis
        };
      });
    });

    // Cache the results
    caches.representatives.set(cacheKey, representatives);

    return representatives;
  }

  /**
   * Validates a US ZIP code
   * @param zipCode - The ZIP code to validate
   * @returns The normalized ZIP code
   * @throws {ValidationError} If the ZIP code is invalid
   */
  private validateZipCode(zipCode: string): string {
    const normalized = zipCode.trim().slice(0, 5);
    if (!/^\d{5}$/.test(normalized)) {
      throw new ValidationError('Invalid ZIP code format');
    }
    return normalized;
  }

  /**
   * Gets representatives by ZIP code
   * This is a convenience method that wraps getRepresentativesByAddress
   */
  async getRepresentativesByZip(zipCode: string): Promise<Representative[]> {
    const normalized = this.validateZipCode(zipCode);
    return this.getRepresentativesByAddress(normalized);
  }
}
