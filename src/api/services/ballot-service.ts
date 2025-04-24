import { APIClient } from '../utils/api-client';
import { rateLimiters } from '../utils/rate-limiter';
import { caches } from '../utils/cache';
import { ValidationError } from '../utils/api-error';

interface BallotMeasure {
  title: string;
  description: string;
  supporters: string[];
  opposers: string[];
  userConcernMapping: string;
  ballotpediaLink: string;
  electionDate?: string;
  status?: 'upcoming' | 'active' | 'passed' | 'failed';
  type?: string;
  topic?: string;
  fiscalImpact?: string;
}

interface BallotpediaApiResponse {
  data: Array<{
    title?: string;
    name?: string;
    summary?: string;
    description?: string;
    supporters?: string[];
    opponents?: string[];
    topic?: string;
    category?: string;
    url?: string;
    election_date?: string;
    measure_status?: string;
    measure_type?: string;
    fiscal_note?: string;
  }>;
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}

export class BallotService extends APIClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://api.ballotpedia.org/v3',
      apiKey,
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  async getMeasuresByState(
    state: string,
    year: number,
    options: {
      includeHistory?: boolean;
      status?: 'upcoming' | 'active' | 'all';
    } = {}
  ): Promise<BallotMeasure[]> {
    if (!state || state.length !== 2) {
      throw new ValidationError('Invalid state code');
    }

    // Check rate limit
    await rateLimiters.ballotpedia.checkLimit('measures');

    // Check cache
    const cacheKey = `${state}-${year}-${JSON.stringify(options)}`;
    const cached = caches.ballotMeasures.get<BallotMeasure[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.get<BallotpediaApiResponse>('/measures', {
      query: {
        state: state.toUpperCase(),
        year: year.toString(),
        status: options.status || 'active',
        include_history: options.includeHistory ? '1' : '0',
        per_page: '50',
      },
    });

    const measures: BallotMeasure[] = response.data.map((measure) => ({
      title: measure.title || measure.name || 'Untitled Measure',
      description: measure.summary || measure.description || 'No description available',
      supporters: measure.supporters || [],
      opposers: measure.opponents || [],
      userConcernMapping: measure.topic || measure.category || 'Uncategorized',
      ballotpediaLink: measure.url || '',
      electionDate: measure.election_date,
      status: this.normalizeStatus(measure.measure_status),
      type: measure.measure_type,
      topic: measure.topic || measure.category,
      fiscalImpact: measure.fiscal_note,
    }));

    // Cache the results
    caches.ballotMeasures.set(cacheKey, measures);

    return measures;
  }

  async searchMeasures(
    query: string,
    options: {
      state?: string;
      year?: number;
      topic?: string;
    } = {}
  ): Promise<BallotMeasure[]> {
    // Check rate limit
    await rateLimiters.ballotpedia.checkLimit('search');

    const response = await this.get<BallotpediaApiResponse>('/measures/search', {
      query: {
        q: query,
        ...(options.state && { state: options.state.toUpperCase() }),
        ...(options.year && { year: options.year.toString() }),
        ...(options.topic && { topic: options.topic }),
        per_page: '20',
      },
    });

    return response.data.map((measure) => ({
      title: measure.title || measure.name || 'Untitled Measure',
      description: measure.summary || measure.description || 'No description available',
      supporters: measure.supporters || [],
      opposers: measure.opponents || [],
      userConcernMapping: measure.topic || measure.category || 'Uncategorized',
      ballotpediaLink: measure.url || '',
      electionDate: measure.election_date,
      status: this.normalizeStatus(measure.measure_status),
      type: measure.measure_type,
      topic: measure.topic || measure.category,
      fiscalImpact: measure.fiscal_note,
    }));
  }

  private normalizeStatus(
    status?: string
  ): 'upcoming' | 'active' | 'passed' | 'failed' | undefined {
    if (!status) return undefined;

    const normalized = status.toLowerCase();
    if (normalized.includes('upcoming')) return 'upcoming';
    if (normalized.includes('active')) return 'active';
    if (normalized.includes('passed') || normalized.includes('approved')) return 'passed';
    if (normalized.includes('failed') || normalized.includes('rejected')) return 'failed';
    return undefined;
  }
}
