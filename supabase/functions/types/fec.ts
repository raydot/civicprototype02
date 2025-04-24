export interface FECCandidate {
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

export interface FECCommittee {
  committee_id: string;
  name: string;
  treasurer_name: string;
  committee_type_full: string;
  filing_frequency: string;
  total_receipts?: number;
  total_disbursements?: number;
  cash_on_hand_end_period?: number;
}

export interface FECApiResponse<T> {
  api_version: string;
  pagination: {
    count: number;
    page: number;
    pages: number;
    per_page: number;
  };
  results: T[];
}
