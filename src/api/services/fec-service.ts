import { APIClient } from '../utils/api-client';
import { rateLimiters } from '../utils/rate-limiter';
import { caches } from '../utils/cache';
import { ValidationError } from '../utils/api-error';

interface FECCandidate {
  candidate_id: string;
  name: string;
  party_full: string;
  office: string;
  office_full: string;
  state: string;
  district?: string;
  incumbent_challenge_full?: string;
  principal_committees?: Array<{
    committee_id: string;
    name: string;
  }>;
}

interface FECCommittee {
  committee_id: string;
  name: string;
  treasurer_name: string;
  committee_type_full: string;
  filing_frequency: string;
  total_receipts?: number;
  total_disbursements?: number;
  cash_on_hand_end_period?: number;
}

interface CandidateDetails {
  name: string;
  party: string;
  office: string;
  alignment?: '✅' | '⚠️' | '❌';
  platformHighlights: string[];
  rationale: string;
  officialWebsite?: string;
  positionSummary: string;
  financialSummary?: {
    totalReceipts: number;
    totalDisbursements: number;
    cashOnHand: number;
  };
}

export class FECService extends APIClient {
  constructor(apiKey: string) {
    super({
      baseURL: 'https://api.open.fec.gov/v1',
      apiKey,
    });
  }

  async getCandidatesByState(
    state: string,
    electionYear: number
  ): Promise<CandidateDetails[]> {
    if (!state || state.length !== 2) {
      throw new ValidationError('Invalid state code');
    }

    // Check rate limit
    await rateLimiters.fec.checkLimit('candidates');

    // Check cache
    const cacheKey = `${state}-${electionYear}`;
    const cached = caches.candidates.get<CandidateDetails[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch candidates
    const candidates = await this.get<{ results: FECCandidate[] }>('/candidates/search', {
      query: {
        state,
        election_year: electionYear.toString(),
        sort: '-total_receipts',
        per_page: '10',
      },
    });

    // Process each candidate
    const processedCandidates = await Promise.all(
      candidates.results.map(async (candidate) => {
        let committeeData: FECCommittee | undefined;

        // Fetch committee data if available
        if (candidate.principal_committees?.[0]) {
          const committeeResponse = await this.get<{ results: FECCommittee[] }>(
            `/committee/${candidate.principal_committees[0].committee_id}`,
            {
              query: {
                per_page: '1',
              },
            }
          );
          committeeData = committeeResponse.results[0];
        }

        return {
          name: candidate.name,
          party: candidate.party_full,
          office: candidate.office_full || candidate.office,
          alignment: '⚠️', // Default to warning until analyzed
          platformHighlights: [], // Would need additional data source
          rationale: 'Alignment to be determined based on priorities',
          officialWebsite: '', // Would need additional data source
          positionSummary: `${candidate.incumbent_challenge_full || ''} candidate for ${
            candidate.office_full || candidate.office
          }`,
          ...(committeeData && {
            financialSummary: {
              totalReceipts: committeeData.total_receipts || 0,
              totalDisbursements: committeeData.total_disbursements || 0,
              cashOnHand: committeeData.cash_on_hand_end_period || 0,
            },
          }),
        };
      })
    );

    // Cache the results
    caches.candidates.set(cacheKey, processedCandidates);

    return processedCandidates;
  }

  async getCommitteeFinances(committeeId: string) {
    // Check rate limit
    await rateLimiters.fec.checkLimit('committee');

    return this.get<{ results: FECCommittee[] }>(`/committee/${committeeId}`, {
      query: {
        per_page: '1',
      },
    });
  }
}
